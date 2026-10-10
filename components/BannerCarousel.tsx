/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

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

  // Ensure there are at least 3 slides so prev and next always exist
  const displayBanners = useMemo(() => {
    if (banners.length === 0) return [];
    if (banners.length === 1) return banners;
    if (banners.length === 2) {
      return [
        { ...banners[0], id: `${banners[0].id}_a` },
        { ...banners[1], id: `${banners[1].id}_a` },
        { ...banners[0], id: `${banners[0].id}_b` },
        { ...banners[1], id: `${banners[1].id}_b` },
      ];
    }
    return banners;
  }, [banners]);

  const total = displayBanners.length;

  const next = useCallback(() => {
    if (total === 0) return;
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    if (total === 0) return;
    setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  useEffect(() => {
    if (total <= 1 || isHovered) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, total, isHovered]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) next();
    if (diff < -50) prev();
    setTouchStart(null);
  };

  if (loading) {
    return (
      <div className="w-full h-[260px] sm:h-[380px] md:h-[460px] bg-brand-hero/40 flex items-center justify-center">
        <span className="text-text-dark/40 animate-pulse text-sm font-medium">Loading showcase...</span>
      </div>
    );
  }

  if (displayBanners.length === 0) return null;

  // Single banner fallback
  if (displayBanners.length === 1) {
    return (
      <section className="w-full py-4 sm:py-8 bg-gradient-to-b from-brand-hero/30 via-white to-transparent overflow-hidden">
        <div className="w-full px-4 sm:px-8 md:px-12">
          <div className="relative w-full h-[240px] sm:h-[360px] md:h-[440px] rounded-3xl overflow-hidden shadow-xl">
            <img
              src={displayBanners[0].src}
              alt={displayBanners[0].alt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="w-full py-6 sm:py-10 bg-gradient-to-b from-brand-hero/20 via-white to-transparent overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── FULL SCREEN 3D SLIDESHOW STAGE ── */}
      <div className="relative w-full h-[240px] sm:h-[360px] md:h-[440px] lg:h-[480px] flex items-center justify-center overflow-hidden">
        {displayBanners.map((banner, idx) => {
          // Calculate circular distance from current
          let diff = (idx - current) % total;
          if (diff < -Math.floor(total / 2)) diff += total;
          if (diff > Math.floor(total / 2)) diff -= total;

          let transform = '';
          let opacity = 0;
          let filter = 'blur(12px)';
          let zIndex = 0;
          let cursor = 'default';
          let isCenter = false;

          if (diff === 0) {
            // Active center slide: Crisp, 100% focused, prominent
            transform = 'translateX(0%) scale(1)';
            opacity = 1;
            filter = 'blur(0px)';
            zIndex = 20;
            isCenter = true;
          } else if (diff === -1) {
            // Previous slide: Peeking ~25% on the left, 25% blurred
            transform = 'translateX(-88%) scale(0.92)';
            opacity = 0.65;
            filter = 'blur(6px)';
            zIndex = 10;
            cursor = 'pointer';
          } else if (diff === 1) {
            // Next slide: Peeking ~25% on the right, 25% blurred
            transform = 'translateX(88%) scale(0.92)';
            opacity = 0.65;
            filter = 'blur(6px)';
            zIndex = 10;
            cursor = 'pointer';
          } else {
            // Offstage slides
            transform = `translateX(${diff > 0 ? 160 : -160}%) scale(0.8)`;
            opacity = 0;
            filter = 'blur(12px)';
            zIndex = 0;
          }

          return (
            <div
              key={banner.id}
              onClick={() => {
                if (diff === -1) prev();
                if (diff === 1) next();
              }}
              style={{
                transform,
                opacity,
                filter,
                zIndex,
                cursor,
              }}
              className="absolute w-[72vw] sm:w-[58vw] md:w-[54vw] h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            >
              <img
                src={banner.src}
                alt={banner.alt}
                className="w-full h-full object-cover select-none"
                draggable={false}
              />

              {/* Gradient lighting overlay */}
              <div
                className={`absolute inset-0 transition-opacity duration-700 ${
                  isCenter
                    ? 'bg-gradient-to-t from-black/40 via-transparent to-black/10'
                    : 'bg-black/25'
                }`}
              />

              {/* Caption on center slide */}
              {isCenter && banner.alt && (
                <div className="absolute bottom-6 left-6 right-6 text-white text-shadow-sm pointer-events-none hidden sm:block">
                  <p className="text-xs font-semibold tracking-widest uppercase text-emerald-300 drop-shadow">
                    GoGreen Showcase
                  </p>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold italic drop-shadow-md">
                    {banner.alt}
                  </h3>
                </div>
              )}
            </div>
          );
        })}

        {/* ── FLOATING NAVIGATION CHEVRONS ── */}
        <button
          onClick={prev}
          className="absolute left-3 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-30 backdrop-blur-md border border-white/60"
          aria-label="Previous slide"
        >
          <FaChevronLeft size={16} />
        </button>

        <button
          onClick={next}
          className="absolute right-3 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-30 backdrop-blur-md border border-white/60"
          aria-label="Next slide"
        >
          <FaChevronRight size={16} />
        </button>
      </div>

      {/* ── DOT INDICATORS ── */}
      <div className="flex justify-center items-center gap-2 mt-5">
        {displayBanners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current
                ? 'bg-brand-secondary w-7'
                : 'bg-gray-300 w-2 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default BannerCarousel;

