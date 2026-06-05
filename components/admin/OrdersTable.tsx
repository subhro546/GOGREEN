"use client";

import { useState, useEffect, Fragment } from "react";
import UpdateOrderStatus from "./UpdateOrderStatus";

interface OrderItem {
  id: string;
  price: number;
  quantity: number;
  product: {
    name: string;
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-brand-hero/50 text-text-dark/60 text-sm">
              <th className="p-4 font-medium w-8"></th>
              <th className="p-4 font-medium">Order ID</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium hidden md:table-cell">Shipping Address (Click row to expand)</th>
              <th className="p-4 font-medium hidden sm:table-cell">Date</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {initialOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-text-dark/50">
                  No orders found.
                </td>
              </tr>
            ) : (
              initialOrders.map((order) => {
                const isExpanded = !!expandedOrders[order.id];
                return (
                  <Fragment key={order.id}>
                    {/* Main Row */}
                    <tr
                      key={order.id}
                      onClick={() => toggleExpand(order.id)}
                      className="hover:bg-brand-hero/30 transition-colors border-t border-brand/5 cursor-pointer"
                    >
                      <td className="p-4">
                        <span className="text-text-dark/50 hover:text-brand-secondary transition-colors">
                          {isExpanded ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-sm">{order.id.slice(-8).toUpperCase()}</td>
                      <td className="p-4">
                        <p className="font-medium text-text-dark">{order.user.name || "Guest"}</p>
                        <p className="text-xs text-text-dark/50">{order.user.email}</p>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 max-w-[300px]">
                          <p className="text-sm text-text-dark/80 truncate">
                            {order.shippingAddress || "Not provided"}
                          </p>
                          <span className="text-[10px] bg-brand-hero px-1.5 py-0.5 rounded text-brand-secondary font-medium">
                            Details
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-text-dark/80 hidden sm:table-cell">
                        {mounted ? new Date(order.createdAt).toLocaleDateString() : ""}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            order.status === "DELIVERED"
                              ? "bg-brand-secondary text-white"
                              : order.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-brand-secondary">
                        ₹{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
                      </td>
                    </tr>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <tr className="bg-brand-hero/10 border-t border-brand/5">
                        <td colSpan={8} className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                            {/* Shipping & Customer Details */}
                            <div className="space-y-4">
                              <h4 className="font-bold text-brand-secondary flex items-center gap-2 border-b border-brand/5 pb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Shipping & Customer Details
                              </h4>
                              <div className="space-y-2 text-text-dark/80 bg-white p-4 rounded-xl border border-brand/5 shadow-sm">
                                <p><strong>Name:</strong> {order.user.name || "Guest"}</p>
                                <p><strong>Email:</strong> {order.user.email}</p>
                                <div className="pt-2 border-t border-brand/5">
                                  <p><strong>Full Shipping Address:</strong></p>
                                  <p className="mt-1 bg-brand-hero/30 p-3 rounded-lg font-sans whitespace-pre-wrap leading-relaxed select-text border border-brand/5">
                                    {order.shippingAddress || "Not provided"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Payment & Items Details */}
                            <div className="space-y-4">
                              <h4 className="font-bold text-brand-secondary flex items-center gap-2 border-b border-brand/5 pb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                Order Summary & Items
                              </h4>
                              
                              <div className="bg-white p-4 rounded-xl border border-brand/5 shadow-sm space-y-4">
                                <div className="flex justify-between items-center text-xs text-text-dark/60 pb-2 border-b border-brand/5">
                                  <span>
                                    <strong>Payment Info:</strong> {order.razorpayOrderId ? `Razorpay (${order.razorpayOrderId})` : "Mock Payment / Free"}
                                  </span>
                                  <span>
                                    <strong>Date:</strong> {mounted ? new Date(order.createdAt).toLocaleString() : ""}
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-brand/5 last:border-b-0 text-text-dark/80">
                                      <div>
                                        <p className="font-medium">{item.product.name}</p>
                                        <p className="text-xs text-text-dark/50">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                                      </div>
                                      <p className="font-semibold text-brand-secondary">₹{(item.quantity * item.price).toFixed(2)}</p>
                                    </div>
                                  ))}
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-brand/5 font-bold text-text-dark">
                                  <span>Total Amount:</span>
                                  <span className="text-base text-brand-secondary">₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
