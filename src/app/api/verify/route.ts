import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../lib/prisma";
import crypto from "crypto";
import { notifyOrderPlacement } from "../../../lib/notifications";

async function saveShippingAddress(userId: string, address: string) {
  try {
    if (!address || address.trim() === "" || address === "To be filled") return;

    const existing = await prisma.address.findFirst({
      where: {
        userId,
        address: address.trim(),
      },
    });

    if (!existing) {
      await prisma.address.create({
        data: {
          userId,
          address: address.trim(),
        },
      });
    }
  } catch (err) {
    console.error("Failed to save shipping address:", err instanceof Error ? err.message : "Unknown error");
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Authentication required to verify payment" }, { status: 401 });
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDbId } = body;

    if (!orderDbId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ message: "Missing required payment verification fields" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderDbId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Verify order ownership
    if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized: You do not own this order" }, { status: 403 });
    }

    // Check order state
    if (order.status === "PAID") {
      return NextResponse.json({ message: "Order is already paid and verified", orderId: order.id });
    }

    if (order.status === "CANCELLED") {
      return NextResponse.json({ message: "Cannot verify payment for a cancelled order" }, { status: 400 });
    }

    // COD orders must not be verified as online prepaid payments
    if (order.razorpayOrderId?.startsWith("cod_")) {
      return NextResponse.json({ message: "Cash on delivery orders cannot be verified as prepaid" }, { status: 400 });
    }

    // Ensure Razorpay order ID matches database record exactly
    if (!order.razorpayOrderId || order.razorpayOrderId !== razorpay_order_id) {
      return NextResponse.json({ message: "Razorpay order ID mismatch" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    const isProd = process.env.NODE_ENV === "production";

    if (!secret || secret.startsWith("PASTE_")) {
      if (isProd) {
        return NextResponse.json({ message: "Payment service configuration error" }, { status: 500 });
      }

      // Non-production test/development fallback ONLY when explicitly unconfigured
      if (razorpay_signature !== "mock_signature" && razorpay_signature !== "test_mock_signature") {
        return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
      }
    } else {
      const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
        .digest("hex");

      const expectedBuffer = Buffer.from(generated_signature, "utf-8");
      const receivedBuffer = Buffer.from(razorpay_signature, "utf-8");

      if (
        expectedBuffer.length !== receivedBuffer.length ||
        !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
      ) {
        return NextResponse.json({ message: "Invalid payment signature" }, { status: 400 });
      }
    }

    // Atomically transition state and decrement stock to prevent race conditions & duplicate deductions
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const current = await tx.order.findUnique({
        where: { id: order.id },
        select: { status: true },
      });

      if (current?.status === "PAID") {
        return null; // Already transitioned
      }

      const res = await tx.order.update({
        where: { id: order.id },
        data: { status: "PAID" },
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: true } },
        },
      });

      // Deduct inventory atomically
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return res;
    });

    if (updatedOrder) {
      await saveShippingAddress(updatedOrder.userId, updatedOrder.shippingAddress);
      try {
        await notifyOrderPlacement(updatedOrder);
      } catch (notifErr) {
        console.error("Order notification error during verify (non-fatal):", notifErr);
      }
    }

    return NextResponse.json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error("Verification Error:", error instanceof Error ? error.message : "Internal error");
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

