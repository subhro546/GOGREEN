import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { PrismaProductRepository } from "../../../repositories/PrismaProductRepository";
import { PrismaOrderRepository } from "../../../repositories/PrismaOrderRepository";
import { CheckoutService } from "../../../services/CheckoutService";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Please log in to checkout." }, { status: 401 });
    }

    const body = await req.json();
    const { items, shippingAddress, paymentMethod, couponCode } = body;

    const productRepo = new PrismaProductRepository();
    const orderRepo = new PrismaOrderRepository();
    const checkoutService = new CheckoutService(productRepo, orderRepo);

    const result = await checkoutService.processCheckout(
      session.user.id,
      items,
      shippingAddress,
      paymentMethod,
      couponCode
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Something went wrong during checkout." },
      { status: 500 }
    );
  }
}
