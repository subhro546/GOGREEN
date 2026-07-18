import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
          { subcategory: { contains: query, mode: "insensitive" } },
        ]
      },
      take: 5,
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
        images: true,
      }
    });

    const serialized = products.map((p) => {
      let imageUrl = "/placeholder.png";
      try {
        const parsed = JSON.parse(p.images || "[]");
        if (Array.isArray(parsed) && parsed.length > 0) {
          imageUrl = parsed[0];
        }
      } catch {}
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        imageUrl,
      };
    });

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ message: "Failed to search" }, { status: 500 });
  }
}
