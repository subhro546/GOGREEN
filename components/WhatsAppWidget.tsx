"use client";

import { FaWhatsapp } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function WhatsAppWidget() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip after 3 seconds, then hide it after 8 seconds
    const showTimer = setTimeout(() => setShowTooltip(true), 3000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 8000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Tooltip Popup */}
      <div 
        className={`bg-white text-text-dark font-medium px-4 py-2.5 rounded-2xl shadow-xl border border-brand/5 mb-3 text-xs flex items-center gap-2 transition-all duration-500 transform pointer-events-auto ${
          showTooltip 
            ? "opacity-100 translate-y-0 scale-100" 
            : "opacity-0 translate-y-2 scale-95 pointer-events-none"
        }`}
      >
        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping shrink-0" />
        <div>
          <p className="font-bold text-brand-secondary">Need Help?</p>
          <p className="text-text-dark/70 text-[10px]">Chat with our plant experts!</p>
        </div>
        <button 
          onClick={() => setShowTooltip(false)}
          className="text-text-dark/40 hover:text-text-dark ml-2 font-bold text-sm"
        >
          &times;
        </button>
      </div>

      {/* Floating Button */}
      <a
        href="https://wa.me/917980028176"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="pointer-events-auto w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-green-500/20 hover:scale-110 active:scale-95 transition-all duration-300 relative group animate-bounce-subtle"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulsing ring background */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping group-hover:animate-none -z-10" />
        
        <FaWhatsapp size={32} />
      </a>

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
