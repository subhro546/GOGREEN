import { IProductRepository } from "../interfaces/IProductRepository";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { prisma } from "../lib/prisma";
import { notifyOrderPlacement } from "../lib/notifications";
import Razorpay from "razorpay";

export interface CartCheckoutItem {
  id: string;
  quantity: number;
}

export class CheckoutService {
  constructor(
    private productRepository: IProductRepository,
    private orderRepository: IOrderRepository
  ) {}

  async processCheckout(
    userId: string,
    items: CartCheckoutItem[],
    shippingAddress: string,
    paymentMethod: string,
    couponCode?: string
  ) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Cart is empty");
    }

    if (items.length > 50) {
      throw new Error("Too many unique items in cart");
    }

    if (!shippingAddress || typeof shippingAddress !== "string" || !shippingAddress.trim()) {
      throw new Error("A valid shipping address is required");
    }

    const cleanAddress = shippingAddress.trim().slice(0, 1000);

    const cleanMethod = paymentMethod?.toLowerCase()?.trim();
    if (cleanMethod !== "prepaid" && cleanMethod !== "cod") {
      throw new Error("Invalid payment method selected");
    }

    // Validate quantities and collect unique items
    const sanitizedItems: { id: string; quantity: number }[] = [];
    for (const item of items) {
      if (!item || typeof item.id !== "string" || !item.id.trim()) {
        throw new Error("Invalid item in cart");
      }
      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty < 1 || qty > 50) {
        throw new Error("Quantity must be a positive integer between 1 and 50");
      }
      sanitizedItems.push({ id: item.id.trim(), quantity: qty });
    }

    // Verify products exist, check stock, and calculate authoritative pricing from DB
    let totalItemsSubtotal = 0;
    let totalShipping = 0;
    const verifiedProducts: Array<{
      id: string;
      name: string;
      price: number;
      stock: number;
      quantity: number;
      shippingCharge: number;
    }> = [];

    for (const item of sanitizedItems) {
      const product = await this.productRepository.findById(item.id);
      if (!product) {
        throw new Error("Product not found");
      }

      if (cleanMethod === "cod" && product.sellWithCod === false) {
        throw new Error(
          `Cash on Delivery is not available for "${product.name}". Please pay online via UPI/Cards.`
        );
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for "${product.name}". Only ${product.stock} available.`
        );
      }

      const itemShipping = (product.shippingCharge || 0) * item.quantity;
      totalItemsSubtotal += product.price * item.quantity;
      totalShipping += itemShipping;

      verifiedProducts.push({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        quantity: item.quantity,
        shippingCharge: itemShipping,
      });
    }

    if (totalItemsSubtotal <= 0) {
      throw new Error("Invalid order total.");
    }

    let calculatedDiscount = 0;
    if (couponCode && typeof couponCode === "string") {
      const code = couponCode.trim().toUpperCase();
      if (code === "GOGREEN10") {
        calculatedDiscount = totalItemsSubtotal * 0.10;
      } else if (code === "WELCOME100") {
        if (totalItemsSubtotal >= 499) {
          calculatedDiscount = 100;
        }
      }
    }

    let totalAmount = Math.max(0, totalItemsSubtotal + totalShipping - calculatedDiscount);

    if (cleanMethod === "cod") {
      if (totalItemsSubtotal >= 1000) {
        throw new Error("Cash on Delivery is only available for orders below ₹1000.");
      }
      totalAmount += 49; // Standard COD fee
    }

    // Explicit Cash on Delivery flow: Atomically verify stock, decrement inventory, and create order
    if (cleanMethod === "cod") {
      const order = await prisma.$transaction(async (tx) => {
        // Re-check inventory atomically
        for (const vp of verifiedProducts) {
          const current = await tx.product.findUnique({
            where: { id: vp.id },
            select: { stock: true, name: true },
          });
          if (!current || current.stock < vp.quantity) {
            throw new Error(`Insufficient stock for "${vp.name}". Please update your cart.`);
          }
        }

        // Decrement stock
        for (const vp of verifiedProducts) {
          await tx.product.update({
            where: { id: vp.id },
            data: { stock: { decrement: vp.quantity } },
          });
        }

        // Create COD order
        const createdOrder = await tx.order.create({
          data: {
            userId,
            totalAmount,
            discount: calculatedDiscount,
            status: "PENDING", // PENDING fulfillment, NOT paid
            shippingAddress: cleanAddress,
            razorpayOrderId: `cod_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            items: {
              create: verifiedProducts.map((p) => ({
                productId: p.id,
                quantity: p.quantity,
                price: p.price, // STRICTLY TRUSTED DATABASE PRICE
              })),
            },
          },
          include: {
            user: { select: { name: true, email: true } },
            items: { include: { product: true } },
          },
        });

        return createdOrder;
      });

      // Send placement notification (resilient: failed notifications never interrupt checkout)
      try {
        await notifyOrderPlacement(order);
      } catch (notifErr) {
        console.error("Order notification error (non-fatal):", notifErr);
      }

      return {
        id: order.razorpayOrderId,
        orderDbId: order.id,
        paymentMethod: "cod",
        totalAmount: order.totalAmount,
        currency: "INR",
        success: true,
      };
    }

    // Prepaid flow: Create pending order with trusted prices; stock is decremented upon payment verification
    const order = await this.orderRepository.create({
      userId,
      totalAmount,
      discount: calculatedDiscount,
      status: "PENDING",
      shippingAddress: cleanAddress,
      items: {
        create: verifiedProducts.map((p) => ({
          productId: p.id,
          quantity: p.quantity,
          price: p.price, // STRICTLY TRUSTED DATABASE PRICE
        })),
      },
    });

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isMock = !keyId || !keySecret || keySecret.startsWith("PASTE_");
    const isProd = process.env.NODE_ENV === "production";

    let razorpayOrderId = "";
    const amount = Math.round(totalAmount * 100);
    const currency = "INR";

    if (!isMock) {
      const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
      const razorpayOrder = await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: order.id,
      });
      razorpayOrderId = razorpayOrder.id;
    } else {
      if (isProd) {
        throw new Error("Payment gateway is not properly configured for production.");
      }
      razorpayOrderId = `order_mock_${order.id.slice(-8)}`;
    }

    await this.orderRepository.update(order.id, { razorpayOrderId });

    return {
      id: razorpayOrderId,
      currency,
      amount,
      orderDbId: order.id,
      isMock,
      paymentMethod: "prepaid",
    };
  }
}

