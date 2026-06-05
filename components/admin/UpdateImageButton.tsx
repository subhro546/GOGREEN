"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaImage, FaTimes, FaSpinner, FaCloudUploadAlt, FaLink } from "react-icons/fa";

export default function UpdateImageButton({ productId, currentImage }: { productId: string; currentImage: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImage);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setError("Please provide an image");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: [imageUrl.trim()] }),
      });
      if (!res.ok) throw new Error("Failed to update image");
      setIsOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update image");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, WEBP, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Upload failed");
      }
      const data = await res.json();
      setImageUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) uploadFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) uploadFile(e.dataTransfer.files[0]);
  };

  return (
    <>
      <button
        onClick={() => { setImageUrl(currentImage); setError(""); setIsOpen(true); }}
        className="text-xs bg-brand-hero hover:bg-brand-light text-brand-secondary px-3 py-1.5 rounded-lg border border-brand/10 font-bold transition-all flex items-center gap-1.5"
      >
        <FaImage size={12} />
        <span>Replace Image</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !loading && setIsOpen(false)} />

          <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border border-brand/10 z-10">
            <button onClick={() => setIsOpen(false)} disabled={loading}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-brand-hero transition-colors text-text-dark/50 disabled:opacity-50">
              <FaTimes size={16} />
            </button>

            <h3 className="text-xl font-serif font-bold text-brand-secondary mb-1 italic">Replace Product Image</h3>
            <p className="text-xs text-text-dark/50 mb-5">Upload from your device or paste an image URL.</p>

            {/* Tab toggle */}
            <div className="flex rounded-xl border border-brand/10 overflow-hidden mb-5">
              <button type="button" onClick={() => { setUseUrlInput(false); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold transition-colors ${!useUrlInput ? "bg-brand-secondary text-white" : "bg-white text-text-dark/60 hover:bg-brand-hero"}`}>
                <FaCloudUploadAlt /> Upload File
              </button>
              <button type="button" onClick={() => { setUseUrlInput(true); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold transition-colors ${useUrlInput ? "bg-brand-secondary text-white" : "bg-white text-text-dark/60 hover:bg-brand-hero"}`}>
                <FaLink /> Paste URL
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              {useUrlInput ? (
                <div>
                  <input
                    type="url" required value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-3 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm"
                  />
                </div>
              ) : (
                <div
                  onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all min-h-[160px] ${dragActive ? "border-brand-secondary bg-brand-hero/40" : "border-text-dark/15 hover:border-brand-secondary/50 hover:bg-brand-hero/20"}`}
                  onClick={() => document.getElementById("img-file-input")?.click()}
                >
                  <input id="img-file-input" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  {loading ? (
                    <div className="flex flex-col items-center gap-2 text-brand-secondary">
                      <FaSpinner className="animate-spin text-2xl" />
                      <span className="text-xs font-semibold">Uploading to Cloudinary...</span>
                    </div>
                  ) : imageUrl && imageUrl.startsWith("http") ? (
                    <div className="w-full p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                      <p className="text-center text-xs text-green-600 font-bold mt-2">✓ Uploaded! Click to change.</p>
                    </div>
                  ) : (
                    <div className="text-center space-y-2 p-6">
                      <FaCloudUploadAlt className="text-3xl text-brand-secondary mx-auto" />
                      <p className="text-sm font-semibold text-text-dark">Drag & drop or <span className="text-brand-secondary">browse</span></p>
                      <p className="text-xs text-text-dark/50">PNG, JPG, WEBP — Max 5MB</p>
                    </div>
                  )}
                </div>
              )}

              {/* Preview for URL mode */}
              {useUrlInput && imageUrl && (
                <div className="rounded-xl overflow-hidden border border-brand/10 h-32 bg-brand-hero">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")} />
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button type="button" disabled={loading} onClick={() => setIsOpen(false)}
                  className="flex-1 py-2.5 border border-text-dark/10 rounded-xl font-bold hover:bg-brand-hero transition-colors text-xs text-text-dark disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={loading || !imageUrl.trim()}
                  className="flex-1 bg-brand-secondary text-white py-2.5 rounded-xl font-bold hover:bg-brand-topbar transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-xs shadow-md">
                  {loading ? <><FaSpinner className="animate-spin" /> Saving...</> : "Save Image"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
