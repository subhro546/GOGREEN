"use client";

import { useState } from "react";
import { useCart } from "../src/context/CartContext";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
    images?: string;
    shippingCharge?: number | null;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

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

  return (
    <div className="flex items-center gap-4 mt-auto">
      <div className="flex items-center border border-text-dark/20 rounded-lg overflow-hidden">
        <button
          onClick={handleDecrease}
          className="px-4 py-3 bg-brand-hero hover:bg-brand-light transition-colors disabled:opacity-50 text-text-dark"
          disabled={quantity <= 1}
        >
          -
        </button>
        <span className="px-4 py-3 font-medium min-w-[3rem] text-center text-text-dark">{quantity}</span>
        <button
          onClick={handleIncrease}
          className="px-4 py-3 bg-brand-hero hover:bg-brand-light transition-colors disabled:opacity-50 text-text-dark"
          disabled={quantity >= product.stock}
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className="flex-1 bg-yellow-400 text-yellow-900 py-4 rounded-xl font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
}
