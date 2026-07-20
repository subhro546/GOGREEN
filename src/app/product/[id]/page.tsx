import { prisma } from "../../../lib/prisma";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import AddToCartButton from "../../../../components/AddToCartButton";
import ProductImageGallery from "../../../../components/ProductImageGallery";
import ProductAccordions from "../../../../components/ProductAccordions";
import ProductReviews from "../../../../components/ProductReviews";
import ProductCard from "../../../../components/Productcard";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
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

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-16 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-brand/5 overflow-hidden flex flex-col">
            
            {/* Product Image Gallery Area */}
            <div className="w-full">
              <ProductImageGallery images={parsedImages} productName={product.name} />
            </div>

            {/* Product Details Area */}
            <div className="flex flex-col p-6 md:p-12 max-w-5xl mx-auto w-full">
              <div className="pl-3 border-l-[3px] border-[#2e7d32] text-xs text-text-dark/80 mb-5 leading-relaxed bg-[#2e7d32]/5 py-2.5 pr-4 rounded-r-xl">
                <strong>Note:</strong> Image for reference only. Product may vary.<br />
                {product.returnable ? "Returnable." : "Replaceable, not returnable."}
              </div>
              <div className="mb-2">
                <span className="text-sm font-bold tracking-widest text-brand-topbar uppercase">{product.category}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-dark mb-4">{product.name}</h1>
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

              {/* Plant Specifications Card */}
              <div className="mt-8 p-6 bg-brand-hero rounded-3xl border border-brand/5 shadow-sm space-y-4 text-left">
                <h3 className="font-serif font-bold text-lg text-brand-secondary">Plant Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs font-semibold text-text-dark/80">
                  {product.sku && (
                    <div className="flex justify-between border-b border-brand/10 pb-1">
                      <span className="text-text-dark/50 font-normal">SKU</span>
                      <span className="font-mono">{product.sku}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between border-b border-brand/10 pb-1">
                      <span className="text-text-dark/50 font-normal">Weight</span>
                      <span>{product.weight} kg</span>
                    </div>
                  )}
                  {product.mrp && (
                    <div className="flex justify-between border-b border-brand/10 pb-1">
                      <span className="text-text-dark/50 font-normal">MRP</span>
                      <span className="line-through text-text-dark/45">₹{product.mrp.toFixed(2)}</span>
                    </div>
                  )}
                  {product.shippingCharge !== null && (
                    <div className="flex justify-between border-b border-brand/10 pb-1">
                      <span className="text-text-dark/50 font-normal">Shipping</span>
                      <span>{product.shippingCharge > 0 ? `₹${product.shippingCharge.toFixed(2)}` : "Free"}</span>
                    </div>
                  )}
                  {product.plantHeight && (
                    <div className="flex justify-between border-b border-brand/10 pb-1">
                      <span className="text-text-dark/50 font-normal">Height</span>
                      <span>{product.plantHeight} inches</span>
                    </div>
                  )}
                  {product.plantAge && (
                    <div className="flex justify-between border-b border-brand/10 pb-1">
                      <span className="text-text-dark/50 font-normal">Plant Age</span>
                      <span>{product.plantAge} {product.plantAge === 1 ? "year" : "years"}</span>
                    </div>
                  )}
                  {product.plantType && (
                    <div className="flex justify-between border-b border-brand/10 pb-1">
                      <span className="text-text-dark/50 font-normal">Plant Type</span>
                      <span>{product.plantType}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-brand/10 pb-1">
                    <span className="text-text-dark/50 font-normal">Maintenance</span>
                    <span>{product.maintenance}</span>
                  </div>
                  <div className="flex justify-between border-b border-brand/10 pb-1">
                    <span className="text-text-dark/50 font-normal">Pot Option</span>
                    <span>{product.potIncluded}</span>
                  </div>
                  <div className="flex justify-between border-b border-brand/10 pb-1">
                    <span className="text-text-dark/50 font-normal">Return Policy</span>
                    <span>{product.returnable ? "Returnable" : "Non-Returnable"}</span>
                  </div>
                  <div className="flex justify-between border-b border-brand/10 pb-1">
                    <span className="text-text-dark/50 font-normal">COD Available</span>
                    <span>{product.sellWithCod ? "Yes" : "No"}</span>
                  </div>
                  {product.isSeed && (
                    <div className="flex justify-between border-b border-brand/10 pb-1">
                      <span className="text-text-dark/50 font-normal">Form</span>
                      <span>Seed</span>
                    </div>
                  )}
                  {(product.length || product.width || product.height) && (
                    <div className="flex justify-between border-b border-brand/10 pb-1 sm:col-span-2">
                      <span className="text-text-dark/50 font-normal">Package Dimensions</span>
                      <span>
                        {product.length || 0} × {product.width || 0} × {product.height || 0} cm
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Accordions for Plant Care and Delivery */}
              <ProductAccordions />
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
          <ProductReviews productId={product.id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
