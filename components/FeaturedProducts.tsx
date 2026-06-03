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

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="inline-block bg-yellow-100 text-yellow-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-3 border border-yellow-200">
              Top Picks
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 italic">
              Featured Plants
            </h2>
            <p className="mt-3 text-gray-500">
              Our most loved plants, hand-picked for your home and office.
            </p>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-2 font-bold text-yellow-900 bg-yellow-400 hover:bg-yellow-300 px-6 py-3 rounded-full transition-all whitespace-nowrap shadow-sm"
          >
            View All Plants
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transform group-hover:translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Bottom CTA banner */}
        <div className="mt-16 rounded-3xl overflow-hidden relative shadow-lg"
          style={{ background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 50%, #f9a825 100%)' }}>
          <div className="px-8 py-10 md:flex items-center justify-between gap-6 relative z-10">
            <div>
              <p className="text-green-100 text-sm font-semibold uppercase tracking-widest mb-1">🎉 Limited Time</p>
              <h3 className="text-white text-2xl md:text-3xl font-serif font-bold italic">
                Get 10% off your first order!
              </h3>
              <p className="text-green-100 mt-1 text-sm">Use code <span className="font-bold bg-white/20 px-2 py-0.5 rounded">GOGREEN10</span> at checkout</p>
            </div>
            <Link
              href="/shop"
              className="mt-6 md:mt-0 inline-flex items-center gap-2 bg-white text-green-700 font-bold py-3 px-8 rounded-full hover:bg-green-50 transition-all shadow-md hover:scale-105 shrink-0"
            >
              🛒 Shop Now
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;
