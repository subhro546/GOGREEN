"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % imagesList.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const imagesList = images.length > 0 ? images : ["/placeholder.png"];
  const activeUrl = imagesList[activeIdx] || "/placeholder.png";

  return (
    <div className="space-y-4 w-full">
      {/* Main viewport */}
      <div 
        className="relative w-full h-[55vh] md:h-[70vh] bg-brand-hero overflow-hidden flex items-center justify-center cursor-pointer group"
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={activeUrl}
          alt={`${productName} view ${activeIdx + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
            Click to enlarge
          </span>
        </div>
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
      {/* Full-screen Modal */}
      {isModalOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <button 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white p-2 rounded-full bg-black/50 hover:bg-black/80 transition-all z-[110]"
            onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
            aria-label="Close fullscreen"
          >
            <FaTimes size={24} />
          </button>
          
          <img
            src={activeUrl}
            alt={`${productName} fullscreen`}
            className="max-w-[95vw] max-h-[90vh] object-contain select-none bg-white rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {imagesList.length > 1 && (
            <>
              <button 
                className="absolute left-4 sm:left-10 text-white/70 hover:text-white p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 transition-all z-[110]"
                onClick={handlePrev}
                aria-label="Previous image"
              >
                <FaChevronLeft size={24} />
              </button>
              <button 
                className="absolute right-4 sm:right-10 text-white/70 hover:text-white p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 transition-all z-[110]"
                onClick={handleNext}
                aria-label="Next image"
              >
                <FaChevronRight size={24} />
              </button>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
