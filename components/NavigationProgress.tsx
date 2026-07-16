"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const NavigationProgress = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Detect route changes to stop the progress bar
  useEffect(() => {
    setIsNavigating(false);
    setProgress(100);

    const timeout = setTimeout(() => setProgress(0), 300);
    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  // Listen for click events on anchor/link elements to start the progress bar
  const handleClick = useCallback((e: MouseEvent) => {
    const clickedElement = e.target as HTMLElement;
    
    // Ignore clicks on buttons, inputs, selects, or textareas nested inside links
    if (
      clickedElement.closest("button") ||
      clickedElement.closest("input") ||
      clickedElement.closest("select") ||
      clickedElement.closest("textarea")
    ) {
      return;
    }

    const target = clickedElement.closest("a");
    if (!target) return;

    const href = target.getAttribute("href");
    if (!href) return;

    // Skip external links, hash links, and same-page links
    if (
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#") ||
      target.target === "_blank"
    ) {
      return;
    }

    // Skip if it's the current page
    const currentUrl = window.location.pathname + window.location.search;
    if (href === currentUrl) return;

    // Start progress
    setIsNavigating(true);
    setProgress(30);

    // Simulate progress
    const t1 = setTimeout(() => setProgress(60), 200);
    const t2 = setTimeout(() => setProgress(80), 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [handleClick]);

  if (progress === 0 && !isNavigating) return null;

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[200] h-[3px]">
        <div
          className="h-full bg-gradient-to-r from-brand-secondary via-green-400 to-brand-secondary rounded-r-full shadow-sm shadow-green-400/50"
          style={{
            width: `${progress}%`,
            transition: isNavigating
              ? "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
              : "width 0.2s ease-out, opacity 0.3s ease-out",
            opacity: progress === 100 ? 0 : 1,
          }}
        />
      </div>

      {/* Full-screen subtle overlay — only when actively navigating */}
      {isNavigating && (
        <div className="fixed inset-0 z-[99] bg-white/40 backdrop-blur-[1px] pointer-events-none transition-opacity duration-200" />
      )}
    </>
  );
};

export default NavigationProgress;
