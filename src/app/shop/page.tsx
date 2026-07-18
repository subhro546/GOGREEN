import { prisma } from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import ProductCard from "../../../components/Productcard";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ShopSidebar from "../../../components/ShopSidebar";
import ShopFilterHeader from "../../../components/ShopFilterHeader";

export const dynamic = 'force-dynamic';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; subcategory?: string; search?: string; sort?: string; stock?: string }>;
}) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category;
  const subcategory = resolvedParams.subcategory;
  const search = resolvedParams.search;
  const sort = resolvedParams.sort || "newest";
  const stockOnly = resolvedParams.stock === "true";
  
  // Build query where filter
  const where: Prisma.ProductWhereInput = {};
  if (category) where.category = category;
  if (subcategory) where.subcategory = subcategory;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } }
    ];
  }
  if (stockOnly) {
    where.stock = { gt: 0 };
  }

  // Sorting
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price-asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price-desc") {
    orderBy = { price: "desc" };
  } else if (sort === "newest") {
    orderBy = { createdAt: "desc" };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
  });

  // Build category → subcategory tree for sidebar
  const allProducts = await prisma.product.findMany({
    select: { category: true, subcategory: true },
    distinct: ["category", "subcategory"],
    orderBy: [{ category: "asc" }, { subcategory: "asc" }],
  });

  const categoryTree: { name: string; subcategories: string[] }[] = [];
  const catMap = new Map<string, string[]>();
  for (const p of allProducts) {
    if (!catMap.has(p.category)) catMap.set(p.category, []);
    if (p.subcategory && p.subcategory.trim() !== "") {
      const subs = catMap.get(p.category)!;
      if (!subs.includes(p.subcategory)) subs.push(p.subcategory);
    }
  }
  for (const [catName, subs] of catMap) {
    categoryTree.push({ name: catName, subcategories: subs.sort() });
  }
  categoryTree.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-brand/10 pb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-secondary italic mb-4">
                {subcategory ? subcategory : category ? category : 'Our Plants'}
              </h1>
              <p className="text-text-dark max-w-2xl">
                {subcategory
                  ? `Showing all ${subcategory} plants${category ? ` in ${category}` : ''}.`
                  : category
                    ? `Browse all plants in the ${category} category.`
                    : 'Browse our entire collection of healthy, beautiful plants carefully curated for your home and office.'}
              </p>
            </div>
          </div>

          {/* Filter & Search Header */}
          <ShopFilterHeader />

          <div className="flex flex-col md:flex-row gap-8">
            <ShopSidebar
              categoryTree={categoryTree}
              activeCategory={category || null}
              activeSubcategory={subcategory || null}
            />

            {/* Product Grid */}
            <div className="flex-1">
              {products.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-brand/5 shadow-sm">
                  <span className="text-4xl mb-4 block">🌵</span>
                  <h3 className="text-xl font-bold text-brand-secondary">No plants found</h3>
                  <p className="text-text-dark/60 mt-2">Try adjusting your filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      description={product.description ?? undefined}
                      isSlider={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
