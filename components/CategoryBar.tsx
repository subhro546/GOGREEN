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
    <div className="bg-white dark:bg-[#0b130e] border-b border-gray-100 dark:border-gray-800 sticky top-[80px] z-30 shadow-xs block w-full transition-colors duration-300">
      <div className="w-full px-3 sm:px-8 md:px-12 lg:px-16">
        <div 
          className="flex flex-nowrap sm:flex-wrap items-center overflow-x-auto sm:overflow-visible sm:justify-center lg:justify-evenly gap-2 sm:gap-1.5 md:gap-3 py-2 sm:py-1 relative scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
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
                  className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-1.5 sm:py-2 rounded-full sm:rounded-xl transition-all whitespace-nowrap bg-gray-50 dark:bg-white/[0.04] sm:bg-transparent sm:dark:bg-transparent border border-gray-200/60 dark:border-white/10 sm:border-transparent ${
                    isHovered
                      ? 'text-brand-secondary dark:text-emerald-400 bg-brand-hero/50 dark:bg-white/10'
                      : 'text-text-dark/70 dark:text-gray-200 hover:text-brand-secondary dark:hover:text-emerald-400 hover:bg-brand-hero/30 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{cat.name}</span>
                  {hasSubs && (
                    <FaChevronDown className={`w-2 h-2 transition-transform duration-200 ${isHovered ? 'rotate-180' : ''}`} />
                  )}
                </Link>

                {/* Subcategory dropdown (Desktop hover) */}
                {hasSubs && isHovered && (
                  <div
                    className="hidden sm:block absolute top-full left-0 bg-white dark:bg-[#121c16] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 min-w-[200px] py-1.5 z-50 animate-slide-down"
                    onMouseEnter={() => handleMouseEnter(cat.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={`/shop?category=${encodeURIComponent(cat.name)}`}
                      className="block px-4 py-2 text-xs font-bold text-brand-topbar dark:text-emerald-400 hover:bg-brand-hero/50 dark:hover:bg-white/5 transition-colors"
                    >
                      All {cat.name} →
                    </Link>
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        href={`/shop?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub)}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-dark/70 dark:text-gray-200 hover:text-brand-secondary dark:hover:text-emerald-400 hover:bg-brand-hero/40 dark:hover:bg-white/5 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary/40 shrink-0" />
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
            className="shrink-0 text-xs sm:text-sm font-bold text-brand-topbar dark:text-emerald-400 bg-brand-hero/60 dark:bg-emerald-950/40 px-3.5 py-1.5 sm:py-2 rounded-full sm:rounded-xl hover:bg-brand-hero dark:hover:bg-emerald-900/60 transition-all whitespace-nowrap border border-brand/10 dark:border-emerald-800/40"
          >
            View All →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
