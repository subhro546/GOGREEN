"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdateStockButton({ productId, currentStock }: { productId: string, currentStock: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateStock = async (action: "increase" | "decrease") => {
    if (loading) return;
    if (action === "decrease" && currentStock <= 0) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update stock");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => updateStock("decrease")}
        disabled={loading || currentStock <= 0}
        className="w-8 h-8 flex items-center justify-center bg-brand-hero hover:bg-brand-light rounded-md text-text-dark font-bold disabled:opacity-50 transition-colors"
      >
        -
      </button>
      <span className={`w-8 text-center font-bold ${currentStock < 5 ? 'text-red-500' : 'text-text-dark'}`}>
        {currentStock}
      </span>
      <button 
        onClick={() => updateStock("increase")}
        disabled={loading}
        className="w-8 h-8 flex items-center justify-center bg-brand-hero hover:bg-brand-light rounded-md text-text-dark font-bold disabled:opacity-50 transition-colors"
      >
        +
      </button>
    </div>
  );
}
