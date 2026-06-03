import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../../lib/authOptions";
import { prisma } from "../../../../../../lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { action } = await req.json(); // "increase" or "decrease"
    const resolvedParams = await params;
    
    if (action !== "increase" && action !== "decrease") {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    let newStock = product.stock;
    if (action === "increase") {
      newStock += 1;
    } else if (action === "decrease") {
      newStock = Math.max(0, newStock - 1);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: resolvedParams.id },
      data: { stock: newStock },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Update Stock Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
