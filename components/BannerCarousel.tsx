/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Banner {
  id: string;
  src: string;
  alt: string;
}

const BannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/banners')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBanners(data);
        }
      })
      .catch((err) => console.error("Failed to load banners:", err))
      .finally(() => setLoading(false));
  }, []);

  const next = useCallback(() => {
    if (banners.length === 0) return;
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    if (banners.length === 0) return;
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next, banners.length]);

  if (loading) {
    return (
      <div className="w-full aspect-[21/9] sm:aspect-[2.5/1] bg-brand-hero flex items-center justify-center">
        <span className="text-text-dark/40 animate-pulse text-sm font-medium">Loading showcase...</span>
      </div>
    );
  }

  if (banners.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-brand-hero">
      <div className="relative w-full aspect-[21/9] sm:aspect-[2.5/1]">
        {/* Images */}
        {banners.map((banner, idx) => (
          <img
            key={banner.id}
            src={banner.src}
            alt={banner.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              idx === current ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />

        {/* Nav arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2.5 rounded-full shadow transition-all hover:scale-110 z-10"
              aria-label="Previous"
            >
              <FaChevronLeft size={14} />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2.5 rounded-full shadow transition-all hover:scale-110 z-10"
              aria-label="Next"
            >
              <FaChevronRight size={14} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === current ? 'bg-white w-5' : 'bg-white/50 w-2'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BannerCarousel;
