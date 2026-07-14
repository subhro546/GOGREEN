import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// Public API — returns category → subcategory tree built from actual product data
export async function GET() {
  try {
    // Fetch distinct category + subcategory pairs from products
    const products = await prisma.product.findMany({
      select: { category: true, subcategory: true },
      distinct: ["category", "subcategory"],
      orderBy: [{ category: "asc" }, { subcategory: "asc" }],
    });

    // Also fetch category metadata (image, tag) from the Category table
    const categoryMeta = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    const metaMap = new Map(categoryMeta.map((c) => [c.name, c]));

    // Build tree: { name, image, tag, subcategories: string[] }
    const tree: {
      name: string;
      image: string;
      tag: string;
      subcategories: string[];
    }[] = [];

    const categoryMap = new Map<string, string[]>();

    for (const p of products) {
      if (!categoryMap.has(p.category)) {
        categoryMap.set(p.category, []);
      }
      if (p.subcategory && p.subcategory.trim() !== "") {
        const subs = categoryMap.get(p.category)!;
        if (!subs.includes(p.subcategory)) {
          subs.push(p.subcategory);
        }
      }
    }

    for (const [catName, subs] of categoryMap) {
      const meta = metaMap.get(catName);
      tree.push({
        name: catName,
        image: meta?.image || "",
        tag: meta?.tag || "",
        subcategories: subs.sort(),
      });
    }

    // Sort alphabetically
    tree.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(tree);
  } catch (error) {
    console.error("Get menu categories error:", error);
    return NextResponse.json(
      { message: "Failed to get menu data" },
      { status: 500 }
    );
  }
}
