"use client";

import { useState } from "react";
import { 
  FaLeaf, 
  FaExclamationTriangle, 
  FaListUl, 
  FaShippingFast, 
  FaSun, 
  FaTint, 
  FaThermometerHalf, 
  FaSeedling, 
  FaBoxOpen, 
  FaShieldAlt,
  FaCheckCircle
} from "react-icons/fa";

interface ProductTabsProps {
  product: {
    id: string;
    name: string;
    description: string;
    category: string;
    isIndoor: boolean;
    maintenance?: string | null;
    potIncluded?: string | null;
    returnable?: boolean | null;
    sellWithCod?: boolean | null;
    sku?: string | null;
    weight?: number | null;
    length?: number | null;
    width?: number | null;
    height?: number | null;
    plantHeight?: number | null;
    plantAge?: number | null;
    plantType?: string | null;
    shippingCharge?: number | null;
    mrp?: number | null;
    careDetails?: string | null;
    disclaimer?: string | null;
  };
}

type TabKey = "care" | "disclaimer" | "specs" | "delivery";

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("care");

  // ── CUSTOM / DEFAULT PLANT CARE ──
  const parsedCare = (() => {
    if (!product.careDetails) return {};
    try {
      return JSON.parse(product.careDetails);
    } catch {
      return { general: product.careDetails };
    }
  })();

  const care = {
    placement: parsedCare.placement || (product.isIndoor ? "Indoor / Indirect Light" : "Outdoor / Bright Light"),
    watering: parsedCare.watering || "When top soil dries",
    maintenance: parsedCare.maintenance || (product.maintenance || "Low Maintenance"),
    potting: parsedCare.potting || (product.potIncluded || "Pot Included"),
    light: parsedCare.light || (product.isIndoor
      ? "Place in a spot with medium to bright, indirect sunlight (e.g. near east or north-facing windows). Direct scorching midday sun can burn sensitive foliage."
      : "Enjoys ample natural light and partial to full morning sun. Ensure sheltered protection from extreme afternoon heat during peak summer months."),
    wateringSchedule: parsedCare.wateringSchedule || "Water thoroughly only when the top 1–2 inches of soil feel dry to touch. Always allow excess water to drain out from the drainage holes. Never let roots sit in standing water.",
    temperature: parsedCare.temperature || "Prefers a temperature range of 18°C – 30°C. Keep away from extreme drafts, cold AC vents, or hot radiators. Light misting on foliage once or twice a week keeps leaves fresh.",
    soil: parsedCare.soil || "Use well-draining, aerated potting soil with vermicompost and coco peat. Feed with organic balanced liquid fertilizer once a month during spring and summer growing seasons.",
    tip: parsedCare.tip || "Gently wipe leaves with a soft damp cloth every few weeks to remove dust. Clean leaves absorb light much better and produce richer chlorophyll!",
    general: parsedCare.general || null,
  };

  // ── CUSTOM / DEFAULT DISCLAIMER ──
  const parsedDisclaimer = (() => {
    if (!product.disclaimer) return {};
    try {
      return JSON.parse(product.disclaimer);
    } catch {
      return { general: product.disclaimer };
    }
  })();

  const disclaimer = {
    bannerTitle: parsedDisclaimer.bannerTitle || "Important Purchase & Product Disclaimers",
    bannerText: parsedDisclaimer.bannerText || "Please review these standard nursery guidelines before placing your order to ensure the best possible experience.",
    variations: parsedDisclaimer.variations || "Plants are natural living organisms. Each specimen has its own unique branch structure, foliage count, leaf size, and coloration. Catalog photographs serve as reference representations of healthy mature plants.",
    transit: parsedDisclaimer.transit || "During courier transit in closed boxes, plants may experience temporary transport shock (slight leaf drooping or 1–2 shed bottom leaves). Place your plant in bright indirect light, water lightly, and allow 3–5 days to fully recover.",
    pot: parsedDisclaimer.pot || `The pot provided corresponds to your selected option (${product.potIncluded || "Standard Nursery Pot"}). Decorative ceramic or fiber pots shown in styled lifestyle photos are for staging unless explicitly chosen in product specs.`,
    returns: product.sellWithCod
      ? "Due to Cash on Delivery eligibility, this product is non-returnable / non-refundable once delivered. However, plants severely damaged during transit are 100% eligible for immediate free replacement upon sharing unboxing proof within 48 hours."
      : product.returnable
      ? (parsedDisclaimer.returns || "This plant is returnable or replaceable within 14 days if received damaged. Please capture an unboxing video or clear photo upon arrival.")
      : (parsedDisclaimer.returns || "Due to the perishable nature of live plants, this product is non-returnable once opened. However, plants severely damaged during transit are 100% eligible for immediate free replacement upon sharing unboxing proof within 48 hours."),
    safety: parsedDisclaimer.safety || "Certain ornamental houseplants can cause mild stomach upset if chewed or ingested by curious cats, dogs, or small children. Please research plant toxicity if placing within reach of pets.",
    general: parsedDisclaimer.general || null,
  };

  const tabs = [
    {
      id: "care" as TabKey,
      label: "Plant Care",
      icon: <FaLeaf className="shrink-0 text-emerald-600" />,
      badge: "Essential",
    },
    {
      id: "disclaimer" as TabKey,
      label: "Disclaimer",
      icon: <FaExclamationTriangle className="shrink-0 text-amber-600" />,
      badge: "Important",
    },
    {
      id: "specs" as TabKey,
      label: "Specifications",
      icon: <FaListUl className="shrink-0 text-blue-600" />,
    },
    {
      id: "delivery" as TabKey,
      label: "Delivery & Returns",
      icon: <FaShippingFast className="shrink-0 text-teal-600" />,
    },
  ];

  return (
    <section className="w-full mt-10 pt-6 border-t border-brand/10">
      {/* ── SECTION HEADER ── */}
      <div className="mb-6">
        <span className="text-[11px] font-bold tracking-widest text-emerald-800 uppercase bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
          General Information
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-2">
          Product Details & Care Guide
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Everything you need to help your plant thrive and stay healthy in your home.
        </p>
      </div>

      {/* ── TAB NAVIGATION BAR ── */}
      <div className="flex border-b border-gray-200 gap-2 sm:gap-4 overflow-x-auto scrollbar-none pb-px" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-3.5 sm:px-5 font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border-b-2 -mb-px rounded-t-xl ${
                isActive
                  ? "border-emerald-700 text-emerald-900 bg-emerald-50/70"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase tracking-wider hidden sm:inline-block ${
                    isActive
                      ? "bg-emerald-700 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── TAB PANELS ── */}
      <div className="py-6 transition-all duration-300">
        {/* ── TAB 1: DEDICATED PLANT CARE TAB ── */}
        {activeTab === "care" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Quick Care Snapshot Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-100 flex flex-col">
                <span className="text-[11px] uppercase font-bold text-emerald-800 tracking-wider">Placement</span>
                <span className="text-sm font-bold text-gray-900 mt-1">
                  {care.placement}
                </span>
              </div>
              <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-100 flex flex-col">
                <span className="text-[11px] uppercase font-bold text-blue-800 tracking-wider">Watering</span>
                <span className="text-sm font-bold text-gray-900 mt-1">{care.watering}</span>
              </div>
              <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-100 flex flex-col">
                <span className="text-[11px] uppercase font-bold text-amber-800 tracking-wider">Maintenance</span>
                <span className="text-sm font-bold text-gray-900 mt-1">
                  {care.maintenance}
                </span>
              </div>
              <div className="p-3.5 bg-purple-50/80 rounded-2xl border border-purple-100 flex flex-col">
                <span className="text-[11px] uppercase font-bold text-purple-800 tracking-wider">Potting</span>
                <span className="text-sm font-bold text-gray-900 mt-1">
                  {care.potting}
                </span>
              </div>
            </div>

            {/* Optional General Custom Care Instructions Note */}
            {care.general && (
              <div className="p-4 bg-white rounded-2xl border border-emerald-200/80 shadow-xs">
                <h4 className="text-sm font-bold text-emerald-900 mb-1">Custom Plant Care Guide</h4>
                <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-line leading-relaxed">{care.general}</p>
              </div>
            )}

            {/* Detailed Plant Care Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              {/* Sunlight & Placement */}
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 text-amber-600 font-bold">
                  <FaSun size={15} />
                  <span>Sunlight & Light Needs</span>
                </div>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {care.light}
                </p>
              </div>

              {/* Watering Schedule */}
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                  <FaTint size={15} />
                  <span>Watering Schedule</span>
                </div>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {care.wateringSchedule}
                </p>
              </div>

              {/* Temperature & Environment */}
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 text-rose-600 font-bold">
                  <FaThermometerHalf size={15} />
                  <span>Temperature & Humidity</span>
                </div>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {care.temperature}
                </p>
              </div>

              {/* Feeding & Soil */}
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <FaSeedling size={15} />
                  <span>Soil & Fertilizing</span>
                </div>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {care.soil}
                </p>
              </div>
            </div>

            {/* Pro Tip Callout */}
            {care.tip && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-start gap-3">
                <span className="text-emerald-700 text-lg mt-0.5">💡</span>
                <div className="text-xs sm:text-sm">
                  <strong className="text-emerald-900 block font-bold mb-0.5">GoGreen Care Tip:</strong>
                  <span className="text-emerald-900/80 whitespace-pre-line">
                    {care.tip}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: DEDICATED DISCLAIMER TAB ── */}
        {activeTab === "disclaimer" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="p-4 sm:p-5 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
              <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm sm:text-base mb-2">
                <FaExclamationTriangle className="text-amber-600 shrink-0" size={16} />
                <span>{disclaimer.bannerTitle}</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900/80 leading-relaxed whitespace-pre-line">
                {disclaimer.bannerText}
              </p>
            </div>

            {disclaimer.general && (
              <div className="p-4 bg-white rounded-2xl border border-amber-200/80 shadow-xs">
                <h4 className="text-sm font-bold text-amber-900 mb-1">Additional Notice</h4>
                <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-line leading-relaxed">{disclaimer.general}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              {/* Natural Variation */}
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <FaLeaf size={14} className="text-emerald-600" />
                  <span>Living Plant Natural Variations</span>
                </div>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {disclaimer.variations}
                </p>
              </div>

              {/* Transit & Acclimatization */}
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <FaBoxOpen size={14} className="text-blue-600" />
                  <span>Transit Stress & Acclimatization</span>
                </div>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {disclaimer.transit}
                </p>
              </div>

              {/* Pot & Planters */}
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <FaCheckCircle size={14} className="text-purple-600" />
                  <span>Pot & Planter Specifications</span>
                </div>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {disclaimer.pot}
                </p>
              </div>

              {/* Returns & Replacement Policy */}
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <FaShieldAlt size={14} className="text-emerald-600" />
                  <span>Returns & Replacement Terms</span>
                </div>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {disclaimer.returns}
                </p>
              </div>
            </div>

            {/* Pet Safety Caution */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs sm:text-sm text-gray-600">
              <strong className="text-gray-900 font-bold block mb-1">🐾 Pet & Household Safety:</strong>
              <span className="whitespace-pre-line">
                {disclaimer.safety}
              </span>
            </div>
          </div>
        )}

        {/* ── TAB 3: SPECIFICATIONS TAB ── */}
        {activeTab === "specs" && (
          <div className="animate-in fade-in duration-300">
            <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-xs">
              <h3 className="font-serif font-bold text-lg text-emerald-900 mb-4">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-xs sm:text-sm">
                {product.sku && (
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500 font-normal">SKU</span>
                    <span className="font-mono font-semibold text-gray-900">{product.sku}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500 font-normal">Weight</span>
                    <span className="font-semibold text-gray-900">{product.weight} kg</span>
                  </div>
                )}
                {product.plantHeight && (
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500 font-normal">Approx Plant Height</span>
                    <span className="font-semibold text-gray-900">{product.plantHeight} inches</span>
                  </div>
                )}
                {product.plantAge && (
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500 font-normal">Nursery Plant Age</span>
                    <span className="font-semibold text-gray-900">
                      {product.plantAge} {product.plantAge === 1 ? "year" : "years"}
                    </span>
                  </div>
                )}
                {product.plantType && (
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500 font-normal">Plant Type</span>
                    <span className="font-semibold text-gray-900">{product.plantType}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500 font-normal">Maintenance Level</span>
                  <span className="font-semibold text-gray-900">{product.maintenance || "Low Maintenance"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500 font-normal">Pot Included</span>
                  <span className="font-semibold text-gray-900">{product.potIncluded || "Pot Included"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500 font-normal">Placement Category</span>
                  <span className="font-semibold text-gray-900">
                    {product.isIndoor ? "Indoor Plant" : "Outdoor Plant"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500 font-normal">Cash on Delivery (COD)</span>
                  <span className={`font-semibold ${product.sellWithCod ? "text-emerald-700" : "text-gray-700"}`}>
                    {product.sellWithCod ? "Available (under ₹1,000)" : "Not Available (Prepaid Only)"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500 font-normal">Return Policy</span>
                  <span className="font-semibold text-gray-900">
                    {product.sellWithCod
                      ? "Non-Refundable (COD Item - Replacement Only)"
                      : product.returnable
                      ? "Returnable (14 Days)"
                      : "Non-Returnable (Replacement Only)"}
                  </span>
                </div>
                {(product.length || product.width || product.height) && (
                  <div className="flex justify-between border-b border-gray-100 pb-2 sm:col-span-2">
                    <span className="text-gray-500 font-normal">Package Dimensions</span>
                    <span className="font-semibold text-gray-900">
                      {product.length || 0} × {product.width || 0} × {product.height || 0} cm
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: DELIVERY & RETURNS TAB ── */}
        {activeTab === "delivery" && (
          <div className="space-y-4 animate-in fade-in duration-300 text-xs sm:text-sm">
            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-teal-800">
                <FaShippingFast size={16} />
                <span>Shipping & Packaging</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {product.shippingCharge != null && product.shippingCharge > 0
                  ? `Standard shipping fee of ₹${product.shippingCharge.toFixed(2)} applies. Orders above ₹4,999 qualify for Free Shipping.`
                  : "Free Shipping included on this item. Orders above ₹4,999 qualify for express shipping."}
              </p>
              <p className="text-gray-600 leading-relaxed">
                All plants are packaged in ventilated, shock-resistant botanical cartons engineered to hold pots firmly in place and protect delicate leaves throughout transport.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <FaBoxOpen size={16} />
                <span>Return & Refund Policy</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {product.sellWithCod
                  ? "This product is eligible for Cash on Delivery. Per nursery guidelines, all COD items are strictly Non-Refundable / Non-Returnable once accepted. If your plant arrives damaged during transit, you are 100% covered by our free replacement guarantee upon providing unboxing proof within 48 hours."
                  : product.returnable
                  ? "Prepaid order: This plant is returnable or replaceable within 14 days if received damaged. Please capture an unboxing video or clear photo upon arrival."
                  : "Prepaid order: Due to the delicate nature of live plants, this product is non-returnable once opened, but fully covered by our free replacement guarantee within 48 hours if damaged in transit."}
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <FaShieldAlt size={16} />
                <span>Safe Arrival Guarantee</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We stand behind our green babies. If your plant arrives broken or damaged due to courier handling, simply share unboxing photos within 48 hours and our support team will dispatch a replacement without hassle.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
