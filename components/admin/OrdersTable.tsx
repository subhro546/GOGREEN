/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import UpdateOrderStatus from "./UpdateOrderStatus";

interface OrderItem {
  id: string;
  price: number;
  quantity: number;
  product: {
    name: string;
    description: string;
    images: string;
    sku?: string | null;
    weight?: number | null;
    plantHeight?: number | null;
    plantAge?: number | null;
    potIncluded?: string;
    isIndoor: boolean;
    mrp?: number | null;
    shippingCharge?: number | null;
    returnable: boolean;
    sellWithCod: boolean;
    plantType?: string | null;
    maintenance: string;
    length?: number | null;
    width?: number | null;
    height?: number | null;
    isSeed: boolean;
  };
}

interface Order {
  id: string;
  userId: string;
  user: {
    name: string | null;
    email: string;
  };
  totalAmount: number;
  status: string;
  shippingAddress: string;
  razorpayOrderId: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export default function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const toggleProductExpand = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid closing the parent order details card
    setExpandedProducts((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <div className="space-y-6">
      {initialOrders.length === 0 ? (
        <div className="p-12 text-center text-text-dark/50 bg-white rounded-3xl border border-brand/5 shadow-sm">
          <span className="text-4xl mb-3 block">📦</span>
          <h3 className="text-lg font-bold text-brand-secondary">No customer orders found</h3>
          <p className="text-xs text-text-dark/40 mt-1">Orders will appear here as customers complete checkout.</p>
        </div>
      ) : (
        initialOrders.map((order) => {
          const isExpanded = !!expandedOrders[order.id];
          return (
            <div
              key={order.id}
              className={`bg-white rounded-3xl border border-brand/10 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
                isExpanded ? "ring-2 ring-brand-secondary/15" : ""
              }`}
            >
              {/* Card Header Info */}
              <div
                onClick={() => toggleExpand(order.id)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-brand-hero/20 transition-all select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="text-text-dark/50 shrink-0">
                    {isExpanded ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-secondary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-dark/40" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-mono font-bold text-sm text-text-dark">
                        ORDER: #{order.id.slice(-8).toUpperCase()}
                      </h4>
                      <span className={`px-1.5 py-0.5 text-[9px] font-black rounded ${
                        order.razorpayOrderId?.startsWith("cod_") 
                          ? "bg-amber-100 text-amber-800 border border-amber-200" 
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}>
                        {order.razorpayOrderId?.startsWith("cod_") ? "COD" : "PREPAID"}
                      </span>
                    </div>
                    <p className="text-xs text-text-dark/50 mt-0.5">
                      {mounted ? new Date(order.createdAt).toLocaleString() : ""}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between md:justify-end gap-x-6 gap-y-3">
                  {/* Customer details info */}
                  <div className="min-w-[150px]">
                    <p className="font-bold text-xs sm:text-sm text-text-dark">{order.user.name || "Guest"}</p>
                    <p className="text-[10px] sm:text-xs text-text-dark/50">{order.user.email}</p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shrink-0 ${
                      order.status === "DELIVERED"
                        ? "bg-brand-secondary text-white"
                        : order.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : order.status === "APPROVED"
                        ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>

                  {/* Total amount */}
                  <span className="font-bold text-sm sm:text-base text-brand-secondary min-w-[80px] text-right">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>

                  {/* Inline update action dropdown */}
                  <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                    <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
                  </div>
                </div>
              </div>

              {/* Vertically Stacked Order details */}
              {isExpanded && (
                <div className="p-6 bg-brand-hero/10 border-t border-brand/5 space-y-6 text-sm">
                  
                  {/* Stacked Row 1: Shipping & Customer Details */}
                  <div className="space-y-3">
                    <h5 className="font-serif font-bold text-brand-secondary text-base flex items-center gap-2 border-b border-brand/5 pb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Shipping & Customer Address details
                    </h5>
                    <div className="space-y-2 text-text-dark/80 bg-white p-4 rounded-2xl border border-brand/5 shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <p><strong>Customer Name:</strong> {order.user.name || "Guest"}</p>
                        <p><strong>Email Address:</strong> {order.user.email}</p>
                      </div>
                      <div className="pt-2 border-t border-brand/5">
                        <p className="text-xs font-bold text-text-dark/50">Full Shipping Address:</p>
                        <p className="mt-1 bg-brand-hero/30 p-3.5 rounded-xl font-sans text-xs whitespace-pre-wrap leading-relaxed select-text border border-brand/5 text-text-dark/95">
                          {order.shippingAddress || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stacked Row 2: Ordered Items List & Product Details Accordion */}
                  <div className="space-y-3">
                    <h5 className="font-serif font-bold text-brand-secondary text-base flex items-center gap-2 border-b border-brand/5 pb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      Order Items Summary (Click product row to toggle full details)
                    </h5>

                    <div className="space-y-3">
                      {order.items.map((item) => {
                        const parsedImages = (() => {
                          try {
                            const parsed = JSON.parse(item.product.images);
                            return Array.isArray(parsed) ? parsed : [];
                          } catch {
                            return [];
                          }
                        })();
                        const firstImg = parsedImages[0] || "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=500&q=80";
                        const isProductExpanded = !!expandedProducts[item.id];

                        return (
                          <div
                            key={item.id}
                            className={`border rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300 ${
                              isProductExpanded ? "ring-2 ring-brand-secondary/10 border-brand-secondary/25" : "border-brand/5"
                            }`}
                          >
                            {/* Expandable Product Header Row */}
                            <div
                              onClick={(e) => toggleProductExpand(item.id, e)}
                              className="flex gap-4 p-4 items-center cursor-pointer hover:bg-brand-hero/25 transition-all select-none"
                            >
                              {/* Product Thumbnail */}
                              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-brand/10 bg-white">
                                <img src={firstImg} alt={item.product.name} className="w-full h-full object-cover" />
                              </div>

                              {/* Simple Product Info */}
                              <div className="flex-1 min-w-0">
                                <h6 className="font-bold text-text-dark text-xs sm:text-sm truncate">{item.product.name}</h6>
                                <p className="text-[10px] text-text-dark/50 mt-1 font-mono">
                                  {item.product.sku ? `SKU: ${item.product.sku}` : "No SKU"} | {item.product.weight ? `Weight: ${item.product.weight} kg` : "No Weight"}
                                </p>
                              </div>

                              {/* Price summary details */}
                              <div className="text-right shrink-0 mr-2">
                                <p className="font-bold text-brand-secondary text-xs sm:text-sm">₹{(item.quantity * item.price).toFixed(2)}</p>
                                <p className="text-[9px] text-text-dark/45">
                                  {item.quantity} × ₹{item.price.toFixed(2)}
                                </p>
                              </div>

                              {/* Expanded Status Icon */}
                              <span className="text-text-dark/40 shrink-0">
                                {isProductExpanded ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </span>
                            </div>

                            {/* Full Product Specifications (Visible only when clicking on item) */}
                            {isProductExpanded && (
                              <div className="p-5 border-t border-brand/5 bg-brand-hero/10 space-y-4 text-xs animate-fade-in">
                                <div>
                                  <h6 className="font-bold text-text-dark mb-1">Product Description</h6>
                                  <p className="text-text-dark/70 leading-relaxed font-sans">{item.product.description}</p>
                                </div>

                                {/* Full image list */}
                                {parsedImages.length > 1 && (
                                  <div>
                                    <h6 className="font-bold text-text-dark mb-1.5">Product Images ({parsedImages.length})</h6>
                                    <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                                      {parsedImages.map((imgUrl, i) => (
                                        <div key={i} className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-brand/10 bg-white">
                                          <img src={imgUrl} alt={`Product spec thumbnail ${i}`} className="w-full h-full object-cover" />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Specifications list matching single details view */}
                                <div>
                                  <h6 className="font-bold text-text-dark mb-2">Technical Specifications</h6>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 bg-white p-4 rounded-xl border border-brand/5">
                                    <div className="flex justify-between border-b border-brand/5 pb-1">
                                      <span className="text-text-dark/50">SKU</span>
                                      <span className="font-mono font-bold text-text-dark/80">{item.product.sku || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-brand/5 pb-1">
                                      <span className="text-text-dark/50">Weight</span>
                                      <span className="font-bold text-text-dark/80">{item.product.weight ? `${item.product.weight} kg` : "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-brand/5 pb-1">
                                      <span className="text-text-dark/50">MRP</span>
                                      <span className="font-bold text-text-dark/80">
                                        {item.product.mrp !== null && item.product.mrp !== undefined ? `₹${item.product.mrp.toFixed(2)}` : "N/A"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between border-b border-brand/5 pb-1">
                                      <span className="text-text-dark/50">Shipping Charge</span>
                                      <span className="font-bold text-text-dark/80">
                                        {item.product.shippingCharge !== null && item.product.shippingCharge !== undefined ? `₹${item.product.shippingCharge.toFixed(2)}` : "N/A"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between border-b border-brand/5 pb-1">
                                      <span className="text-text-dark/50">Plant Height</span>
                                      <span className="font-bold text-text-dark/80">{item.product.plantHeight ? `${item.product.plantHeight} inches` : "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-brand/5 pb-1">
                                      <span className="text-text-dark/50">Plant Age</span>
                                      <span className="font-bold text-text-dark/80">{item.product.plantAge ? `${item.product.plantAge} years` : "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-brand/5 pb-1">
                                      <span className="text-text-dark/50">Plant Type</span>
                                      <span className="font-bold text-text-dark/80">{item.product.plantType || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-brand/5 pb-1">
                                      <span className="text-text-dark/50">Maintenance Level</span>
                                      <span className="font-bold text-text-dark/80">{item.product.maintenance}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-brand/5 pb-1">
                                      <span className="text-text-dark/50">Pot Option</span>
                                      <span className="font-bold text-text-dark/80">{item.product.potIncluded}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-brand/5 pb-1">
                                      <span className="text-text-dark/50">Return Policy</span>
                                      <span className="font-bold text-text-dark/80">{item.product.returnable ? "Returnable" : "Non-Returnable"}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-brand/5 pb-1">
                                      <span className="text-text-dark/50">COD Supported</span>
                                      <span className="font-bold text-text-dark/80">{item.product.sellWithCod ? "Yes" : "No"}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-brand/5 pb-1">
                                      <span className="text-text-dark/50">Display</span>
                                      <span className="font-bold text-text-dark/80">{item.product.isIndoor ? "Indoor" : "Outdoor"}</span>
                                    </div>
                                    {(item.product.length || item.product.width || item.product.height) && (
                                      <div className="flex justify-between border-b border-brand/5 pb-1 sm:col-span-2">
                                        <span className="text-text-dark/50">Package Dimensions</span>
                                        <span className="font-bold text-text-dark/80">
                                          {item.product.length || 0} × {item.product.width || 0} × {item.product.height || 0} cm
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Order summary calculations */}
                    <div className="mt-4 bg-white p-5 rounded-2xl border border-brand/5 shadow-sm space-y-3">
                      <div className="flex justify-between text-xs text-text-dark/60 pb-2 border-b border-brand/5">
                        <p><strong>Payment Info:</strong> {order.razorpayOrderId ? `Razorpay (${order.razorpayOrderId})` : "Mock checkout"}</p>
                        <p><strong>Date Placed:</strong> {mounted ? new Date(order.createdAt).toLocaleString() : ""}</p>
                      </div>
                      <div className="flex justify-between font-bold text-text-dark text-base pt-2">
                        <span>Total Paid Amount:</span>
                        <span className="text-brand-secondary">₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
