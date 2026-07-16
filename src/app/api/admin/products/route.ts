import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { 
      name, description, price, category, subcategory, stock, images, isIndoor,
      mrp, shippingCharge, sku, weight, length, width, height,
      plantHeight, plantAge, returnable, potIncluded, isSeed,
      isFlowerPlant, isFruitPlant, maintenance, sellWithCod, plantType,
      seoTitle, seoDescription, seoKeywords
    } = body;

    // Validation
    if (!name || !description || price === undefined || !category || stock === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Default image if none provided
    const imgArray = Array.isArray(images) && images.length > 0 
      ? images 
      : ['https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=500&q=80'];

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        subcategory: (subcategory || "").trim(),
        stock: parseInt(stock),
        images: JSON.stringify(imgArray),
        isIndoor: !!isIndoor,
        mrp: mrp !== undefined && mrp !== null && mrp !== "" ? parseFloat(mrp) : null,
        shippingCharge: shippingCharge !== undefined && shippingCharge !== null && shippingCharge !== "" ? parseFloat(shippingCharge) : null,
        sku: sku || null,
        weight: weight !== undefined && weight !== null && weight !== "" ? parseFloat(weight) : null,
        length: length !== undefined && length !== null && length !== "" ? parseFloat(length) : null,
        width: width !== undefined && width !== null && width !== "" ? parseFloat(width) : null,
        height: height !== undefined && height !== null && height !== "" ? parseFloat(height) : null,
        plantHeight: plantHeight !== undefined && plantHeight !== null && plantHeight !== "" ? parseFloat(plantHeight) : null,
        plantAge: plantAge !== undefined && plantAge !== null && plantAge !== "" ? parseFloat(plantAge) : null,
        returnable: returnable === undefined ? true : !!returnable,
        potIncluded: potIncluded || "Pot Included",
        isSeed: !!isSeed,
        isFlowerPlant: !!isFlowerPlant,
        isFruitPlant: !!isFruitPlant,
        maintenance: maintenance || "Low Maintenance",
        sellWithCod: sellWithCod === undefined ? true : !!sellWithCod,
        plantType: plantType || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoKeywords: seoKeywords || null,
      },
    });

    revalidatePath('/', 'page');
    revalidatePath('/shop', 'page');

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}
