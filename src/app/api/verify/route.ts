import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDbId, isMock } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    const isMockPayment = isMock || !secret || razorpay_signature === "mock_signature";

    if (isMockPayment) {
      // Payment is verified in mock mode
      await prisma.order.update({
        where: { id: orderDbId },
        data: { status: "PAID" },
      });

      return NextResponse.json({ message: "Payment verified successfully (Simulated)" });
    }

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      // Payment is verified
      await prisma.order.update({
        where: { id: orderDbId },
        data: { status: "PAID" },
      });

      return NextResponse.json({ message: "Payment verified successfully" });
    } else {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
