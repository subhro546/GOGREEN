"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

export default function ShopFilterHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentStock = searchParams.get("stock") === "true";

  const [search, setSearch] = useState(currentSearch);

  // Sync input value if URL changes
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const updateFilters = (key: string, value: string | boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "" || value === false) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("search", search);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-brand/5 shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2 relative max-w-md">
        <input
          type="text"
          placeholder="Search plants, flowers, seeds..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
        />
        <FaSearch className="absolute left-3.5 top-3.5 text-text-dark/40 w-4 h-4" />
        <button
          type="submit"
          className="px-4 py-2 bg-brand-secondary hover:bg-brand-topbar text-white text-xs font-bold rounded-xl transition-all shadow-sm"
        >
          Search
        </button>
      </form>

      {/* Filters Options */}
      <div className="flex flex-wrap items-center gap-4">
        {/* In stock only filter */}
        <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-text-dark/70 font-semibold">
          <input
            type="checkbox"
            checked={currentStock}
            onChange={(e) => updateFilters("stock", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-brand-secondary focus:ring-brand-secondary"
          />
          In Stock Only
        </label>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text-dark/60 uppercase tracking-wider">Sort By</span>
          <select
            value={currentSort}
            onChange={(e) => updateFilters("sort", e.target.value)}
            className="px-3 py-2 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
