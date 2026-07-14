import { prisma } from '../src/lib/prisma';
import { FaStar, FaQuoteLeft, FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';

export default async function TestimonialSection() {
  // Fetch top-rated reviews for the testimonial section directly on the server
  const topReviews = await prisma.review.findMany({
    where: {
      rating: {
        gte: 4, // 4 or 5 star reviews
      },
      comment: {
        not: "", // ensure they wrote something
      }
    },
    include: {
      user: {
        select: { name: true },
      },
      product: {
        select: { name: true, id: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 6,
  });

  const renderStars = (ratingValue: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        className={`w-3 h-3 ${i < ratingValue ? 'text-yellow-400' : 'text-gray-200'}`}
      />
    ));
  };

  return (
    <section className="py-20 bg-[#f8faf8] relative overflow-hidden">
      {/* Decorative background leaf/shape */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-green-100 rounded-full opacity-50 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-yellow-50 rounded-full opacity-50 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block bg-brand-hero text-brand-secondary text-sm font-bold px-4 py-1.5 rounded-full mb-4 border border-brand/10 uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-topbar italic">
            What Our Plant Lovers Say
          </h2>
        </div>

        {topReviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-brand/5 text-center col-span-full">
            <span className="text-4xl block mb-4">🌱</span>
            <h3 className="font-bold text-brand-dark mb-2 text-xl">No Testimonials Yet</h3>
            <p className="text-text-dark/60">Be the first to leave a 5-star review on any of our plants!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topReviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-brand/5 relative flex flex-col h-full group hover:-translate-y-1"
              >
                <FaQuoteLeft className="absolute top-6 right-6 text-4xl text-brand-hero group-hover:text-brand-hero/70 transition-colors" />
                
                <div className="flex gap-1 mb-6">
                  {renderStars(review.rating)}
                </div>
                
                <p className="text-text-dark/80 leading-relaxed font-medium mb-8 flex-1 italic text-sm">
                  &quot;{review.comment}&quot;
                </p>
                
                <div className="mt-auto border-t border-gray-50 pt-6">
                  <div className="flex items-center gap-4">
                    <FaUserCircle className="w-12 h-12 text-gray-200" />
                    <div>
                      <h4 className="font-bold text-brand-dark text-sm">{review.user?.name || 'Happy Customer'}</h4>
                      <Link 
                        href={`/product/${review.product.id}`}
                        className="text-xs font-semibold text-brand-secondary/70 hover:text-brand-secondary transition-colors line-clamp-1"
                      >
                        Purchased: {review.product.name}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
