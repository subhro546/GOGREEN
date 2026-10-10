"use client";

import { useRef, useState } from 'react';
import Link from 'next/link';
import ProductCard from './Productcard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ProductData {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string | null;
  images?: string | null;
  sku?: string | null;
  weight?: number | null;
  potIncluded?: string;
  mrp?: number | null;
  shippingCharge?: number | null;
}

export default function FeaturedProductsSlider({ products }: { products: ProductData[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = Math.min(scrollRef.current.clientWidth * 0.75, 640);
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="w-full pt-8 pb-14 bg-white overflow-hidden relative">
      {/* ── HEADER WITH GENEROUS SIDE PADDING ── */}
      <div className="w-full px-6 sm:px-14 md:px-20 lg:px-28 flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <span className="inline-block bg-emerald-50 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full mb-2 border border-emerald-200 uppercase tracking-wider">
            🌿 Top Picks
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 italic tracking-tight">
            Featured Plants
          </h2>
          <p className="mt-1 text-sm sm:text-base text-gray-500 max-w-xl">
            Our most loved nursery favorites, hand-picked and ready to thrive.
          </p>
        </div>

        {/* Controls & View All */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-end">
          {/* Slide Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                canScrollLeft
                  ? 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:scale-105 active:scale-95 shadow-sm'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-50'
              }`}
              aria-label="Slide left"
            >
              <FaChevronLeft size={13} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                canScrollRight
                  ? 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:scale-105 active:scale-95 shadow-sm'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-50'
              }`}
              aria-label="Slide right"
            >
              <FaChevronRight size={13} />
            </button>
          </div>

          <Link
            href="/shop"
            className="flex items-center gap-2 font-bold text-xs sm:text-sm text-yellow-900 bg-yellow-400 hover:bg-yellow-300 px-5 py-2.5 rounded-full transition-all whitespace-nowrap shadow-sm hover:shadow"
          >
            <span>View All</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* ── SINGLE ROW SLIDING TRACK WITH FROSTED BLURRED EDGES ── */}
      <div className="w-full relative group">
        {/* Left edge blur overlay */}
        <div
          className={`absolute left-0 top-0 bottom-6 w-8 sm:w-16 md:w-24 bg-gradient-to-r from-white via-white/80 to-transparent backdrop-blur-[2px] pointer-events-none z-10 transition-opacity duration-300 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Right edge blur overlay */}
        <div
          className={`absolute right-0 top-0 bottom-6 w-8 sm:w-16 md:w-24 bg-gradient-to-l from-white via-white/80 to-transparent backdrop-blur-[2px] pointer-events-none z-10 transition-opacity duration-300 ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Sliding cards container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="w-full flex flex-nowrap overflow-x-auto gap-4 sm:gap-6 px-6 sm:px-14 md:px-20 lg:px-28 pb-6 pt-2 snap-x snap-mandatory scroll-smooth scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[260px] sm:w-[280px] md:w-[310px] shrink-0 snap-start transition-transform hover:-translate-y-1 duration-300"
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                category={product.category}
                description={product.description ?? undefined}
                images={product.images ?? undefined}
                sku={product.sku}
                weight={product.weight}
                potIncluded={product.potIncluded}
                mrp={product.mrp}
                shippingCharge={product.shippingCharge}
                isSlider={true}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM CTA BANNER ── */}
      <div className="w-full px-6 sm:px-14 md:px-20 lg:px-28 mt-6">
        <div
          className="rounded-3xl overflow-hidden relative shadow-lg"
          style={{ background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 50%, #f9a825 100%)' }}
        >
          <div className="px-6 sm:px-10 py-8 sm:py-10 md:flex items-center justify-between gap-6 relative z-10">
            <div>
              <p className="text-green-100 text-xs font-semibold uppercase tracking-widest mb-1">🎉 Limited Time</p>
              <h3 className="text-white text-2xl md:text-3xl font-serif font-bold italic">
                Get 10% off your first order!
              </h3>
              <p className="text-green-100 mt-1 text-sm">
                Use code <span className="font-bold bg-white/20 px-2 py-0.5 rounded">GOGREEN10</span> at checkout
              </p>
            </div>
            <Link
              href="/shop"
              className="mt-5 md:mt-0 inline-flex items-center gap-2 bg-white text-green-700 font-bold py-3 px-8 rounded-full hover:bg-green-50 transition-all shadow-md hover:scale-105 shrink-0"
            >
              🛒 Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
