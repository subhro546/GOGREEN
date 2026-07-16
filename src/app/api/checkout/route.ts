import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../lib/prisma";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isMock = !keyId || !keySecret;

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Please log in to checkout." }, { status: 401 });
    }

    const body = await req.json();
    const { items, shippingAddress, paymentMethod } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }
    
    if (!shippingAddress) {
      return NextResponse.json({ message: "Shipping address is required" }, { status: 400 });
    }

    // Verify prices from DB
    let totalAmount = 0;
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });
      if (!product) {
        return NextResponse.json({ message: `Product "${item.name}" not found` }, { status: 404 });
      }
      totalAmount += product.price * item.quantity;
    }

    // Add extra 49 rupees if COD order
    if (paymentMethod === "cod") {
      totalAmount += 49;
    }

    // Create DB Order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount,
        status: "PENDING",
        shippingAddress,
        items: {
          create: items.map((item: { id: string, quantity: number, price: number }) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    let razorpayOrderId = "";
    let amount = Math.round(totalAmount * 100);
    let currency = "INR";

    if (paymentMethod === "cod") {
      razorpayOrderId = "cod_" + order.id.slice(-8);
    } else if (!isMock) {
      // Create Razorpay Order
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

    // Update DB Order with Razorpay Order ID
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId },
    });

    return NextResponse.json({
      id: razorpayOrderId,
      currency,
      amount,
      orderDbId: order.id,
      isMock,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Something went wrong during checkout." },
      { status: 500 }
    );
  }
}
