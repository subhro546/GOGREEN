import { prisma } from "../../lib/prisma";
import ProductCard from "../../../components/Productcard";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export const dynamic = 'force-dynamic';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category;
  
  const products = await prisma.product.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
  });

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-brand/10 pb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-secondary italic mb-4">Our Plants</h1>
              <p className="text-text-dark max-w-2xl">
                Browse our entire collection of healthy, beautiful plants carefully curated for your home and office.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand/5 sticky top-28">
                <h3 className="font-bold text-lg mb-4 text-brand-secondary">Categories</h3>
                <ul className="space-y-3">
                  <li>
                    <a 
                      href="/shop" 
                      className={`block text-sm ${!category ? 'font-bold text-brand-topbar' : 'text-text-dark/70 hover:text-brand-topbar transition-colors'}`}
                    >
                      All Plants
                    </a>
                  </li>
                  {categories.map((c) => (
                    <li key={c.category}>
                      <a 
                        href={`/shop?category=${encodeURIComponent(c.category)}`}
                        className={`block text-sm ${category === c.category ? 'font-bold text-brand-topbar' : 'text-text-dark/70 hover:text-brand-topbar transition-colors'}`}
                      >
                        {c.category}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              {products.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-brand/5 shadow-sm">
                  <span className="text-4xl mb-4 block">🌵</span>
                  <h3 className="text-xl font-bold text-brand-secondary">No plants found</h3>
                  <p className="text-text-dark/60 mt-2">Try adjusting your filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      category={product.category}
                      images={product.images}
                      description={product.description ?? undefined}
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
