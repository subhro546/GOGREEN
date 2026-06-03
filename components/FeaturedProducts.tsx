import ProductCard from './Productcard';
import Link from 'next/link';
import { prisma } from '../src/lib/prisma';

const FeaturedProducts = async () => {
  const products = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold tracking-widest text-brand-topbar uppercase mb-2">Top Picks</h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-text-dark italic">Featured Plants</h3>
            <p className="mt-4 text-text-dark/70">
              Discover our most popular plants, carefully nurtured and ready to breathe life into your space. 
              Perfect for beginners and seasoned plant parents alike.
            </p>
          </div>
          <Link href="/shop" className="group flex items-center gap-2 font-semibold text-brand-secondary hover:text-brand-topbar transition-colors whitespace-nowrap">
            View All Plants
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transform group-hover:translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;
