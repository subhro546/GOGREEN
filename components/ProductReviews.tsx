"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaStar, FaUserCircle } from 'react-icons/fa';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string | null;
  };
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/products/${productId}/reviews`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error('Failed to fetch reviews', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide a comment.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment }),
      });

      if (res.ok) {
        setComment('');
        setRating(5);
        const res = await fetch(`/api/products/${productId}/reviews`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit review');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (ratingValue: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${i < ratingValue ? 'text-yellow-400' : 'text-gray-200'}`}
      />
    ));
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-16 border-t border-gray-100 pt-10">
      <h2 className="text-2xl font-serif font-bold text-brand-secondary italic mb-8">Customer Reviews</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left Column: Summary & Form */}
        <div className="md:col-span-1 space-y-8">
          {/* Summary */}
          <div className="bg-brand-hero/50 p-6 rounded-2xl border border-brand/5 text-center">
            <div className="text-4xl font-bold text-brand-dark mb-2">{averageRating}</div>
            <div className="flex justify-center gap-1 mb-2">
              {renderStars(Math.round(Number(averageRating)))}
            </div>
            <div className="text-sm text-text-dark/60 font-medium">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
          </div>

          {/* Form */}
          {session ? (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-brand-dark">Write a Review</h3>
              
              {error && <p className="text-red-500 text-xs">{error}</p>}
              
              <div>
                <label className="block text-xs font-semibold text-text-dark/70 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <FaStar className={`w-6 h-6 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="block text-xs font-semibold text-text-dark/70 mb-2">Your Review</label>
                <textarea
                  id="comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you think about this plant..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-topbar text-sm resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-secondary text-white font-bold py-2.5 rounded-xl hover:bg-brand-topbar transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
              <p className="text-sm text-text-dark/70 mb-4">Please log in to write a review.</p>
              <a href="/login" className="inline-block bg-white text-brand-secondary border border-brand-secondary/30 font-bold px-6 py-2 rounded-lg hover:bg-brand-hero transition-colors text-sm">
                Log In
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Review List */}
        <div className="md:col-span-2 space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-brand-hero border-t-brand-secondary rounded-full animate-spin" />
            </div>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FaUserCircle className="w-10 h-10 text-gray-300" />
                    <div>
                      <p className="font-semibold text-text-dark text-sm">{review.user?.name || 'Anonymous User'}</p>
                      <p className="text-xs text-text-dark/50 font-medium">{new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-text-dark/80 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-100">
              <span className="text-4xl block mb-3">🌱</span>
              <h3 className="font-bold text-brand-dark mb-1">No reviews yet</h3>
              <p className="text-sm text-text-dark/60">Be the first to share your thoughts on this plant!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
