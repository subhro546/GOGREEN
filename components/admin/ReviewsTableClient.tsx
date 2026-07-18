"use client";

import { useState } from "react";
import Link from "next/link";
import { FaTrash, FaStar, FaRegStar } from "react-icons/fa";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
  product: {
    id: string;
    name: string;
    category: string;
  };
}

interface ReviewsTableClientProps {
  initialReviews: ReviewItem[];
}

export default function ReviewsTableClient({ initialReviews }: ReviewsTableClientProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete review");
      }
    } catch {
      alert("Error occurred while deleting review");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesRating = filterRating === "all" || r.rating === filterRating;
    const matchesSearch =
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.user.name && r.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-yellow-400">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <FaStar key={star} className="w-3.5 h-3.5" />
          ) : (
            <FaRegStar key={star} className="w-3.5 h-3.5" />
          )
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-5 rounded-3xl border border-brand/5 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <input
          type="text"
          placeholder="Search by keyword, product, or customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
        />

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text-dark/60 uppercase tracking-wider">Rating</span>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="px-3 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-3xl border border-brand/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-hero/50 text-text-dark/60 text-sm">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Rating</th>
                <th className="p-4 font-medium">Comment</th>
                <th className="p-4 font-medium hidden md:table-cell">Date</th>
                <th className="p-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-dark/50">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-brand-hero/30 border-t border-brand/5 transition-colors text-sm">
                    <td className="p-4 max-w-xs">
                      <Link href={`/product/${review.product.id}`} target="_blank" className="font-semibold text-brand-secondary hover:text-brand-topbar hover:underline line-clamp-1">
                        {review.product.name}
                      </Link>
                      <span className="text-[10px] text-text-dark/40 font-bold uppercase tracking-wider">{review.product.category}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">{review.user.name || "Guest"}</p>
                      <p className="text-xs text-text-dark/50">{review.user.email}</p>
                    </td>
                    <td className="p-4">{renderStars(review.rating)}</td>
                    <td className="p-4 max-w-md">
                      <p className="text-text-dark/80 line-clamp-2 leading-relaxed">{review.comment}</p>
                    </td>
                    <td className="p-4 text-xs text-text-dark/50 hidden md:table-cell">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={deletingId === review.id}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                        title="Delete Review"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
