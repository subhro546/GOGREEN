import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/authOptions";
import { prisma } from "../../lib/prisma";
import { redirect } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/orders");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: { select: { id: true, name: true, price: true, images: true } } },
      },
    },
  });

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-indigo-100 text-indigo-700 border border-indigo-200/50",
    PAID: "bg-green-100 text-green-700",
    SHIPPED: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-brand-secondary text-white",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-16 bg-brand-hero min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-brand-secondary italic mb-8">Order History</h1>

          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-brand/5">
              <div className="text-6xl mb-6">📦</div>
              <h2 className="text-2xl font-bold text-brand-secondary mb-2">No orders yet</h2>
              <p className="text-text-dark/60 mb-8">
                You haven&apos;t placed any orders yet. Start shopping to see your orders here!
              </p>
              <Link
                href="/shop"
                className="inline-block bg-brand-secondary text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-topbar transition-colors shadow-lg"
              >
                Browse Plants
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-brand/5 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="px-6 py-4 bg-brand-hero/50 border-b border-brand/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <p className="text-xs text-text-dark/50 font-medium">ORDER ID</p>
                        <p className="font-mono text-sm font-bold text-text-dark">{order.id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-dark/50 font-medium">PAYMENT</p>
                        <span className={`inline-block mt-0.5 text-xs font-black px-2 py-0.5 rounded ${
                          order.razorpayOrderId?.startsWith("cod_") 
                            ? "bg-amber-100 text-amber-800 border border-amber-200" 
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}>
                          {order.razorpayOrderId?.startsWith("cod_") ? "COD" : "PREPAID"}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-text-dark/50 font-medium">PLACED ON</p>
                        <p className="text-sm font-semibold text-text-dark">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        statusColors[order.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 space-y-4">
                    {order.items.map((item) => {
                      const imageUrl = (() => {
                        if (!item.product?.images) return null;
                        try {
                          const parsed = JSON.parse(item.product.images);
                          if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
                            return parsed[0];
                          }
                          if (typeof parsed === "string") return parsed;
                        } catch {
                          if (typeof item.product.images === "string" && item.product.images.startsWith("http")) {
                            return item.product.images;
                          }
                        }
                        return null;
                      })();

                      return (
                        <div key={item.id} className="flex items-center gap-4">
                          <Link
                            href={`/product/${item.product?.id || item.productId}`}
                            className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-hero/40 rounded-2xl overflow-hidden shrink-0 border border-brand/10 relative flex items-center justify-center hover:opacity-90 transition-opacity"
                          >
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={item.product?.name || "Plant"}
                                fill
                                sizes="(max-width: 640px) 64px, 80px"
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <span className="text-3xl">🪴</span>
                            )}
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/product/${item.product?.id || item.productId}`}
                              className="font-bold text-text-dark hover:text-brand-secondary transition-colors line-clamp-1 block text-sm sm:text-base"
                            >
                              {item.product?.name}
                            </Link>
                            <div className="flex items-center gap-2 mt-1 text-xs text-text-dark/55 font-medium">
                              <span>Qty: {item.quantity}</span>
                              <span>•</span>
                              <span>₹{item.price.toFixed(2)} each</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-brand-secondary text-base sm:text-lg">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && order.shippingAddress !== "To be filled" && (
                    <div className="px-6 py-3 bg-brand-hero/30 border-t border-brand/5">
                      <p className="text-xs text-text-dark/50 font-medium mb-1">SHIPPING TO:</p>
                      <p className="text-sm text-text-dark/80 whitespace-pre-wrap">{order.shippingAddress}</p>
                    </div>
                  )}

                  {/* Order Footer */}
                  <div className="px-6 py-4 border-t border-brand/5 flex justify-between items-center">
                    <p className="text-sm text-text-dark/60">
                      {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </p>
                    <p className="text-xl font-bold text-brand-secondary">
                      Total: ₹{order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
