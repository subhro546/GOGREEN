import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import { PrismaProductRepository } from "../../../../repositories/PrismaProductRepository";
import { AdminProductService } from "../../../../services/AdminProductService";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();

    const productRepo = new PrismaProductRepository();
    const productService = new AdminProductService(productRepo);

    const product = await productService.createProduct(body);

    revalidatePath('/', 'page');
    revalidatePath('/shop', 'page');

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create product" },
      { status: 500 }
    );
  }
}
