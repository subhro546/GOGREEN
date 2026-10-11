"use client";

import Image from 'next/image';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../src/context/CartContext';
import { useWishlist } from '../src/context/WishlistContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  isNew?: boolean;
  images?: string;
  sku?: string | null;
  weight?: number | null;
  potIncluded?: string;
  mrp?: number | null;
  shippingCharge?: number | null;
  sellWithCod?: boolean | null;
  isSlider?: boolean;
}

const ProductCard = ({ 
  id, name, price, category, description, isNew, images, sku, weight, potIncluded, mrp, shippingCharge, sellWithCod, isSlider = false
}: ProductCardProps) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(id);

  const parsedImages: string[] = (() => {
    try {
      const parsed = JSON.parse(images || "[]");
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [];
    } catch {
      return [];
    }
  })();

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (parsedImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % parsedImages.length);
    }, 3000); // Cycle every 3 seconds
    return () => clearInterval(interval);
  }, [parsedImages.length]);

  const imageUrl = parsedImages[0] || '/placeholder.png';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price, category, quantity: 1, image: imageUrl, shippingCharge, sellWithCod: sellWithCod ?? true });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id,
      name,
      price,
      mrp,
      category,
      image: imageUrl,
      description,
      shippingCharge,
    });
  };

  return (
    <Link href={`/product/${id}`} className="block group h-full">

      {/* ── MOBILE ROW (When not in slider) ── */}
      {!isSlider && (
        <div className="flex sm:hidden bg-white dark:bg-[#121c16] rounded-2xl overflow-hidden border border-brand/5 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* Image */}
          <div className="relative w-32 shrink-0 bg-brand-hero dark:bg-[#0b130e] overflow-hidden">
            {isNew && (
              <span className="absolute top-2 left-2 bg-brand-topbar text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                NEW
              </span>
            )}
            <button
              onClick={handleWishlistToggle}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`absolute top-2 right-2 p-1.5 backdrop-blur-md rounded-full transition-all z-10 ${
                isWishlisted
                  ? 'bg-red-50 dark:bg-red-950/80 text-red-500 border border-red-200 dark:border-red-800 shadow-sm'
                  : 'bg-white/70 dark:bg-black/60 text-gray-500 dark:text-gray-300 hover:text-red-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill={isWishlisted ? "currentColor" : "none"} className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
            {parsedImages.length > 0 ? (
              parsedImages.map((url, idx) => (
                <Image
                  key={idx}
                  src={url}
                  alt={name}
                  fill
                  sizes="128px"
                  className={`object-cover transition-opacity duration-700 ${
                    idx === currentIdx ? "opacity-100" : "opacity-0"
                  } group-hover:scale-105`}
                />
              ))
            ) : (
              <Image
                src="/placeholder.png"
                alt={name}
                fill
                sizes="128px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
          </div>

          {/* Info + button */}
          <div className="flex flex-col flex-1 p-3 gap-1">
            <p className="text-[10px] text-text-dark/50 font-semibold uppercase tracking-widest">{category}</p>
            <p className="text-sm font-serif font-bold text-text-dark leading-snug line-clamp-1 group-hover:text-brand-secondary transition-colors">
              {name}
            </p>

            {/* Mobile Specs Badges */}
            {(sku || weight || (potIncluded && potIncluded !== "None")) && (
              <div className="flex flex-wrap gap-1 mt-0.5 mb-1">
                {sku && (
                  <span className="text-[9px] font-mono bg-brand-hero text-text-dark/60 px-1.5 py-0.5 rounded">
                    {sku}
                  </span>
                )}
                {weight && (
                  <span className="text-[9px] bg-brand-hero text-brand-secondary px-1.5 py-0.5 rounded font-semibold">
                    ⚖️ {weight} kg
                  </span>
                )}
                {potIncluded && potIncluded !== "None" && (
                  <span className="text-[9px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-semibold border border-green-100/50">
                    🪴 {potIncluded.split(" ")[0]}
                  </span>
                )}
              </div>
            )}

            {description && (
              <p className="text-[11px] text-text-dark/50 line-clamp-2 leading-snug">{description}</p>
            )}

            {/* Stars */}
            <div className="flex gap-0.5 mt-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-yellow-400">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
                </svg>
              ))}
            </div>

            <div className="flex items-baseline gap-2 mt-auto flex-wrap">
              <span className="text-base font-bold text-brand-secondary">₹{price.toFixed(2)}</span>
              {mrp && mrp > price && (
                <span className="text-xs text-red-500 line-through font-semibold">₹{mrp.toFixed(2)}</span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-2 w-full bg-yellow-400 text-yellow-900 text-xs font-bold py-2 rounded-xl hover:bg-yellow-300 active:scale-95 transition-all shadow-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}

      {/* ── MOBILE SLIDER CARD (When in slider) ── */}
      {isSlider && (
        <div className="flex sm:hidden flex-col bg-white dark:bg-[#121c16] rounded-xl overflow-hidden border border-brand/5 dark:border-white/5 h-full shadow-sm">
          {/* Image */}
          <div className="relative aspect-[4/5] bg-brand-hero dark:bg-[#0b130e] overflow-hidden flex items-center justify-center">
            {isNew && (
              <div className="absolute top-1.5 left-1.5 bg-brand-topbar text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full z-10">
                NEW
              </div>
            )}
            <button
              onClick={handleWishlistToggle}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`absolute top-1.5 right-1.5 p-1 backdrop-blur-md rounded-full transition-all z-10 ${
                isWishlisted
                  ? 'bg-red-50 dark:bg-red-950/80 text-red-500 border border-red-200 dark:border-red-800 shadow-sm'
                  : 'bg-white/70 dark:bg-black/60 text-gray-500 dark:text-gray-300 hover:text-red-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill={isWishlisted ? "currentColor" : "none"} className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
            {parsedImages.length > 0 ? (
              parsedImages.map((url, idx) => (
                <Image
                  key={idx}
                  src={url}
                  alt={name}
                  fill
                  sizes="160px"
                  className={`object-cover transition-opacity duration-700 ${
                    idx === currentIdx ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))
            ) : (
              <Image
                src="/placeholder.png"
                alt={name}
                fill
                sizes="160px"
                className="object-cover"
              />
            )}
          </div>

          {/* Info */}
          <div className="p-2 flex-1 flex flex-col justify-between">
            <div>
              <p className="text-[9px] text-text-dark/50 dark:text-gray-400 font-semibold mb-0.5 uppercase tracking-wider line-clamp-1">{category}</p>
              <span className="text-[11px] font-serif font-bold text-text-dark dark:text-white line-clamp-1 leading-tight">
                {name}
              </span>
            </div>

            <div className="mt-1.5 space-y-1.5">
              <div className="flex items-baseline gap-1 flex-wrap">
                <span className="text-xs font-bold text-brand-secondary dark:text-emerald-400">₹{price.toFixed(2)}</span>
                {mrp && mrp > price && (
                  <span className="text-[9px] text-red-500 line-through font-semibold">₹{mrp.toFixed(2)}</span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-yellow-400 text-yellow-950 py-1.5 rounded-lg text-[10px] font-bold hover:bg-yellow-300 transition-colors shadow-sm flex items-center justify-center gap-1 active:scale-95"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DESKTOP: Vertical card ── */}
      <div className="hidden sm:flex flex-col bg-white dark:bg-[#121c16] rounded-2xl overflow-hidden hover:shadow-xl dark:hover:shadow-black/70 transition-all duration-300 border border-brand/5 dark:border-white/5 h-full">
        <div className="relative aspect-[4/5] bg-brand-hero dark:bg-[#0b130e] overflow-hidden flex items-center justify-center">
          {isNew && (
            <div className="absolute top-4 left-4 bg-brand-topbar text-white text-xs font-bold px-3 py-1 rounded-full z-10">
              NEW
            </div>
          )}
          <button
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-4 right-4 p-2.5 backdrop-blur-md rounded-full transition-all z-10 transform duration-200 ${
              isWishlisted
                ? 'opacity-100 translate-y-0 bg-red-50 dark:bg-red-950/80 text-red-500 border border-red-200 dark:border-red-800 shadow-md scale-105'
                : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 bg-white/70 dark:bg-black/60 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:scale-110 shadow-sm'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              fill={isWishlisted ? "currentColor" : "none"}
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>

          {parsedImages.length > 0 ? (
            parsedImages.map((url, idx) => (
              <Image
                key={idx}
                src={url}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={`object-cover transition-opacity duration-700 ${
                  idx === currentIdx ? "opacity-100" : "opacity-0"
                } group-hover:scale-110`}
              />
            ))
          ) : (
            <Image
              src="/placeholder.png"
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full bg-yellow-400 text-yellow-900 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors shadow-lg"
            >
              Add to Cart
            </button>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <p className="text-sm text-text-dark/50 font-medium mb-1 uppercase tracking-wider">{category}</p>
          <span className="text-lg font-serif font-bold text-text-dark group-hover:text-brand-secondary transition-colors mb-1 line-clamp-2">
            {name}
          </span>

          {/* Desktop Specs Badges */}
          {(sku || weight || (potIncluded && potIncluded !== "None")) && (
            <div className="flex flex-wrap gap-1.5 mb-2 mt-1">
              {sku && (
                <span className="text-[10px] font-mono bg-brand-hero dark:bg-white/5 text-text-dark/60 dark:text-gray-300 px-2 py-0.5 rounded-full border border-brand/5 dark:border-white/5">
                  SKU: {sku}
                </span>
              )}
              {weight && (
                <span className="text-[10px] bg-brand-hero dark:bg-emerald-950/60 text-brand-secondary dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold border border-brand/5 dark:border-emerald-800/40">
                  ⚖️ {weight} kg
                </span>
              )}
              {potIncluded && potIncluded !== "None" && (
                <span className="text-[10px] bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-semibold border border-green-100/50 dark:border-green-800/40">
                  🪴 {potIncluded}
                </span>
              )}
            </div>
          )}
          {description && (
            <p className="text-xs text-text-dark/50 line-clamp-2 mb-2 leading-relaxed">{description}</p>
          )}
          <div className="mt-auto flex items-baseline justify-between w-full flex-wrap gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-brand-secondary">₹{price.toFixed(2)}</span>
              {mrp && mrp > price && (
                <span className="text-xs text-red-500 line-through font-semibold">₹{mrp.toFixed(2)}</span>
              )}
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>

    </Link>
  );
};

export default ProductCard;