/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaTimes, FaSpinner, FaEdit } from "react-icons/fa";
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
}

interface EditProductButtonProps {
  product: Product;
}

export default function EditProductButton({ product }: EditProductButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Form states
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price.toString());
  const [category, setCategory] = useState(product.category);
  const [subcategory, setSubcategory] = useState(product.subcategory || "");
  const [categories, setCategories] = useState<string[]>([]);
  const [stock, setStock] = useState(product.stock.toString());
  
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
  const [isIndoor, setIsIndoor] = useState(product.isIndoor);

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
          // If current category is not in the fetched list (e.g. deleted or custom), add it as an option
          if (product.category && !names.includes(product.category)) {
            setCategories(prev => [product.category, ...prev]);
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
    if (imagesList.length === 0) {
      setError("Please add at least one product image");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          category,
          subcategory,
          stock: parseInt(stock),
          images: imagesList,
          isIndoor,
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
        onClick={() => setIsOpen(true)}
        className="p-2 text-brand-secondary hover:bg-brand-hero/50 rounded-xl transition-all inline-flex items-center gap-1.5 border border-brand/5 bg-white shadow-sm"
        title="Edit Product"
      >
        <FaEdit size={14} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !loading && setIsOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl border border-brand/10 max-h-[90vh] overflow-y-auto z-10">
            <button
              onClick={() => setIsOpen(false)}
              disabled={loading}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-brand-hero transition-colors text-text-dark/50 hover:text-text-dark disabled:opacity-50"
            >
              <FaTimes size={18} />
            </button>

            <h3 className="text-2xl font-serif font-bold text-brand-secondary mb-6 italic">Edit Product</h3>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                  Plant Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fiddle Leaf Fig"
                  className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell customers about this plant..."
                  className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent resize-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="500.00"
                    className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="15"
                    className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent bg-white transition-all text-sm"
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

                <div className="flex flex-col justify-end pb-2">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isIndoor}
                      onChange={(e) => setIsIndoor(e.target.checked)}
                      className="w-5 h-5 rounded border-text-dark/20 text-brand-secondary focus:ring-brand-secondary cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-text-dark/80">Indoor Plant?</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="e.g. Adenium, Bougainvillea, Money Plant"
                  className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all"
                />
                <p className="text-xs text-text-dark/40 mt-1">Used for drilldown navigation in the menu</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark/80 mb-2">
                  Product Images (Add one or more) *
                </label>

                {imagesList.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {imagesList.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-brand/10 bg-brand-hero group shadow-sm">
                        <img src={url} alt={`Upload preview ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImagesList((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute -top-1 -right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all shadow-md"
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

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 px-4 border border-text-dark/10 rounded-xl font-bold hover:bg-brand-hero transition-colors text-text-dark disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand-secondary text-white py-3 px-4 rounded-xl font-bold hover:bg-brand-topbar transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
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
