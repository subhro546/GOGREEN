import { prisma } from "../../../lib/prisma";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import AddToCartButton from "../../../../components/AddToCartButton";
import ProductImageGallery from "../../../../components/ProductImageGallery";
import ProductReviews from "../../../../components/ProductReviews";
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
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-brand/5 grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Product Image Gallery Area */}
            <div>
              <ProductImageGallery images={parsedImages} productName={product.name} />
            </div>

            {/* Product Details Area */}
            <div className="flex flex-col justify-center">
              <div className="mb-2">
                <span className="text-sm font-bold tracking-widest text-brand-topbar uppercase">{product.category}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-dark mb-4">{product.name}</h1>
              <p className="text-2xl font-semibold text-brand-secondary mb-6">₹{product.price.toFixed(2)}</p>
              
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
            </div>

          </div>
          
          {/* Reviews Section */}
          <ProductReviews productId={product.id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
