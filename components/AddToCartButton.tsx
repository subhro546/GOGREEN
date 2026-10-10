"use client";

import { useState } from "react";
import { useCart } from "../src/context/CartContext";
import { useWishlist } from "../src/context/WishlistContext";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    mrp?: number | null;
    category: string;
    stock: number;
    images?: string;
    description?: string | null;
    shippingCharge?: number | null;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  let imageUrl = '/placeholder.png';
  if (product.images) {
    try {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        imageUrl = parsed[0];
      }
    } catch {
      // ignore
    }
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      quantity,
      image: imageUrl,
      shippingCharge: product.shippingCharge,
    });
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      category: product.category,
      image: imageUrl,
      description: product.description,
      stock: product.stock,
      shippingCharge: product.shippingCharge,
    });
  };

  return (
    <div className="flex items-center gap-3 sm:gap-4 mt-auto">
      <div className="flex items-center border border-text-dark/20 dark:border-white/10 rounded-xl overflow-hidden bg-brand-hero dark:bg-[#0b130e]">
        <button
          onClick={handleDecrease}
          className="px-3.5 sm:px-4 py-3 sm:py-3.5 bg-brand-hero dark:bg-[#121c16] hover:bg-brand-light dark:hover:bg-white/5 transition-colors disabled:opacity-50 text-text-dark dark:text-white"
          disabled={quantity <= 1}
        >
          -
        </button>
        <span className="px-3 sm:px-4 py-3 sm:py-3.5 font-medium min-w-[2.5rem] sm:min-w-[3rem] text-center text-text-dark dark:text-white">{quantity}</span>
        <button
          onClick={handleIncrease}
          className="px-3.5 sm:px-4 py-3 sm:py-3.5 bg-brand-hero dark:bg-[#121c16] hover:bg-brand-light dark:hover:bg-white/5 transition-colors disabled:opacity-50 text-text-dark dark:text-white"
          disabled={quantity >= product.stock}
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className="flex-1 bg-yellow-400 text-yellow-900 py-3.5 sm:py-4 rounded-xl font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm sm:text-base flex items-center justify-center gap-2"
      >
        <span>🛒</span>
        <span>{product.stock > 0 ? "Add to Cart" : "Out of Stock"}</span>
      </button>

      <button
        onClick={handleToggleWishlist}
        type="button"
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-200 flex items-center justify-center shrink-0 ${
          isWishlisted
            ? "bg-red-50 dark:bg-red-950/70 border-red-200 dark:border-red-800 text-red-500 shadow-md scale-105"
            : "border-text-dark/15 dark:border-white/10 hover:border-red-300 dark:hover:border-red-800 text-text-dark/60 dark:text-white/60 hover:text-red-500 dark:hover:text-red-400 bg-white dark:bg-[#121c16]"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          fill={isWishlisted ? "currentColor" : "none"}
          className="w-5 h-5 sm:w-6 sm:h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>
    </div>
  );
}
