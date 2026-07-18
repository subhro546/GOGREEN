/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../src/context/CartContext';

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
  isSlider?: boolean;
}

const ProductCard = ({ 
  id, name, price, category, description, isNew, images, sku, weight, potIncluded, mrp, shippingCharge, isSlider = false
}: ProductCardProps) => {
  const { addItem } = useCart();

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
    addItem({ id, name, price, category, quantity: 1, image: imageUrl, shippingCharge });
  };

  return (
    <Link href={`/product/${id}`} className="block group h-full">

      {/* ── MOBILE ROW (When not in slider) ── */}
      {!isSlider && (
        <div className="flex sm:hidden bg-white rounded-2xl overflow-hidden border border-brand/5 shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* Image */}
          <div className="relative w-32 shrink-0 bg-brand-hero overflow-hidden">
            {isNew && (
              <span className="absolute top-2 left-2 bg-brand-topbar text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                NEW
              </span>
            )}
            {parsedImages.length > 0 ? (
              parsedImages.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={name}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                    idx === currentIdx ? "opacity-100" : "opacity-0"
                  } group-hover:scale-105`}
                />
              ))
            ) : (
              <img
                src="/placeholder.png"
                alt={name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
        <div className="flex sm:hidden flex-col bg-white rounded-2xl overflow-hidden border border-brand/5 h-full">
          {/* Image */}
          <div className="relative aspect-[4/5] bg-brand-hero overflow-hidden flex items-center justify-center">
            {isNew && (
              <div className="absolute top-2 left-2 bg-brand-topbar text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10">
                NEW
              </div>
            )}
            {parsedImages.length > 0 ? (
              parsedImages.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={name}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                    idx === currentIdx ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))
            ) : (
              <img
                src="/placeholder.png"
                alt={name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>

          {/* Info */}
          <div className="p-3 flex-1 flex flex-col justify-between">
            <div>
              <p className="text-[10px] text-text-dark/50 font-medium mb-0.5 uppercase tracking-wider">{category}</p>
              <span className="text-xs font-serif font-bold text-text-dark line-clamp-1">
                {name}
              </span>
            </div>

            <div className="mt-2 space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-brand-secondary">₹{price.toFixed(2)}</span>
                {mrp && mrp > price && (
                  <span className="text-[10px] text-red-500 line-through font-semibold">₹{mrp.toFixed(2)}</span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-yellow-400 text-yellow-900 py-1.5 rounded-xl text-[11px] font-bold hover:bg-yellow-300 transition-colors shadow-sm flex items-center justify-center gap-1"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DESKTOP: Vertical card ── */}
      <div className="hidden sm:flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-brand/5 h-full">
        <div className="relative aspect-[4/5] bg-brand-hero overflow-hidden flex items-center justify-center">
          {isNew && (
            <div className="absolute top-4 left-4 bg-brand-topbar text-white text-xs font-bold px-3 py-1 rounded-full z-10">
              NEW
            </div>
          )}
          <button
            onClick={handleAddToCart}
            className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur-md rounded-full text-foreground/50 hover:text-red-500 hover:bg-white transition-all z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>

          {parsedImages.length > 0 ? (
            parsedImages.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  idx === currentIdx ? "opacity-100" : "opacity-0"
                } group-hover:scale-110`}
              />
            ))
          ) : (
            <img
              src="/placeholder.png"
              alt={name}
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
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
                <span className="text-[10px] font-mono bg-brand-hero text-text-dark/60 px-2 py-0.5 rounded-full border border-brand/5">
                  SKU: {sku}
                </span>
              )}
              {weight && (
                <span className="text-[10px] bg-brand-hero text-brand-secondary px-2 py-0.5 rounded-full font-semibold border border-brand/5">
                  ⚖️ {weight} kg
                </span>
              )}
              {potIncluded && potIncluded !== "None" && (
                <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-semibold border border-green-100/50">
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