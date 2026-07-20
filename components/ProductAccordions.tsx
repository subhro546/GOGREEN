"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function ProductAccordions() {
  const [openSection, setOpenSection] = useState<string | null>("care");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="mt-10 border-t border-brand/10 pt-6 space-y-4">
      {/* Plant Care Tips */}
      <div className="border-b border-brand/10 pb-4">
        <button
          onClick={() => toggleSection("care")}
          className="flex justify-between items-center w-full text-left py-2 focus:outline-none"
        >
          <h3 className="font-semibold text-lg text-text-dark">Plant Care Tips</h3>
          <span className="text-text-dark/50">
            {openSection === "care" ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </span>
        </button>
        {openSection === "care" && (
          <div className="mt-3 text-text-dark/70 text-sm leading-relaxed pr-4">
            <p>
              Water moderately and allow the soil to dry slightly between waterings. Place in bright, indirect sunlight for best results. Use well-draining potting mix and fertilize during growing season.
            </p>
          </div>
        )}
      </div>

      {/* Delivery & Returns */}
      <div className="border-b border-brand/10 pb-4">
        <button
          onClick={() => toggleSection("delivery")}
          className="flex justify-between items-center w-full text-left py-2 focus:outline-none"
        >
          <h3 className="font-semibold text-lg text-text-dark">Delivery & Returns</h3>
          <span className="text-text-dark/50">
            {openSection === "delivery" ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </span>
        </button>
        {openSection === "delivery" && (
          <div className="mt-3 text-text-dark/70 text-sm leading-relaxed pr-4">
            <p>
              Free delivery on orders above ₹4999. Next-day delivery available in select cities. 14-day replacement guarantee on all plants. See our shipping policy for full details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
