/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { FaTrash, FaSpinner, FaPlus } from "react-icons/fa";
import ImageUploadDropzone from "../../../../components/admin/ImageUploadDropzone";

interface Category {
  id: string;
  name: string;
  image: string;
  tag: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [useUrlInput, setUseUrlInput] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch {
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !imageUrl.trim()) {
      setError("Name and image are required");
      return;
    }

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          image: imageUrl.trim(),
          tag: tag.trim() || "Featured",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create category");
      }

      setSuccess("Category added successfully!");
      setName("");
      setTag("");
      setImageUrl("");
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? Products belonging to this category will not be deleted but they will no longer be grouped under it.")) return;

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete category");
      }

      setSuccess("Category deleted successfully!");
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category");
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-secondary">Categories</h1>
        <p className="text-text-dark/60 mt-1">Manage product categories for your store.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 columns: List Categories */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-brand/5 overflow-hidden">
          <div className="p-6 border-b border-brand/5">
            <h2 className="text-xl font-bold text-text-dark">All Categories</h2>
          </div>

          {loading ? (
            <div className="p-12 flex justify-center items-center">
              <FaSpinner className="animate-spin text-brand-secondary text-3xl" />
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center text-text-dark/50">
              No categories found. Add one on the right.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-hero/50 text-text-dark/60 text-sm">
                    <th className="p-4 font-medium">Preview</th>
                    <th className="p-4 font-medium">Category Name</th>
                    <th className="p-4 font-medium">Tag</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-brand-hero/50 transition-colors border-t border-brand/5">
                      <td className="p-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden border border-brand/10 bg-brand-hero">
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 font-bold text-text-dark">{cat.name}</td>
                      <td className="p-4">
                        <span className="bg-brand-hero text-brand-secondary text-xs px-2.5 py-1 rounded-full font-semibold border border-brand/10">
                          {cat.tag}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(cat.id)}
                          disabled={actionLoading}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all inline-flex items-center gap-1.5"
                          title="Delete Category"
                        >
                          <FaTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column: Add Category Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand/5 space-y-6">
          <h2 className="text-xl font-bold text-text-dark">Add New Category</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rare Plants"
                className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-dark/80 mb-1.5">
                Badge / Tag
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. Collector's Choice"
                className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-text-dark/80">
                  Category Image *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setUseUrlInput(!useUrlInput);
                    setImageUrl("");
                  }}
                  className="text-xs text-brand-secondary hover:underline font-bold"
                >
                  {useUrlInput ? "Upload from Device" : "Enter Image URL"}
                </button>
              </div>

              {useUrlInput ? (
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="e.g. https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all text-sm bg-white"
                />
              ) : (
                <ImageUploadDropzone
                  onUploadSuccess={(url) => setImageUrl(url)}
                  defaultImageUrl={imageUrl}
                />
              )}
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full bg-brand-secondary text-white py-3 px-4 rounded-xl font-bold hover:bg-brand-topbar transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              {actionLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FaPlus size={14} /> Add Category
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
