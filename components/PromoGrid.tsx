/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Promo {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  bgColor: string;
  titleColor: string;
  colSpan: string;
  height: string;
}

export default function PromoGrid() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/promos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPromos(data);
        }
      })
      .catch((err) => console.error("Failed to load promotional grid:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full py-20 bg-white dark:bg-[#0b130e] flex items-center justify-center transition-colors">
        <span className="text-gray-400 dark:text-gray-500 animate-pulse text-sm font-medium tracking-wide">
          Loading deals...
        </span>
      </div>
    );
  }

  if (promos.length < 5) return null;

  return (
    <section className="w-full py-10 sm:py-14 md:py-16 bg-white dark:bg-[#0b130e] transition-colors duration-300">
      {/* Whole width container matching other full-width sections */}
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16">
        
        <div className="flex flex-col lg:flex-row gap-5 md:gap-6 w-full">
          
          {/* Left Column (Wide Promos) */}
          <div className="flex flex-col gap-5 md:gap-6 lg:w-[58%]">
            {[promos[0], promos[3]].map((promo) => (
              <div 
                key={promo.id} 
                className="group relative h-[300px] sm:h-[340px] md:h-[370px] w-full rounded-2xl sm:rounded-3xl overflow-hidden flex items-center transition-all duration-500 hover:-translate-y-1.5 shadow-md hover:shadow-2xl border border-white/50 dark:border-white/10 backdrop-blur-xl bg-white/20 dark:bg-white/[0.04]"
              >
                {/* Full Background Image */}
                {promo.image && (
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <img 
                      src={promo.image} 
                      alt={promo.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.opacity = '0';
                      }}
                    />
                    {/* Glassy Translucent Gradient Scrim - No solid colors */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-white/10 dark:from-[#0b130e]/85 dark:via-[#0b130e]/45 dark:to-transparent/20 backdrop-blur-[1.5px]" />
                  </div>
                )}

                {/* Subtle specular glass highlight sheen */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10 dark:from-white/10 dark:via-transparent dark:to-black/30 pointer-events-none z-[2]" />

                {/* Content Overlay */}
                <div className="relative z-10 w-full sm:w-2/3 md:w-3/5 p-6 sm:p-8 md:p-10 flex flex-col justify-center h-full">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-tight tracking-tight drop-shadow-sm">
                    {promo.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base mb-5 sm:mb-6 max-w-[340px] font-medium leading-relaxed drop-shadow-sm">
                    {promo.subtitle}
                  </p>
                  <div>
                    <Link 
                      href={promo.link}
                      className="inline-flex items-center gap-2 bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-300 text-sm shadow-md hover:shadow-xl hover:scale-105 active:scale-95 backdrop-blur-md border border-white/20"
                    >
                      <span>Shop Now</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column (Stacked Promos) */}
          <div className="flex flex-col gap-5 md:gap-6 lg:w-[42%]">
            {[promos[1], promos[2], promos[4]].map((promo) => (
              <div 
                key={promo.id} 
                className="group relative h-[210px] sm:h-[225px] md:h-[235px] w-full rounded-2xl sm:rounded-3xl overflow-hidden flex items-center transition-all duration-500 hover:-translate-y-1.5 shadow-md hover:shadow-2xl border border-white/50 dark:border-white/10 backdrop-blur-xl bg-white/20 dark:bg-white/[0.04]"
              >
                {/* Full Background Image */}
                {promo.image && (
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <img 
                      src={promo.image} 
                      alt={promo.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.opacity = '0';
                      }}
                    />
                    {/* Glassy Translucent Gradient Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-white/10 dark:from-[#0b130e]/85 dark:via-[#0b130e]/45 dark:to-transparent/20 backdrop-blur-[1.5px]" />
                  </div>
                )}

                {/* Subtle specular glass highlight sheen */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10 dark:from-white/10 dark:via-transparent dark:to-black/30 pointer-events-none z-[2]" />

                {/* Content Overlay */}
                <div className="relative z-10 w-full sm:w-3/4 p-5 sm:p-6 md:p-7 flex flex-col justify-center h-full">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white mb-1.5 sm:mb-2 leading-tight tracking-tight drop-shadow-sm">
                    {promo.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm mb-3.5 sm:mb-4 max-w-[260px] font-medium leading-relaxed drop-shadow-sm">
                    {promo.subtitle}
                  </p>
                  <div>
                    <Link 
                      href={promo.link}
                      className="inline-flex items-center gap-1.5 bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-bold py-1.5 sm:py-2 px-4 sm:px-5 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm shadow-md hover:shadow-xl hover:scale-105 active:scale-95 backdrop-blur-md border border-white/20"
                    >
                      <span>Shop Now</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
