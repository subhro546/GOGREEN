"use client";

import { useRouter } from "next/navigation";

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete product.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-sm font-medium text-red-500 hover:underline"
    >
      Delete
    </button>
  );
}
