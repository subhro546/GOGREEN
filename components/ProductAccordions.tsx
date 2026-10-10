"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaLeaf, FaExclamationTriangle, FaShippingFast } from "react-icons/fa";

export default function ProductAccordions() {
  const [openSection, setOpenSection] = useState<string | null>("care");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="mt-8 border-t border-brand/10 pt-6 space-y-3">
      {/* ── DEDICATED PLANT CARE ACCORDION TAB ── */}
      <div className="border border-brand/10 rounded-2xl overflow-hidden bg-white">
        <button
          onClick={() => toggleSection("care")}
          className="flex justify-between items-center w-full text-left p-4 focus:outline-none hover:bg-emerald-50/50 transition-colors"
        >
          <div className="flex items-center gap-2.5 font-bold text-gray-900 text-sm sm:text-base">
            <FaLeaf className="text-emerald-600" size={15} />
            <span>Plant Care Guide</span>
          </div>
          <span className="text-gray-400">
            {openSection === "care" ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </span>
        </button>
        {openSection === "care" && (
          <div className="px-4 pb-4 text-gray-600 text-xs sm:text-sm leading-relaxed border-t border-gray-100 pt-3 space-y-2">
            <p>
              <strong>Light:</strong> Place in bright, indirect sunlight or filtered light. Avoid scorching midday sun.
            </p>
            <p>
              <strong>Watering:</strong> Water when top 1-2 inches of soil feel dry. Ensure excess water drains freely.
            </p>
            <p>
              <strong>Soil & Fertilizer:</strong> Use well-draining soil mix. Feed with organic liquid fertilizer once monthly during growing season.
            </p>
          </div>
        )}
      </div>

      {/* ── DEDICATED DISCLAIMER ACCORDION TAB ── */}
      <div className="border border-brand/10 rounded-2xl overflow-hidden bg-white">
        <button
          onClick={() => toggleSection("disclaimer")}
          className="flex justify-between items-center w-full text-left p-4 focus:outline-none hover:bg-amber-50/50 transition-colors"
        >
          <div className="flex items-center gap-2.5 font-bold text-gray-900 text-sm sm:text-base">
            <FaExclamationTriangle className="text-amber-600" size={15} />
            <span>Product Disclaimers</span>
          </div>
          <span className="text-gray-400">
            {openSection === "disclaimer" ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </span>
        </button>
        {openSection === "disclaimer" && (
          <div className="px-4 pb-4 text-gray-600 text-xs sm:text-sm leading-relaxed border-t border-gray-100 pt-3 space-y-2">
            <p>
              <strong>Living Plant Variations:</strong> As plants are natural living organisms, height, branch shape, and leaf count may vary slightly from reference photos.
            </p>
            <p>
              <strong>Transit Stress:</strong> Minor transit drooping is normal. Place in indirect light and water lightly to allow acclimatization over 3-5 days.
            </p>
            <p>
              <strong>Replacements:</strong> Damaged-in-transit plants are eligible for free replacement upon sharing unboxing photos within 48 hours.
            </p>
          </div>
        )}
      </div>

      {/* ── DELIVERY & RETURNS ACCORDION TAB ── */}
      <div className="border border-brand/10 rounded-2xl overflow-hidden bg-white">
        <button
          onClick={() => toggleSection("delivery")}
          className="flex justify-between items-center w-full text-left p-4 focus:outline-none hover:bg-teal-50/50 transition-colors"
        >
          <div className="flex items-center gap-2.5 font-bold text-gray-900 text-sm sm:text-base">
            <FaShippingFast className="text-teal-600" size={15} />
            <span>Delivery & Returns</span>
          </div>
          <span className="text-gray-400">
            {openSection === "delivery" ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </span>
        </button>
        {openSection === "delivery" && (
          <div className="px-4 pb-4 text-gray-600 text-xs sm:text-sm leading-relaxed border-t border-gray-100 pt-3">
            <p>
              Free delivery on orders above ₹4,999. Packaged safely in ventilated botanical protective cartons. Next-day dispatch in select metropolitan areas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
