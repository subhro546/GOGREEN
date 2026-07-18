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
      <div className="w-full py-16 bg-white flex items-center justify-center">
        <span className="text-text-dark/40 animate-pulse text-sm font-medium">Loading deals...</span>
      </div>
    );
  }

  if (promos.length < 5) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column (Wide Promos) */}
          <div className="flex flex-col gap-6 lg:w-[60%]">
            {[promos[0], promos[3]].map((promo) => (
              <div 
                key={promo.id} 
                className={`${promo.bgColor} ${promo.height} rounded-md relative overflow-hidden flex items-center transition-transform hover:-translate-y-1 shadow-sm hover:shadow-md`}
              >
                {/* Background Image placed on the right */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-3/5">
                  <img 
                    src={promo.image} 
                    alt={promo.title}
                    className="w-full h-full object-cover object-left mask-image-gradient-left"
                    style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%)' }}
                  />
                </div>
                
                {/* Content */}
                <div className="relative z-10 w-2/3 md:w-1/2 p-6 md:p-10 flex flex-col justify-center h-full">
                  <h3 className={`text-2xl md:text-3xl font-bold ${promo.titleColor} mb-3 leading-tight`}>
                    {promo.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base mb-6 max-w-[280px]">
                    {promo.subtitle}
                  </p>
                  <div>
                    <Link 
                      href={promo.link}
                      className="inline-block bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-semibold py-2 px-6 rounded transition-colors text-sm"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column (Square/Tall Promos) */}
          <div className="flex flex-col gap-6 lg:w-[40%]">
            {[promos[1], promos[2], promos[4]].map((promo) => (
              <div 
                key={promo.id} 
                className={`${promo.bgColor} ${promo.height} rounded-md relative overflow-hidden flex items-center transition-transform hover:-translate-y-1 shadow-sm hover:shadow-md`}
              >
                {/* Background Image */}
                <div className="absolute right-0 top-0 bottom-0 w-3/5">
                  <img 
                    src={promo.image} 
                    alt={promo.title}
                    className="w-full h-full object-cover object-left"
                    style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%)' }}
                  />
                </div>
                
                {/* Content */}
                <div className="relative z-10 w-2/3 p-6 flex flex-col justify-center h-full">
                  <h3 className={`text-xl font-bold ${promo.titleColor} mb-2 leading-tight`}>
                    {promo.title}
                  </h3>
                  <p className="text-gray-700 text-xs md:text-sm mb-4 max-w-[200px]">
                    {promo.subtitle}
                  </p>
                  <div>
                    <Link 
                      href={promo.link}
                      className="inline-block bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-semibold py-1.5 px-4 rounded transition-colors text-sm"
                    >
                      Shop Now
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
