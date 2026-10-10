"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  FaShareAlt, 
  FaWhatsapp, 
  FaFacebookF, 
  FaTwitter, 
  FaEnvelope, 
  FaLink, 
  FaCheck, 
  FaTimes 
} from "react-icons/fa";

interface ProductShareButtonProps {
  productName: string;
  productId: string;
  productPrice: number;
  productCategory?: string;
  productImage?: string;
}

export default function ProductShareButton({
  productName,
  productId,
  productPrice,
  productCategory,
  productImage,
}: ProductShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, [productId]);

  const shareText = `Check out ${productName} (₹${productPrice.toFixed(2)}) on GoGreen Nursery!`;

  const handleShareClick = async () => {
    // If Web Share API is available (Mobile browsers, Safari, etc.), use it first
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `${productName} | GoGreen`,
          text: shareText,
          url: shareUrl || window.location.href,
        });
        return;
      } catch (err: unknown) {
        // User cancelled or aborted sharing; if it was an AbortError, don't fallback
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        // Fall back to opening our in-app modal
      }
    }

    setIsOpen(true);
  };

  const copyToClipboard = async () => {
    try {
      const urlToCopy = shareUrl || window.location.href;
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is restricted
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl || window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl || "");
  const encodedText = encodeURIComponent(`${shareText} ${shareUrl || ""}`);

  const shareChannels = [
    {
      name: "WhatsApp",
      icon: <FaWhatsapp size={18} />,
      bg: "bg-[#25D366] hover:bg-[#20ba59] text-white",
      href: `https://api.whatsapp.com/send?text=${encodedText}`,
    },
    {
      name: "Facebook",
      icon: <FaFacebookF size={16} />,
      bg: "bg-[#1877F2] hover:bg-[#166fe5] text-white",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "X (Twitter)",
      icon: <FaTwitter size={16} />,
      bg: "bg-black hover:bg-neutral-800 text-white",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodedUrl}`,
    },
    {
      name: "Email",
      icon: <FaEnvelope size={16} />,
      bg: "bg-gray-700 hover:bg-gray-800 text-white",
      href: `mailto:?subject=${encodeURIComponent(`GoGreen: ${productName}`)}&body=${encodedText}`,
    },
  ];

  return (
    <>
      {/* ── SHARE BUTTON ── */}
      <button
        type="button"
        onClick={handleShareClick}
        aria-label="Share this product"
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-gray-200 hover:border-brand-secondary bg-white text-gray-700 hover:text-brand-secondary text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs hover:shadow-sm hover:scale-[1.02] active:scale-95"
      >
        <FaShareAlt size={13} className="text-brand-secondary" />
        <span>Share</span>
      </button>

      {/* ── SHARE MODAL / DIALOG ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close share dialog"
            >
              <FaTimes size={16} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <FaShareAlt size={14} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900">Share This Plant</h3>
                <p className="text-xs text-gray-500">Inspire your friends & family to go green</p>
              </div>
            </div>

            {/* Product Card Preview */}
            <div className="flex items-center gap-3 p-3 bg-brand-hero/40 rounded-2xl border border-brand/5 mb-5">
              {productImage && (
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0 border border-brand/10">
                  <Image
                    src={productImage}
                    alt={productName}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                {productCategory && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                    {productCategory}
                  </span>
                )}
                <h4 className="text-sm font-bold text-gray-900 truncate">{productName}</h4>
                <p className="text-xs font-semibold text-brand-secondary">₹{productPrice.toFixed(2)}</p>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-4 gap-2.5 mb-5">
              {shareChannels.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 text-center ${channel.bg}`}
                >
                  <span className="mb-1">{channel.icon}</span>
                  <span className="text-[11px] font-medium leading-tight">{channel.name}</span>
                </a>
              ))}
            </div>

            {/* Copy Link Input Bar */}
            <div className="relative">
              <label htmlFor="share-link-input" className="block text-xs font-medium text-gray-600 mb-1.5">
                Or copy product link
              </label>
              <div className="flex items-center gap-2 p-1.5 pl-3 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-brand-secondary focus-within:bg-white transition-all">
                <FaLink size={13} className="text-gray-400 shrink-0" />
                <input
                  id="share-link-input"
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full text-xs text-gray-700 bg-transparent outline-none truncate font-mono"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    copied
                      ? "bg-emerald-600 text-white"
                      : "bg-brand-secondary hover:bg-emerald-800 text-white shadow-sm"
                  }`}
                >
                  {copied ? (
                    <>
                      <FaCheck size={11} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <span>Copy</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
