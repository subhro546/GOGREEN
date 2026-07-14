/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa';

interface MenuCategory {
  name: string;
  image: string;
  tag: string;
  subcategories: string[];
}

const CategoryBar = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories/menu');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories for bar:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleMouseEnter = (catName: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredCat(catName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCat(null);
    }, 150);
  };

  if (categories.length === 0) return null;

  return (
    <div className="bg-white border-b border-gray-100 sticky top-[81px] z-30 shadow-sm block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-0.5 py-1 -mx-1 relative">
          {categories.map((cat) => {
            const hasSubs = cat.subcategories.length > 0;
            const isHovered = hoveredCat === cat.name;

            return (
              <div
                key={cat.name}
                className="relative shrink-0"
                onMouseEnter={() => handleMouseEnter(cat.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className={`flex items-center gap-1 text-xs sm:text-sm font-medium px-3 py-2.5 transition-all whitespace-nowrap ${
                    isHovered
                      ? 'text-brand-secondary bg-brand-hero/50'
                      : 'text-text-dark/70 hover:text-brand-secondary hover:bg-brand-hero/30'
                  }`}
                >
                  {cat.name}
                  {hasSubs && (
                    <FaChevronDown className={`w-2 h-2 transition-transform duration-200 ${isHovered ? 'rotate-180' : ''}`} />
                  )}
                </Link>

                {/* Subcategory dropdown */}
                {hasSubs && isHovered && (
                  <div
                    className="absolute top-full left-0 bg-white rounded-b-xl shadow-lg border border-gray-100 border-t-0 min-w-[200px] py-1.5 z-50 animate-slide-down"
                    onMouseEnter={() => handleMouseEnter(cat.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={`/shop?category=${encodeURIComponent(cat.name)}`}
                      className="block px-4 py-2 text-xs font-bold text-brand-topbar hover:bg-brand-hero/50 transition-colors"
                    >
                      All {cat.name} →
                    </Link>
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        href={`/shop?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub)}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-dark/70 hover:text-brand-secondary hover:bg-brand-hero/40 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary/30 shrink-0" />
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <Link
            href="/shop"
            className="shrink-0 text-xs sm:text-sm font-bold text-brand-topbar px-3 py-2.5 hover:bg-brand-hero/50 transition-all whitespace-nowrap"
          >
            View All
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
