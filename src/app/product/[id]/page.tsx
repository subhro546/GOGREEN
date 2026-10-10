import { prisma } from "../../../lib/prisma";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import AddToCartButton from "../../../../components/AddToCartButton";
import ProductImageGallery from "../../../../components/ProductImageGallery";
import ProductTabs from "../../../../components/ProductTabs";
import ProductShareButton from "../../../../components/ProductShareButton";
import ProductCard from "../../../../components/Productcard";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ProductReviews = dynamic(() => import("../../../../components/ProductReviews"), {
  loading: () => <div className="animate-pulse bg-brand-hero/50 h-64 w-full rounded-2xl mt-8" />,
});

export const revalidate = 3600;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: { reviews: true },
  });

  if (!product) {
    notFound();
  }

  // Fetch up to 4 related products from the same category (excluding current product)
  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id }
    },
    take: 4,
    orderBy: { createdAt: "desc" }
  });

  const parsedImages: string[] = (() => {
    try {
      const parsed = JSON.parse(product.images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const reviewCount = product.reviews.length;
  const averageRating = reviewCount > 0 
    ? product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviewCount 
    : 0;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-6 md:pt-12 lg:pt-20 pb-16 bg-gradient-to-br from-[#eaf5eb] via-[#f7fcf7] to-white dark:bg-none min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-brand/10 grid grid-cols-1 md:grid-cols-2 items-start relative">
            
            {/* Product Image Gallery Area */}
            <div className="w-full md:sticky md:top-28 z-10 p-6 md:p-8 lg:p-12">
              <ProductImageGallery images={parsedImages} productName={product.name} />
            </div>

            {/* Product Details Area */}
            <div className="flex flex-col p-6 md:p-8 lg:p-12 w-full">
              <div className="pl-3 border-l-[3px] border-[#2e7d32] text-xs text-text-dark/80 mb-5 leading-relaxed bg-[#2e7d32]/5 py-2.5 pr-4 rounded-r-xl">
                <strong>Note:</strong> Image for reference only. Product may vary.<br />
                {product.returnable ? "Returnable." : "Replaceable, not returnable."}
              </div>

              {/* Category & Product Share Row */}
              <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <span className="text-sm font-bold tracking-widest text-brand-topbar uppercase">{product.category}</span>
                <ProductShareButton
                  productName={product.name}
                  productId={product.id}
                  productPrice={product.price}
                  productCategory={product.category}
                  productImage={parsedImages[0]}
                />
              </div>

              <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-dark mb-2">{product.name}</h1>
              
              {/* Reviews Summary */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-yellow-400 text-sm">
                  {[1, 2, 3, 4, 5].map((star) => {
                    if (averageRating >= star) return <FaStar key={star} />;
                    if (averageRating >= star - 0.5) return <FaStarHalfAlt key={star} />;
                    return <FaRegStar key={star} className="text-gray-300 dark:text-gray-600" />;
                  })}
                </div>
                <a href="#reviews-section" className="text-sm font-medium text-text-dark/60 hover:text-brand-secondary transition-colors">
                  {reviewCount > 0 ? `${averageRating.toFixed(1)} (${reviewCount} reviews)` : "(No reviews yet)"}
                </a>
              </div>
              <div className="flex items-baseline gap-3 mb-1.5 flex-wrap">
                <span className="text-3xl font-bold text-brand-secondary">₹{product.price.toFixed(2)}</span>
                {product.mrp && product.mrp > product.price && (
                  <>
                    <span className="text-base text-red-500 line-through font-semibold">
                      ₹{product.mrp.toFixed(2)}
                    </span>
                    <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold border border-red-100">
                      {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <div className="text-xs text-text-dark/45 font-medium mb-6">
                (MRP Inclusive of all taxes)
              </div>
              
              <div className="prose text-text-dark/70 mb-8">
                <p>{product.description}</p>
              </div>

              <div className="mb-8 space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/60">
                  <span>🌿</span> {product.isIndoor ? "Indoor Plant" : "Outdoor Plant"}
                </div>
              </div>

              <AddToCartButton product={product} />

              {/* ── GENERAL INFORMATION SECTION (TABS: PLANT CARE, DISCLAIMER, SPECS, DELIVERY) ── */}
              <ProductTabs product={product} />
            </div>

          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 mb-12">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-secondary mb-8">You May Also Like</h2>
              <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:overflow-visible">
                {relatedProducts.map((related) => (
                  <div key={related.id} className="w-[45vw] min-w-[150px] max-w-[185px] sm:w-full sm:max-w-none shrink-0 snap-start">
                    <ProductCard
                      {...related}
                      description={related.description ?? undefined}
                      isSlider={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Reviews Section */}
          <div id="reviews-section" className="scroll-mt-32">
            <ProductReviews productId={product.id} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
