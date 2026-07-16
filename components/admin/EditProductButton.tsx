/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaTimes, FaSpinner, FaEdit, FaInfoCircle } from "react-icons/fa";
import ImageUploadDropzone from "./ImageUploadDropzone";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  stock: number;
  images: string; // JSON array string
  isIndoor: boolean;
  mrp?: number | null;
  shippingCharge?: number | null;
  sku?: string | null;
  weight?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  plantHeight?: number | null;
  plantAge?: number | null;
  returnable: boolean;
  potIncluded: string;
  isSeed: boolean;
  isFlowerPlant: boolean;
  isFruitPlant: boolean;
  maintenance: string;
  sellWithCod: boolean;
  plantType?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
}

interface EditProductButtonProps {
  product: Product;
}

export default function EditProductButton({ product }: EditProductButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Tab state
  const [activeTab, setActiveTab] = useState("general");

  // Form states - General
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  
  const parsedImages = (() => {
    try {
      const parsed = JSON.parse(product.images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();
  const [imagesList, setImagesList] = useState<string[]>(parsedImages);
  const [urlInput, setUrlInput] = useState("");
  const [useUrlInput, setUseUrlInput] = useState(false);

  // Form states - Inventory & Pricing
  const [price, setPrice] = useState(product.price.toString());
  const [mrp, setMrp] = useState(product.mrp?.toString() || "");
  const [shippingCharge, setShippingCharge] = useState(product.shippingCharge?.toString() || "");
  const [sku, setSku] = useState(product.sku || "");
  const [weight, setWeight] = useState(product.weight?.toString() || "");
  const [category, setCategory] = useState(product.category);
  const [subcategory, setSubcategory] = useState(product.subcategory || "");
  const [categories, setCategories] = useState<string[]>([]);
  const [stock, setStock] = useState(product.stock.toString());
  const [isIndoor, setIsIndoor] = useState(product.isIndoor);
  const [length, setLength] = useState(product.length?.toString() || "");
  const [width, setWidth] = useState(product.width?.toString() || "");
  const [height, setHeight] = useState(product.height?.toString() || "");

  // Form states - Specs & Variants
  const [plantHeight, setPlantHeight] = useState(product.plantHeight?.toString() || "");
  const [plantAge, setPlantAge] = useState(product.plantAge?.toString() || "");
  const [returnable, setReturnable] = useState(product.returnable);
  const [potIncluded, setPotIncluded] = useState(product.potIncluded);
  const [isSeed, setIsSeed] = useState(product.isSeed);
  const [isFlowerPlant, setIsFlowerPlant] = useState(product.isFlowerPlant);
  const [isFruitPlant, setIsFruitPlant] = useState(product.isFruitPlant);
  const [maintenance, setMaintenance] = useState(product.maintenance);
  const [sellWithCod, setSellWithCod] = useState(product.sellWithCod);
  const [plantType, setPlantType] = useState(product.plantType || "");

  // Form states - SEO
  const [seoTitle, setSeoTitle] = useState(product.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(product.seoDescription || "");
  const [seoKeywords, setSeoKeywords] = useState(product.seoKeywords || "");

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      setImagesList((prev) => [...prev, urlInput.trim()]);
      setUrlInput("");
    }
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        if (res.ok) {
          const data = await res.json();
          const names = data.map((c: { name: string }) => c.name);
          setCategories(names);
          if (product.category && !names.includes(product.category)) {
            setCategories((prev) => [product.category, ...prev]);
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    if (isOpen) {
      fetchCats();
    }
  }, [isOpen, product.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Plant Name is required");
      setActiveTab("general");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      setActiveTab("general");
      return;
    }
    if (imagesList.length === 0) {
      setError("Please add at least one product image");
      setActiveTab("general");
      return;
    }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      setError("A valid product Price is required");
      setActiveTab("inventory");
      return;
    }
    if (!stock || isNaN(parseInt(stock)) || parseInt(stock) < 0) {
      setError("Stock Quantity is required");
      setActiveTab("inventory");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          price: parseFloat(price),
          category,
          subcategory: subcategory.trim(),
          stock: parseInt(stock),
          images: imagesList,
          isIndoor,
          mrp: mrp ? parseFloat(mrp) : null,
          shippingCharge: shippingCharge ? parseFloat(shippingCharge) : null,
          sku: sku.trim() || null,
          weight: weight ? parseFloat(weight) : null,
          length: length ? parseFloat(length) : null,
          width: width ? parseFloat(width) : null,
          height: height ? parseFloat(height) : null,
          plantHeight: plantHeight ? parseFloat(plantHeight) : null,
          plantAge: plantAge ? parseFloat(plantAge) : null,
          returnable,
          potIncluded,
          isSeed,
          isFlowerPlant,
          isFruitPlant,
          maintenance,
          sellWithCod,
          plantType: plantType.trim() || null,
          seoTitle: seoTitle.trim() || null,
          seoDescription: seoDescription.trim() || null,
          seoKeywords: seoKeywords.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update product");
      }

      setIsOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setActiveTab("general");
          setError("");
          setIsOpen(true);
        }}
        className="p-2 text-brand-secondary hover:bg-brand-hero/50 rounded-xl transition-all inline-flex items-center gap-1.5 border border-brand/5 bg-white shadow-sm"
        title="Edit Product"
      >
        <FaEdit size={14} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-left">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !loading && setIsOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl border border-brand/10 max-h-[90vh] overflow-y-auto z-10">
            <button
              onClick={() => setIsOpen(false)}
              disabled={loading}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-brand-hero transition-colors text-text-dark/50 hover:text-text-dark disabled:opacity-50"
            >
              <FaTimes size={18} />
            </button>

            <h3 className="text-2xl font-serif font-bold text-brand-secondary mb-4 italic">Edit Product</h3>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex border-b border-brand/10 mb-6 overflow-x-auto scrollbar-thin">
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`py-2 px-4 font-bold text-xs border-b-2 transition-all shrink-0 uppercase tracking-wider ${
                  activeTab === "general"
                    ? "border-brand-secondary text-brand-secondary"
                    : "border-transparent text-text-dark/55 hover:text-brand-secondary"
                }`}
              >
                📋 General Info
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("inventory")}
                className={`py-2 px-4 font-bold text-xs border-b-2 transition-all shrink-0 uppercase tracking-wider ${
                  activeTab === "inventory"
                    ? "border-brand-secondary text-brand-secondary"
                    : "border-transparent text-text-dark/55 hover:text-brand-secondary"
                }`}
              >
                💰 Pricing & Inventory
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("variants")}
                className={`py-2 px-4 font-bold text-xs border-b-2 transition-all shrink-0 uppercase tracking-wider ${
                  activeTab === "variants"
                    ? "border-brand-secondary text-brand-secondary"
                    : "border-transparent text-text-dark/55 hover:text-brand-secondary"
                }`}
              >
                🌿 Specs & Variants
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("seo")}
                className={`py-2 px-4 font-bold text-xs border-b-2 transition-all shrink-0 uppercase tracking-wider ${
                  activeTab === "seo"
                    ? "border-brand-secondary text-brand-secondary"
                    : "border-transparent text-text-dark/55 hover:text-brand-secondary"
                }`}
              >
                🔍 SEO Tab
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* ── TAB: GENERAL ── */}
              {activeTab === "general" && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                      Plant Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Fiddle Leaf Fig"
                      className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                      Description *
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the plant's features, soil needs, light preferences..."
                      className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent resize-none transition-all text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-dark/80 mb-2">
                      Product Images (Add one or more) *
                    </label>

                    {imagesList.length > 0 && (
                      <div className="grid grid-cols-5 gap-2 mb-3">
                        {imagesList.map((url, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-brand/10 bg-brand-hero group shadow-sm">
                            <img src={url} alt={`Upload preview ${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setImagesList((prev) => prev.filter((_, i) => i !== idx))}
                              className="absolute -top-1 -right-1 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all shadow-md"
                              title="Remove image"
                            >
                              <FaTimes size={8} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-text-dark/50">
                        {useUrlInput ? "Paste a URL and click Add" : "Upload files one by one"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setUseUrlInput(!useUrlInput);
                          setUrlInput("");
                        }}
                        className="text-xs text-brand-secondary hover:underline font-bold"
                      >
                        {useUrlInput ? "Upload from Device" : "Enter Image URL"}
                      </button>
                    </div>

                    {useUrlInput ? (
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="e.g. https://images.unsplash.com/..."
                          className="flex-1 px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddUrl}
                          className="bg-brand-secondary text-white px-4 py-2.5 rounded-xl font-bold hover:bg-brand-topbar text-sm shadow-md"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <ImageUploadDropzone
                        onUploadSuccess={(url) => {
                          if (url) setImagesList((prev) => [...prev, url]);
                        }}
                        defaultImageUrl=""
                      />
                    )}
                  </div>
                </div>
              )}

              {/* ── TAB: INVENTORY & PRICING ── */}
              {activeTab === "inventory" && (
                <div className="space-y-5 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                        Selling Price (₹) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="500.00"
                        className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                        MRP / List Price (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={mrp}
                        onChange={(e) => setMrp(e.target.value)}
                        placeholder="799.00"
                        className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                        Shipping Charge (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={shippingCharge}
                        onChange={(e) => setShippingCharge(e.target.value)}
                        placeholder="49.00"
                        className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        placeholder="GG-MONST-01"
                        className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                        Weight (KG)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="1.25"
                        className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="25"
                        className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                        Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary bg-white transition-all text-sm"
                      >
                        {categories.map((catName) => (
                          <option key={catName} value={catName}>{catName}</option>
                        ))}
                        {categories.length === 0 && (
                          <>
                            <option value="Indoor Plant">Indoor Plant</option>
                            <option value="Low Maintenance">Low Maintenance</option>
                            <option value="Air Purifying">Air Purifying</option>
                            <option value="Outdoor Plant">Outdoor Plant</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                        Subcategory
                      </label>
                      <input
                        type="text"
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        placeholder="e.g. Fern, Cactus, Palm"
                        className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                      Package Dimensions (cm)
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="number"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        placeholder="Length"
                        className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
                      />
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder="Width"
                        className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
                      />
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="Height"
                        className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-1">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isIndoor}
                        onChange={(e) => setIsIndoor(e.target.checked)}
                        className="w-5 h-5 rounded border-text-dark/20 text-brand-secondary focus:ring-brand-secondary cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-text-dark/85">Suitable for Indoor Display?</span>
                    </label>
                  </div>
                </div>
              )}

              {/* ── TAB: SPECS & VARIANTS ── */}
              {activeTab === "variants" && (
                <div className="space-y-5 animate-fade-in max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                        Plant Height (inches)
                      </label>
                      <input
                        type="number"
                        value={plantHeight}
                        onChange={(e) => setPlantHeight(e.target.value)}
                        placeholder="e.g. 18"
                        className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                        Plant Age (years)
                      </label>
                      <input
                        type="number"
                        value={plantAge}
                        onChange={(e) => setPlantAge(e.target.value)}
                        placeholder="e.g. 2"
                        className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-1">
                    <div>
                      <span className="block text-sm font-semibold text-text-dark/80 mb-2">Return Policy</span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                          <input
                            type="radio"
                            name="returnable"
                            checked={returnable === true}
                            onChange={() => setReturnable(true)}
                            className="w-4 h-4 text-brand-secondary border-text-dark/15"
                          />
                          Returnable
                        </label>
                        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                          <input
                            type="radio"
                            name="returnable"
                            checked={returnable === false}
                            onChange={() => setReturnable(false)}
                            className="w-4 h-4 text-brand-secondary border-text-dark/15"
                          />
                          Non Returnable
                        </label>
                      </div>
                    </div>

                    <div>
                      <span className="block text-sm font-semibold text-text-dark/80 mb-2">Maintenance Level</span>
                      <div className="flex gap-4">
                        {["Low Maintenance", "Medium Maintenance", "High Maintenance"].map((lvl) => (
                          <label key={lvl} className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                            <input
                              type="radio"
                              name="maintenance"
                              value={lvl}
                              checked={maintenance === lvl}
                              onChange={(e) => setMaintenance(e.target.value)}
                              className="w-4 h-4 text-brand-secondary border-text-dark/15"
                            />
                            {lvl.split(" ")[0]}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="block text-sm font-semibold text-text-dark/80 mb-2">Pot Option</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {["Pot Included", "Pot Not Included", "Bare Rooted", "None"].map((pot) => (
                        <label key={pot} className="flex items-center gap-2 p-2 border border-text-dark/10 rounded-lg text-xs font-semibold cursor-pointer hover:bg-brand-hero">
                          <input
                            type="radio"
                            name="potIncluded"
                            value={pot}
                            checked={potIncluded === pot}
                            onChange={(e) => setPotIncluded(e.target.value)}
                            className="text-brand-secondary"
                          />
                          {pot}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                        Plant Type (Genus / Variant)
                      </label>
                      <input
                        type="text"
                        value={plantType}
                        onChange={(e) => setPlantType(e.target.value)}
                        placeholder="e.g. Succulent, Creeper"
                        className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
                      />
                    </div>

                    <div className="flex flex-col justify-center space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={sellWithCod}
                          onChange={(e) => setSellWithCod(e.target.checked)}
                          className="w-4.5 h-4.5 rounded border-text-dark/20 text-brand-secondary focus:ring-brand-secondary cursor-pointer"
                        />
                        <span className="text-xs font-bold text-text-dark/85">Enable Cash on Delivery (COD)?</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isSeed}
                          onChange={(e) => setIsSeed(e.target.checked)}
                          className="w-4.5 h-4.5 rounded border-text-dark/20 text-brand-secondary focus:ring-brand-secondary cursor-pointer"
                        />
                        <span className="text-xs font-bold text-text-dark/85">Is Seed Option?</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-6 py-1">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isFlowerPlant}
                        onChange={(e) => setIsFlowerPlant(e.target.checked)}
                        className="w-4.5 h-4.5 rounded border-text-dark/20 text-brand-secondary focus:ring-brand-secondary cursor-pointer"
                      />
                      <span className="text-xs font-bold text-text-dark/85">Is Flowering Plant?</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isFruitPlant}
                        onChange={(e) => setIsFruitPlant(e.target.checked)}
                        className="w-4.5 h-4.5 rounded border-text-dark/20 text-brand-secondary focus:ring-brand-secondary cursor-pointer"
                      />
                      <span className="text-xs font-bold text-text-dark/85">Is Fruiting Plant?</span>
                    </label>
                  </div>
                </div>
              )}

              {/* ── TAB: SEO ── */}
              {activeTab === "seo" && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Display title for search engine results"
                      className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                      SEO Description
                    </label>
                    <textarea
                      rows={3}
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder="Meta description shown in search results..."
                      className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary resize-none text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                      SEO Keywords
                    </label>
                    <input
                      type="text"
                      value={seoKeywords}
                      onChange={(e) => setSeoKeywords(e.target.value)}
                      placeholder="comma-separated e.g. monstera, indoor plant, buy monstera online"
                      className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
                    />
                  </div>

                  <div className="p-4 bg-brand-hero rounded-2xl flex items-start gap-3 border border-brand/5">
                    <FaInfoCircle className="text-brand-secondary mt-0.5 shrink-0" />
                    <p className="text-xs text-text-dark/60 leading-relaxed">
                      Optimizing your SEO fields makes your plants much easier to discover on Google, Bing, and other search engines. Default SEO parameters will be generated if left blank.
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-4 flex gap-4 border-t border-brand/10">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 px-4 border border-text-dark/10 rounded-xl font-bold hover:bg-brand-hero transition-colors text-text-dark disabled:opacity-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand-secondary text-white py-3 px-4 rounded-xl font-bold hover:bg-brand-topbar transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg text-sm"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
