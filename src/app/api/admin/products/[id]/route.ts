import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/authOptions";
import { prisma } from "../../../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath('/', 'page');
    revalidatePath('/shop', 'page');
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { 
      name, description, price, category, subcategory, stock, images, isIndoor,
      mrp, shippingCharge, sku, weight, length, width, height,
      plantHeight, plantAge, returnable, potIncluded, isSeed,
      isFlowerPlant, isFruitPlant, maintenance, sellWithCod, plantType,
      seoTitle, seoDescription, seoKeywords
    } = body;

    const updateData: Prisma.ProductUpdateInput = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (category !== undefined) updateData.category = category;
    if (subcategory !== undefined) updateData.subcategory = subcategory;
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (images !== undefined) {
      const imgArray = Array.isArray(images) ? images : [images];
      updateData.images = JSON.stringify(imgArray);
    }
    if (isIndoor !== undefined) updateData.isIndoor = !!isIndoor;
    if (mrp !== undefined) updateData.mrp = mrp !== null && mrp !== "" ? parseFloat(mrp as string) : null;
    if (shippingCharge !== undefined) updateData.shippingCharge = shippingCharge !== null && shippingCharge !== "" ? parseFloat(shippingCharge as string) : null;
    if (sku !== undefined) updateData.sku = sku || null;
    if (weight !== undefined) updateData.weight = weight !== null && weight !== "" ? parseFloat(weight as string) : null;
    if (length !== undefined) updateData.length = length !== null && length !== "" ? parseFloat(length as string) : null;
    if (width !== undefined) updateData.width = width !== null && width !== "" ? parseFloat(width as string) : null;
    if (height !== undefined) updateData.height = height !== null && height !== "" ? parseFloat(height as string) : null;
    if (plantHeight !== undefined) updateData.plantHeight = plantHeight !== null && plantHeight !== "" ? parseFloat(plantHeight as string) : null;
    if (plantAge !== undefined) updateData.plantAge = plantAge !== null && plantAge !== "" ? parseFloat(plantAge as string) : null;
    if (returnable !== undefined) updateData.returnable = !!returnable;
    if (potIncluded !== undefined) updateData.potIncluded = potIncluded;
    if (isSeed !== undefined) updateData.isSeed = !!isSeed;
    if (isFlowerPlant !== undefined) updateData.isFlowerPlant = !!isFlowerPlant;
    if (isFruitPlant !== undefined) updateData.isFruitPlant = !!isFruitPlant;
    if (maintenance !== undefined) updateData.maintenance = maintenance;
    if (sellWithCod !== undefined) updateData.sellWithCod = !!sellWithCod;
    if (plantType !== undefined) updateData.plantType = plantType || null;
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle || null;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription || null;
    if (seoKeywords !== undefined) updateData.seoKeywords = seoKeywords || null;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/', 'page');
    revalidatePath('/shop', 'page');
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 }
    );
  }
}
