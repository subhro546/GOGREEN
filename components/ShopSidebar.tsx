"use client";

import { useState } from "react";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

interface ShopSidebarProps {
  categoryTree: { name: string; subcategories: string[] }[];
  activeCategory: string | null;
  activeSubcategory: string | null;
}

export default function ShopSidebar({
  categoryTree,
  activeCategory,
  activeSubcategory,
}: ShopSidebarProps) {
  // Auto-expand the active category
  const [expandedCat, setExpandedCat] = useState<string | null>(activeCategory);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleExpand = (catName: string) => {
    setExpandedCat(expandedCat === catName ? null : catName);
  };

  return (
    <div className="w-full md:w-64 shrink-0">
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden w-full bg-white p-4 rounded-xl shadow-sm border border-brand/5 font-bold text-brand-secondary flex justify-between items-center mb-4"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <span>Categories & Filters</span>
        <FaChevronRight className={`w-3 h-3 transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`} />
      </button>

      {/* Sidebar Content */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block bg-white p-6 rounded-2xl shadow-sm border border-brand/5 sticky top-28`}>
        <h3 className="font-bold text-lg mb-4 text-brand-secondary">Categories</h3>
        <ul className="space-y-1">
          {/* All Plants */}
          <li>
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-sm px-3 py-2 rounded-lg transition-colors ${
                !activeCategory
                  ? "font-bold text-brand-topbar bg-brand-hero"
                  : "text-text-dark/70 hover:text-brand-topbar hover:bg-brand-hero/40"
              }`}
            >
              All Plants
            </Link>
          </li>

          {categoryTree.map((cat) => {
            const isActive = activeCategory === cat.name && !activeSubcategory;
            const isExpanded = expandedCat === cat.name;
            const hasSubcats = cat.subcategories.length > 0;

            return (
              <li key={cat.name}>
                <div className="flex items-center">
                  <button
                    onClick={() => toggleExpand(cat.name)}
                    className={`flex-1 flex justify-between items-center text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      isActive || activeCategory === cat.name
                        ? "font-bold text-brand-topbar bg-brand-hero"
                        : "text-text-dark/70 hover:text-brand-topbar hover:bg-brand-hero/40"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {hasSubcats && (
                      <FaChevronRight
                        className={`w-2.5 h-2.5 transition-transform duration-200 ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    )}
                  </button>
                </div>

                {/* Subcategories */}
                {hasSubcats && isExpanded && (
                  <ul className="pl-4 mt-0.5 space-y-0.5 animate-slide-down">
                    {/* View All Option */}
                    <li>
                      <Link
                        href={`/shop?category=${encodeURIComponent(cat.name)}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors ${
                          isActive
                            ? "font-bold text-brand-topbar bg-brand-hero"
                            : "text-text-dark/60 hover:text-brand-secondary hover:bg-brand-hero/40"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? "bg-brand-topbar" : "bg-brand-secondary/30"}`} />
                        View All {cat.name}
                      </Link>
                    </li>
                    {cat.subcategories.map((sub) => {
                      const isSubActive =
                        activeCategory === cat.name && activeSubcategory === sub;
                      return (
                        <li key={sub}>
                          <Link
                            href={`/shop?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub)}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors ${
                              isSubActive
                                ? "font-bold text-brand-topbar bg-brand-hero"
                                : "text-text-dark/60 hover:text-brand-secondary hover:bg-brand-hero/40"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                isSubActive
                                  ? "bg-brand-topbar"
                                  : "bg-brand-secondary/30"
                              }`}
                            />
                            {sub}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
