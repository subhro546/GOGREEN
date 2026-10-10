/* eslint-disable @next/next/no-img-element */
"use client";

import { useWishlist, WishlistItem } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaHeart, FaTrash, FaShoppingCart, FaArrowLeft, FaCheck } from "react-icons/fa";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist, totalItems } = useWishlist();
  const { addItem } = useCart();
  const [mounted, setMounted] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<{ [id: string]: boolean }>({});
  const [addedAll, setAddedAll] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (item: WishlistItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      quantity: 1,
      image: item.image || "/placeholder.png",
      shippingCharge: item.shippingCharge,
    });

    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        quantity: 1,
        image: item.image || "/placeholder.png",
        shippingCharge: item.shippingCharge,
      });
    });

    setAddedAll(true);
    setTimeout(() => {
      setAddedAll(false);
    }, 2500);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b130e] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafcf9] dark:bg-[#0b130e] flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-text-dark/60 dark:text-gray-400 mb-6 font-medium">
          <Link href="/" className="hover:text-brand-secondary transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-brand-secondary dark:text-emerald-400 font-semibold">Wishlist</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/80 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">
                My Wishlist
              </h1>
              <span className="bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/60 text-xs sm:text-sm font-bold px-3 py-0.5 rounded-full">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
            <p className="text-sm text-text-dark/60 dark:text-gray-400 mt-1">
              Your saved plants and nursery favorites ready for your garden.
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleAddAllToCart}
                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-yellow-950 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow active:scale-95"
              >
                {addedAll ? (
                  <>
                    <FaCheck className="text-green-700" />
                    <span>All Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <FaShoppingCart />
                    <span>Add All to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={clearWishlist}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/60 px-3.5 py-2.5 rounded-xl font-semibold transition-colors border border-red-200/60 dark:border-red-900/50"
              >
                <FaTrash className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {items.length === 0 ? (
          /* Empty State */
          <div className="my-16 sm:my-24 flex flex-col items-center justify-center text-center max-w-md mx-auto p-8 rounded-3xl bg-white/70 dark:bg-[#121c16]/70 border border-gray-200/60 dark:border-white/5 backdrop-blur-md shadow-sm">
            <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900/50 flex items-center justify-center text-red-500 dark:text-red-400 text-3xl mb-5 shadow-inner">
              <FaHeart />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-text-dark/60 dark:text-gray-400 mb-8 leading-relaxed">
              Explore our nursery collection and tap the heart icon on any plant or seed to save your favorites here.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-brand-secondary hover:bg-brand-topbar text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <FaArrowLeft className="w-3.5 h-3.5" />
              <span>Explore All Plants</span>
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => {
              const isAdded = !!addedItemIds[item.id];
              const discountPercent =
                item.mrp && item.mrp > item.price
                  ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
                  : 0;

              return (
                <div
                  key={item.id}
                  className="group relative bg-white dark:bg-[#121c16] rounded-2xl overflow-hidden border border-brand/5 dark:border-white/5 shadow-sm hover:shadow-xl dark:hover:shadow-black/60 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Image Box */}
                  <div className="relative aspect-[4/5] bg-brand-hero dark:bg-[#0b130e] overflow-hidden flex items-center justify-center">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Discount Badge */}
                    {discountPercent > 0 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                        {discountPercent}% OFF
                      </span>
                    )}

                    {/* Remove Heart Button (Active Red) */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      title="Remove from wishlist"
                      aria-label="Remove from wishlist"
                      className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-black/70 backdrop-blur-md rounded-full text-red-500 border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/80 transition-all shadow-sm hover:scale-110 active:scale-95"
                    >
                      <FaHeart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Info Box */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-text-dark/45 dark:text-gray-400 uppercase tracking-wider mb-1">
                        {item.category}
                      </p>
                      <Link
                        href={`/product/${item.id}`}
                        className="text-sm sm:text-base font-serif font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-brand-secondary dark:group-hover:text-emerald-400 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </div>

                    <div className="mt-4 space-y-3">
                      {/* Price Row */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-bold text-brand-secondary dark:text-emerald-400">
                          ₹{item.price.toFixed(2)}
                        </span>
                        {item.mrp && item.mrp > item.price && (
                          <span className="text-xs text-red-500 line-through font-semibold">
                            ₹{item.mrp.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart CTA */}
                      <button
                        onClick={() => handleAddToCart(item)}
                        className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                          isAdded
                            ? "bg-green-600 text-white shadow-green-600/30"
                            : "bg-yellow-400 hover:bg-yellow-300 text-yellow-950 hover:shadow-md active:scale-95"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <FaCheck className="w-3.5 h-3.5" />
                            <span>Added to Cart!</span>
                          </>
                        ) : (
                          <>
                            <FaShoppingCart className="w-3.5 h-3.5" />
                            <span>Move to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
