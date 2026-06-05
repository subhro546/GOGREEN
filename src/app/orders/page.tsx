import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/authOptions";
import { prisma } from "../../lib/prisma";
import { redirect } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Link from "next/link";

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
        include: { product: { select: { name: true, price: true } } },
      },
    },
  });

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
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
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-text-dark/50 font-medium">ORDER ID</p>
                        <p className="font-mono text-sm font-bold text-text-dark">{order.id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-dark/50 font-medium">PLACED ON</p>
                        <p className="text-sm font-medium text-text-dark">
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
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-brand-hero rounded-xl flex items-center justify-center text-2xl shrink-0">
                          🪴
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-text-dark">{item.product.name}</p>
                          <p className="text-sm text-text-dark/50">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-brand-secondary">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
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
