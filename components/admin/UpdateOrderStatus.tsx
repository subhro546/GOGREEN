"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function UpdateOrderStatus({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to update order status.");
    }
    setLoading(false);
  };

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleUpdate(e.target.value)}
      disabled={loading}
      className="text-sm border border-foreground/20 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand bg-white disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
