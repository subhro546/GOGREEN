/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { FaTrash, FaSpinner, FaPlus, FaEdit, FaSave } from "react-icons/fa";
import ImageUploadDropzone from "../../../../components/admin/ImageUploadDropzone";

interface Banner {
  id: string;
  src: string;
  alt: string;
}

interface Promo {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  bgColor: string;
  titleColor: string;
  colSpan: string;
  height: string;
}

export default function AdminBannersAndPromos() {
  const [activeTab, setActiveTab] = useState<"hero" | "promos">("hero");
  
  // Hero Banners State
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [bannerAlt, setBannerAlt] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");

  // Promos State
  const [promos, setPromos] = useState<Promo[]>([]);
  const [promosLoading, setPromosLoading] = useState(true);
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);
  
  // Promo Form Edit State
  const [promoTitle, setPromoTitle] = useState("");
  const [promoSubtitle, setPromoSubtitle] = useState("");
  const [promoLink, setPromoLink] = useState("");
  const [promoImage, setPromoImage] = useState("");
  const [promoBgColor, setPromoBgColor] = useState("");
  const [promoTitleColor, setPromoTitleColor] = useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchBanners = async () => {
    try {
      setBannersLoading(true);
      const res = await fetch("/api/banners");
      if (!res.ok) throw new Error("Failed to fetch banners");
      const data = await res.json();
      setBanners(data);
    } catch {
      setError("Failed to load hero banners.");
    } finally {
      setBannersLoading(false);
    }
  };

  const fetchPromos = async () => {
    try {
      setPromosLoading(true);
      const res = await fetch("/api/promos");
      if (!res.ok) throw new Error("Failed to fetch promotional grid");
      const data = await res.json();
      setPromos(data);
      if (data.length > 0 && !selectedPromo) {
        selectPromoItem(data[0]);
      }
    } catch {
      setError("Failed to load promo grid cards.");
    } finally {
      setPromosLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchPromos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectPromoItem = (promo: Promo) => {
    setSelectedPromo(promo);
    setPromoTitle(promo.title);
    setPromoSubtitle(promo.subtitle);
    setPromoLink(promo.link);
    setPromoImage(promo.image);
    setPromoBgColor(promo.bgColor);
    setPromoTitleColor(promo.titleColor);
  };

  // Submit Hero Banner
  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerImageUrl.trim()) {
      setError("Banner image is required");
      return;
    }

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          src: bannerImageUrl.trim(),
          alt: bannerAlt.trim() || "Carousel Showcase Banner",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create banner");
      }

      setSuccess("Showcase banner added successfully!");
      setBannerAlt("");
      setBannerImageUrl("");
      fetchBanners();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add banner");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Hero Banner
  const handleBannerDelete = async (id: string) => {
    if (id.startsWith("default_")) {
      alert("Default system showcase banners cannot be deleted. Please upload a new banner first, and system placeholders will automatically be replaced.");
      return;
    }

    if (!confirm("Are you sure you want to delete this showcase banner?")) return;

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete banner");
      }

      setSuccess("Showcase banner deleted successfully!");
      fetchBanners();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete banner");
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Promo Edit
  const handlePromoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPromo) return;
    if (!promoImage.trim() || !promoTitle.trim()) {
      setError("Title and image are required");
      return;
    }

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/promos/${selectedPromo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: promoTitle.trim(),
          subtitle: promoSubtitle.trim(),
          image: promoImage.trim(),
          link: promoLink.trim(),
          bgColor: promoBgColor.trim(),
          titleColor: promoTitleColor.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update promo card");
      }

      setSuccess(`Promo Card #${selectedPromo.id} updated successfully!`);
      
      // Update local state
      const updatedPromo = await res.json();
      setPromos(prev => prev.map(p => p.id === selectedPromo.id ? updatedPromo : p));
      setSelectedPromo(updatedPromo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update promo card");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="border-b border-brand/10 pb-5">
        <h1 className="text-3xl font-serif font-bold text-brand-secondary italic">Website Media Manager</h1>
        <p className="text-text-dark/60 text-sm mt-1">Manage dynamic elements such as home hero banners and promotional layout grid images.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand/10">
        <button
          onClick={() => { setActiveTab("hero"); setError(""); setSuccess(""); }}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === "hero" 
              ? "border-brand-secondary text-brand-secondary" 
              : "border-transparent text-text-dark/50 hover:text-text-dark"
          }`}
        >
          🖼️ Hero Showcase Banners
        </button>
        <button
          onClick={() => { setActiveTab("promos"); setError(""); setSuccess(""); }}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === "promos" 
              ? "border-brand-secondary text-brand-secondary" 
              : "border-transparent text-text-dark/50 hover:text-text-dark"
          }`}
        >
          ✨ Promo Grid Cards
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 font-semibold flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-brand-light/20 border border-brand-secondary/20 rounded-2xl text-sm text-brand-secondary font-semibold flex items-center gap-2">
          <span>✅</span> {success}
        </div>
      )}

      {activeTab === "hero" ? (
        /* ── HERO BANNER MANAGEMENT TAB ── */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="bg-white p-6 rounded-3xl border border-brand/5 shadow-sm space-y-6 h-fit">
            <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
              <span className="text-brand-secondary">🖼️</span> Add Hero Banner
            </h2>
            
            <form onSubmit={handleBannerSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-dark">Banner Image</label>
                <ImageUploadDropzone 
                  onUploadSuccess={setBannerImageUrl} 
                  defaultImageUrl={bannerImageUrl}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-dark">Alt Text description</label>
                <input
                  type="text"
                  placeholder="e.g. Beautiful flower plants banner"
                  value={bannerAlt}
                  onChange={(e) => setBannerAlt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading || !bannerImageUrl}
                className="w-full bg-brand-secondary hover:bg-brand-topbar text-white py-3 rounded-xl font-bold transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                <span>Add Banner</span>
              </button>
            </form>
          </div>

          {/* Right Column: Grid list */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
              <span className="text-brand-secondary">✨</span> Active Slideshow Showcases
            </h2>

            {bannersLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-brand/5 shadow-sm">
                <FaSpinner className="animate-spin text-brand text-3xl" />
                <p className="text-text-dark/50 text-sm mt-3 font-medium">Fetching showcases...</p>
              </div>
            ) : banners.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-brand/5 shadow-sm">
                <span className="text-4xl block mb-3">🖼️</span>
                <p className="text-text-dark/60 font-medium">No banners uploaded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((banner) => {
                  const isDefault = banner.id.startsWith("default_");
                  return (
                    <div 
                      key={banner.id} 
                      className="bg-white rounded-3xl border border-brand/5 shadow-sm overflow-hidden flex flex-col group relative"
                    >
                      <div className="aspect-[2.2/1] bg-brand-hero overflow-hidden relative">
                        <img 
                          src={banner.src} 
                          alt={banner.alt} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {isDefault && (
                          <div className="absolute top-2 left-2 bg-amber-500/90 text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
                            Default System Banner
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex items-center justify-between gap-3 bg-white flex-1 border-t border-brand/5">
                        <div className="truncate">
                          <p className="text-xs text-text-dark/40 font-bold uppercase tracking-wider">Alt text description</p>
                          <p className="text-sm font-semibold text-text-dark truncate mt-0.5" title={banner.alt}>
                            {banner.alt}
                          </p>
                        </div>
                        {!isDefault && (
                          <button
                            type="button"
                            onClick={() => handleBannerDelete(banner.id)}
                            disabled={actionLoading}
                            className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all border border-red-100 hover:border-red-500 shadow-sm shrink-0 disabled:opacity-50"
                          >
                            <FaTrash size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── PROMO BANNER MANAGEMENT TAB ── */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Select Promo Card to Edit */}
          <div className="space-y-4 lg:col-span-2">
            <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
              <span className="text-brand-secondary">🎨</span> Select Deal Grid Card to Edit
            </h2>
            
            {promosLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-brand/5 shadow-sm">
                <FaSpinner className="animate-spin text-brand text-3xl" />
                <p className="text-text-dark/50 text-sm mt-3 font-medium">Loading grid items...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {promos.map((promo) => {
                  const isSelected = selectedPromo?.id === promo.id;
                  return (
                    <div
                      key={promo.id}
                      onClick={() => selectPromoItem(promo)}
                      className={`cursor-pointer rounded-3xl overflow-hidden border p-4 transition-all duration-300 flex flex-col justify-between ${
                        isSelected 
                          ? "border-brand-secondary ring-2 ring-brand-secondary bg-brand-hero/20 scale-[1.01]" 
                          : "border-brand/10 bg-white hover:border-brand-secondary/45"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Thumbnail */}
                        <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-brand-hero border border-brand/5">
                          <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="truncate flex-1">
                          <span className="text-[10px] font-black uppercase text-brand-secondary bg-brand-hero px-2 py-0.5 rounded border border-brand/5">
                            GRID POSITION #{promo.id}
                          </span>
                          <h4 className="font-bold text-text-dark truncate text-sm mt-1">{promo.title}</h4>
                          <p className="text-xs text-text-dark/50 truncate">{promo.subtitle}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-brand/5 pt-3">
                        <span className="text-xs text-text-dark/40 font-mono">Link: {promo.link}</span>
                        <span className="text-xs text-brand-secondary font-bold flex items-center gap-1">
                          <FaEdit size={10} /> Edit Card
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Edit Promo Card Form */}
          <div className="bg-white p-6 rounded-3xl border border-brand/5 shadow-sm space-y-6 h-fit">
            {selectedPromo ? (
              <>
                <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
                  <span className="text-brand-secondary">📝</span> Edit Grid Item #{selectedPromo.id}
                </h2>
                
                <form onSubmit={handlePromoUpdate} className="space-y-4">
                  {/* Image Upload Zone */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-dark">Promo Card Background Image</label>
                    <ImageUploadDropzone 
                      onUploadSuccess={setPromoImage} 
                      defaultImageUrl={promoImage}
                    />
                  </div>

                  {/* Title */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-text-dark">Title Banner Text</label>
                    <input
                      type="text"
                      value={promoTitle}
                      onChange={(e) => setPromoTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
                      placeholder="Promo Title"
                      required
                    />
                  </div>

                  {/* Subtitle */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-text-dark">Description Subtitle</label>
                    <textarea
                      rows={2}
                      value={promoSubtitle}
                      onChange={(e) => setPromoSubtitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
                      placeholder="Promo Subtitle"
                    />
                  </div>

                  {/* Link Target */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-text-dark">Redirect Shop URL Link</label>
                    <input
                      type="text"
                      value={promoLink}
                      onChange={(e) => setPromoLink(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
                      placeholder="e.g. /shop?category=Indoor%20Plants"
                      required
                    />
                  </div>

                  {/* BG color & title color classes (Tailwind style) */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-text-dark">Tailwind BgColor class</label>
                      <input
                        type="text"
                        value={promoBgColor}
                        onChange={(e) => setPromoBgColor(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-text-dark/15 focus:outline-none text-xs bg-white"
                        placeholder="e.g. bg-[#f4f7e6]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-text-dark">Tailwind TitleColor class</label>
                      <input
                        type="text"
                        value={promoTitleColor}
                        onChange={(e) => setPromoTitleColor(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-text-dark/15 focus:outline-none text-xs bg-white"
                        placeholder="e.g. text-[#8b2323]"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={actionLoading || !promoImage || !promoTitle}
                    className="w-full bg-brand-secondary hover:bg-brand-topbar text-white py-3 rounded-xl font-bold transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    <span>Save Grid Item Changes</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-sm text-text-dark/50 font-medium">Select a deal card from the list to begin editing.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
