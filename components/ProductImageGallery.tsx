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
      <div className="relative w-full h-[55vh] md:h-[70vh] bg-brand-hero overflow-hidden flex items-center justify-center">
        <img
          src={activeUrl}
          alt={`${productName} view ${activeIdx + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />
      </div>

      {/* Thumbnails row */}
      {imagesList.length > 1 && (
        <div className="flex gap-3 overflow-x-auto py-2 px-4 md:px-8 scrollbar-thin">
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
