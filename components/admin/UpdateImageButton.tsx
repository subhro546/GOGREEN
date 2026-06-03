"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaImage, FaTimes, FaSpinner } from "react-icons/fa";
import ImageUploadDropzone from "./ImageUploadDropzone";

export default function UpdateImageButton({ productId, currentImage }: { productId: string; currentImage: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImage);
  const [useUrlInput, setUseUrlInput] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setError("Product image is required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          images: [imageUrl.trim()],
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update image");
      }

      setIsOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setImageUrl(currentImage);
          setError("");
          setIsOpen(true);
        }}
        className="text-xs bg-brand-hero hover:bg-brand-light text-brand-secondary px-3 py-1.5 rounded-lg border border-brand/10 font-bold transition-all flex items-center gap-1.5"
        title="Replace Product Image"
      >
        <FaImage size={12} />
        <span>Replace</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !loading && setIsOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border border-brand/10 z-10 animate-scale-in">
            <button
              onClick={() => setIsOpen(false)}
              disabled={loading}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-brand-hero transition-colors text-text-dark/50 hover:text-text-dark disabled:opacity-50"
            >
              <FaTimes size={16} />
            </button>

            <h3 className="text-xl font-serif font-bold text-brand-secondary mb-2 italic">Replace Product Image</h3>
            <p className="text-xs text-text-dark/50 mb-6">Choose a file from your device or paste a public URL.</p>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-text-dark/80">
                    Product Image *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setUseUrlInput(!useUrlInput);
                      setImageUrl("");
                    }}
                    className="text-xxs text-brand-secondary hover:underline font-bold"
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
                    className="w-full px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all text-xs bg-white"
                  />
                ) : (
                  <ImageUploadDropzone
                    onUploadSuccess={(url) => setImageUrl(url)}
                    defaultImageUrl={imageUrl}
                  />
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2.5 border border-text-dark/10 rounded-xl font-bold hover:bg-brand-hero transition-colors text-xs text-text-dark disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !imageUrl}
                  className="flex-1 bg-brand-secondary text-white py-2.5 rounded-xl font-bold hover:bg-brand-topbar transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-xs shadow-md"
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
