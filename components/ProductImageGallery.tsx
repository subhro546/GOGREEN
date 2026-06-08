"use client";

import { useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const imagesList = images.length > 0 ? images : ["/placeholder.png"];
  const activeUrl = imagesList[activeIdx] || "/placeholder.png";

  return (
    <div className="space-y-4 w-full">
      {/* Main viewport */}
      <div className="relative aspect-square bg-brand-hero rounded-3xl overflow-hidden border border-brand/5 flex items-center justify-center shadow-md">
        <img
          src={activeUrl}
          alt={`${productName} view ${activeIdx + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />
      </div>

      {/* Thumbnails row */}
      {imagesList.length > 1 && (
        <div className="flex gap-3 overflow-x-auto py-1 scrollbar-thin">
          {imagesList.map((url, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 bg-brand-hero shrink-0 transition-all shadow-sm ${
                  isActive 
                    ? "border-brand-secondary scale-102 ring-2 ring-brand-secondary/20" 
                    : "border-brand/5 opacity-70 hover:opacity-100 hover:scale-102"
                }`}
              >
                <img
                  src={url}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
