import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, rating, comment } = await req.json();

    if (!productId || rating === undefined || rating === null || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (typeof productId !== 'string' || typeof comment !== 'string') {
      return NextResponse.json({ error: 'Invalid field types' }, { status: 400 });
    }

    const cleanProductId = productId.trim();
    const product = await prisma.product.findUnique({
      where: { id: cleanProductId },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Referenced product does not exist' }, { status: 404 });
    }

    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 });
    }

    const cleanComment = comment.trim();
    if (cleanComment.length < 2 || cleanComment.length > 1000) {
      return NextResponse.json(
        { error: 'Review comment must be between 2 and 1000 characters' },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        rating: numRating,
        comment: cleanComment,
        productId: cleanProductId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error instanceof Error ? error.message : "Error");
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Fetch top-rated reviews for the testimonial section
    const reviews = await prisma.review.findMany({
      where: {
        rating: {
          gte: 4, // Fetch reviews with 4 or 5 stars
        },
      },
      include: {
        user: {
          select: { name: true },
        },
        product: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6, // Limit to 6 reviews
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}
