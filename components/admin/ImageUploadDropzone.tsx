/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import { FaCloudUploadAlt, FaTimes, FaSpinner } from "react-icons/fa";

interface DropzoneProps {
  onUploadSuccess: (url: string) => void;
  defaultImageUrl?: string;
}

export default function ImageUploadDropzone({ onUploadSuccess, defaultImageUrl }: DropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImageUrl || null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndUpload = async (file: File) => {
    setError("");
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, WEBP, etc.)");
      return;
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image file size should be less than 5MB");
      return;
    }

    // Set local preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Perform upload
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Upload failed");
      }

      const data = await res.json();
      onUploadSuccess(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong during upload");
      setPreviewUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onUploadSuccess("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[180px] bg-brand-light/20 ${
          dragActive
            ? "border-brand-secondary bg-brand-hero/40 scale-102"
            : "border-text-dark/15 hover:border-brand-secondary/50 hover:bg-brand-hero/20"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />

        {previewUrl ? (
          <div className="relative w-full aspect-video sm:aspect-[2/1] max-h-48 rounded-xl overflow-hidden shadow-md group">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-semibold bg-brand-secondary px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <FaCloudUploadAlt /> Change Image
              </span>
            </div>
            {/* Clear Button */}
            <button
              onClick={clearFile}
              className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full transition-colors z-10"
              title="Remove image"
            >
              <FaTimes size={12} />
            </button>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-brand-secondary shadow-sm text-xl border border-brand/5">
              {loading ? <FaSpinner className="animate-spin text-brand" /> : <FaCloudUploadAlt />}
            </div>
            <div className="text-sm font-semibold text-text-dark">
              {loading ? (
                "Uploading file..."
              ) : (
                <>
                  Drag & Drop image here, or{" "}
                  <span className="text-brand-secondary hover:underline">browse</span>
                </>
              )}
            </div>
            <p className="text-xs text-text-dark/50">Supports PNG, JPG, JPEG, WEBP (Max 5MB)</p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-xxs flex flex-col items-center justify-center gap-2 rounded-2xl">
            <FaSpinner className="animate-spin text-brand text-2xl" />
            <span className="text-xs font-semibold text-brand-secondary">Uploading to server...</span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 font-semibold mt-2 pl-1 flex items-center gap-1.5">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}
