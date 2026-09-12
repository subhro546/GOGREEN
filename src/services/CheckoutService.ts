/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProductRepository } from "../interfaces/IProductRepository";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import Razorpay from "razorpay";

export class CheckoutService {
  constructor(
    private productRepository: IProductRepository,
    private orderRepository: IOrderRepository
  ) {}

  async processCheckout(
    userId: string,
    items: { id: string; quantity: number; price: number; name: string }[],
    shippingAddress: any,
    paymentMethod: string,
    couponCode?: string
  ) {
    if (!items || items.length === 0) {
      throw new Error("Cart is empty");
    }

    if (!shippingAddress) {
      throw new Error("Shipping address is required");
    }

    let totalItemsSubtotal = 0;
    let totalAmount = 0;

    for (const item of items) {
      const product = await this.productRepository.findById(item.id);
      if (!product) {
        throw new Error(`Product "${item.name}" not found`);
      }
      totalItemsSubtotal += product.price * item.quantity;
      totalAmount += product.price * item.quantity;
      if (product.shippingCharge) {
        totalAmount += product.shippingCharge * item.quantity;
      }
    }

    if (totalItemsSubtotal < 499) {
      throw new Error("Minimum purchase amount is ₹499.");
    }

    let calculatedDiscount = 0;
    if (couponCode) {
      const code = couponCode.trim().toUpperCase();
      if (code === "GOGREEN10") {
        calculatedDiscount = totalItemsSubtotal * 0.10;
      } else if (code === "WELCOME100") {
        if (totalItemsSubtotal >= 499) {
          calculatedDiscount = 100;
        }
      }
    }

    totalAmount = Math.max(0, totalAmount - calculatedDiscount);

    if (paymentMethod === "cod") {
      totalAmount += 49;
    }

    const order = await this.orderRepository.create({
      userId,
      totalAmount,
      discount: calculatedDiscount,
      status: "PENDING",
      shippingAddress,
      items: {
        create: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    });

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isMock = !keyId || !keySecret || keySecret.startsWith("PASTE_");

    let razorpayOrderId = "";
    let amount = Math.round(totalAmount * 100);
    let currency = "INR";

    if (paymentMethod === "cod") {
      razorpayOrderId = "cod_" + order.id.slice(-8);
    } else if (!isMock) {
      const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
      const razorpayOrder = await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: order.id,
      });
      razorpayOrderId = razorpayOrder.id;
      amount = Number(razorpayOrder.amount);
      currency = razorpayOrder.currency;
    } else {
      console.log("Razorpay credentials not configured. Using Mock payment flow.");
      razorpayOrderId = "order_mock_" + order.id.slice(-8);
    }

    await this.orderRepository.update(order.id, { razorpayOrderId });

    return {
      id: razorpayOrderId,
      currency,
      amount,
      orderDbId: order.id,
      isMock,
    };
  }
}
