"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpand } from "react-icons/fa";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const imagesList = images.length > 0 ? images : ["/placeholder.png"];
  const total = imagesList.length;

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  // Touch / swipe handlers for manual gesture control (No autoplay)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const isSwipeLeft = distance > 45;
    const isSwipeRight = distance < -45;

    if (isSwipeLeft) {
      handleNext();
    } else if (isSwipeRight) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation when modal is open or when gallery has focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      } else if (e.key === "ArrowRight") {
        setActiveIdx((prev) => (prev + 1) % total);
      } else if (e.key === "ArrowLeft") {
        setActiveIdx((prev) => (prev === 0 ? total - 1 : prev - 1));
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, total]);

  return (
    <div className="space-y-4 w-full select-none">
      {/* ── MAIN SLIDING CAROUSEL STAGE ── */}
      <div
        className="relative w-full aspect-square md:aspect-[4/5] lg:aspect-square rounded-2xl md:rounded-[2rem] bg-brand-hero overflow-hidden shadow-sm group border border-brand/5"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Sliding Track - moves smoothly with CSS transition */}
        <div
          className="flex w-full h-full transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translateX(-${activeIdx * 100}%)` }}
        >
          {imagesList.map((url, idx) => (
            <div
              key={idx}
              className="w-full h-full shrink-0 relative cursor-pointer flex items-center justify-center bg-[#f2f7f2]"
              onClick={() => setIsModalOpen(true)}
            >
              <Image
                src={url}
                alt={`${productName} - View ${idx + 1} of ${total}`}
                fill
                priority={idx === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* ── MANUAL NAVIGATION CONTROLS (Only visible when multiple images exist) ── */}
        {total > 1 && (
          <>
            {/* Left Chevron Button */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-gray-800 shadow-md backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 opacity-80 group-hover:opacity-100 border border-white/70"
            >
              <FaChevronLeft size={14} />
            </button>

            {/* Right Chevron Button */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-gray-800 shadow-md backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 opacity-80 group-hover:opacity-100 border border-white/70"
            >
              <FaChevronRight size={14} />
            </button>

            {/* Slide Index Counter Badge */}
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full z-20 pointer-events-none shadow-sm">
              {activeIdx + 1} / {total}
            </div>

            {/* Carousel Dot Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-y-0 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
              {imagesList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIdx(idx);
                  }}
                  aria-label={`Jump to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeIdx ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Enlarge Hint / Button */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          aria-label="Enlarge image"
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-gray-700 shadow-md backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 z-20 border border-white/70 opacity-0 group-hover:opacity-100"
        >
          <FaExpand size={11} />
        </button>
      </div>

      {/* ── THUMBNAILS CAROUSEL STRIP ── */}
      {total > 1 && (
        <div className="flex gap-2.5 overflow-x-auto py-1 px-1 scrollbar-thin">
          {imagesList.map((url, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIdx(idx)}
                aria-label={`Select photo ${idx + 1}`}
                className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 bg-brand-hero shrink-0 transition-all duration-200 shadow-sm ${
                  isActive
                    ? "border-brand-secondary scale-102 ring-2 ring-brand-secondary/30"
                    : "border-brand/10 opacity-70 hover:opacity-100 hover:scale-102"
                }`}
              >
                <Image
                  src={url}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* ── FULL-SCREEN MODAL LIGHTBOX ── */}
      {isModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Close button */}
            <button
              type="button"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-[110]"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }}
              aria-label="Close fullscreen"
            >
              <FaTimes size={20} />
            </button>

            {/* Counter */}
            {total > 1 && (
              <div className="absolute top-5 left-5 text-white/80 text-sm font-medium bg-white/10 px-3 py-1 rounded-full z-[110] backdrop-blur-sm">
                {activeIdx + 1} of {total}
              </div>
            )}

            {/* Modal Image container */}
            <div
              className="relative w-full h-full max-w-[92vw] max-h-[85vh] flex items-center justify-center select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={imagesList[activeIdx]}
                alt={`${productName} fullscreen view`}
                fill
                className="object-contain"
                sizes="95vw"
              />
            </div>

            {/* Modal Navigation Arrows */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-4 sm:left-8 text-white/80 hover:text-white p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/25 transition-all z-[110] backdrop-blur-sm hover:scale-110 active:scale-95"
                  onClick={handlePrev}
                  aria-label="Previous image"
                >
                  <FaChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  className="absolute right-4 sm:right-8 text-white/80 hover:text-white p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/25 transition-all z-[110] backdrop-blur-sm hover:scale-110 active:scale-95"
                  onClick={handleNext}
                  aria-label="Next image"
                >
                  <FaChevronRight size={22} />
                </button>
              </>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
