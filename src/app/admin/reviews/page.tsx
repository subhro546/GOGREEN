import { prisma } from "../../../lib/prisma";
import ReviewsTableClient from "../../../../components/admin/ReviewsTableClient";

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { id: true, name: true, category: true } }
    }
  });

  const serializedReviews = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
    user: {
      name: r.user.name,
      email: r.user.email
    },
    product: {
      id: r.product.id,
      name: r.product.name,
      category: r.product.category
    }
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-secondary">Customer Reviews</h1>
        <p className="text-text-dark/60 mt-1">Monitor, view, and moderate feedback submitted by customers.</p>
      </div>

      <ReviewsTableClient initialReviews={serializedReviews} />
    </div>
  );
}
