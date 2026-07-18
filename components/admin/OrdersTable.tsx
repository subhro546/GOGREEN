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
  discount: number;
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

  const printReceipt = (order: Order) => {
    const isCod = order.razorpayOrderId?.startsWith("cod_");
    const orderIdShort = order.id.slice(-8).toUpperCase();
    
    // Extract phone & address lines
    const addressLines = order.shippingAddress ? order.shippingAddress.split("\n").map(l => l.trim()).filter(Boolean) : [];
    const customerName = addressLines[0] || order.user.name || "Guest";
    const addressBody = addressLines.slice(1).join("\n");

    const formatDate = (dateInput: Date | string) => {
      const date = new Date(dateInput);
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      const year = date.getFullYear();
      return `${day} ${month}, ${year}`;
    };

    // Calculate totals
    let subtotal = 0;
    order.items.forEach(item => {
      subtotal += item.price * item.quantity;
    });
    
    const codFee = isCod ? 49 : 0;
    const shippingCharges = Math.max(0, order.totalAmount + (order.discount || 0) - subtotal - codFee);

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print receipts");
      return;
    }

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border: 1px solid #ccc; text-align: left; vertical-align: top;">
          <strong>${item.product.name}</strong><br>
          <span style="font-size: 10px; color: #666; font-weight: bold; margin-top: 5px; display: block; font-family: monospace;">HSN: 06029090</span>
          <span style="font-size: 10px; color: #666; font-weight: bold; display: block; font-family: monospace;">SAC: 06029090</span>
        </td>
        <td style="padding: 10px; border: 1px solid #ccc; text-align: right; vertical-align: top;">₹${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border: 1px solid #ccc; text-align: center; vertical-align: top;">${item.quantity}</td>
        <td style="padding: 10px; border: 1px solid #ccc; text-align: right; vertical-align: top;">₹${(item.price * item.quantity).toFixed(2)}</td>
        <td style="padding: 10px; border: 1px solid #ccc; text-align: center; vertical-align: top;">IGST</td>
        <td style="padding: 10px; border: 1px solid #ccc; text-align: center; vertical-align: top;">0%</td>
        <td style="padding: 10px; border: 1px solid #ccc; text-align: right; vertical-align: top;">₹0.00</td>
        <td style="padding: 10px; border: 1px solid #ccc; text-align: right; vertical-align: top; font-weight: bold;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Tax_Invoice_Order_${orderIdShort}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #000;
              margin: 0;
              padding: 40px;
              font-size: 12px;
              line-height: 1.4;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: #fff;
            }
            .title-header {
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              border-bottom: 2px solid #000;
              padding-bottom: 8px;
              margin-bottom: 25px;
              letter-spacing: 0.5px;
            }
            .header-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 25px;
            }
            .header-table td {
              vertical-align: middle;
              border: none;
              padding: 0;
            }
            .logo-text {
              font-size: 26px;
              font-weight: bold;
              color: #1b4332;
              font-family: Georgia, serif;
            }
            .invoice-details {
              text-align: right;
              font-size: 13px;
            }
            .invoice-details table {
              float: right;
              border-collapse: collapse;
            }
            .invoice-details td {
              padding: 3px 0;
              text-align: right;
            }
            .invoice-details td.label {
              font-weight: bold;
              padding-right: 10px;
            }
            .address-section {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              border-top: 1px solid #ccc;
              border-bottom: 1px solid #ccc;
            }
            .address-col {
              width: 33.33%;
              padding: 15px 10px;
              vertical-align: top;
              box-sizing: border-box;
            }
            .address-title {
              font-weight: bold;
              font-size: 11px;
              color: #444;
              text-transform: uppercase;
              margin-bottom: 8px;
              letter-spacing: 0.5px;
            }
            .address-body {
              font-size: 12px;
              line-height: 1.4;
              white-space: pre-wrap;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .items-table th {
              background: #fafafa;
              font-weight: bold;
              text-align: center;
              border: 1px solid #ccc;
              padding: 10px;
              font-size: 12px;
            }
            .items-table td {
              border: 1px solid #ccc;
              padding: 10px;
              font-size: 12px;
            }
            .summary-container {
              width: 100%;
              margin-top: 15px;
            }
            .summary-table {
              width: 320px;
              float: right;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .summary-table td {
              padding: 8px 12px;
              border: 1px solid #ccc;
              font-size: 12px;
            }
            .summary-table td.label {
              text-align: right;
              font-weight: 500;
            }
            .summary-table td.value {
              text-align: right;
              font-weight: bold;
              width: 110px;
            }
            .summary-table tr.total-row td {
              background: #fafafa;
              font-size: 14px;
              font-weight: bold;
            }
            @media print {
              body {
                padding: 0;
              }
              .invoice-container {
                max-width: 100%;
              }
              @page {
                margin: 1.5cm;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="title-header">Tax Invoice</div>
            
            <table class="header-table">
              <tr>
                <td>
                  <div class="logo-text">
                    <span style="font-size: 28px;">🌿</span> GoGreen Nursery
                  </div>
                </td>
                <td style="text-align: right;">
                  <div class="invoice-details">
                    <table>
                      <tr>
                        <td class="label">Invoice Number:</td>
                        <td>GG-${orderIdShort}-INV</td>
                      </tr>
                      <tr>
                        <td class="label">Order Number:</td>
                        <td>${orderIdShort}</td>
                      </tr>
                      <tr>
                        <td class="label">Order Date:</td>
                        <td>${formatDate(order.createdAt)}</td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </table>

            <table class="address-section">
              <tr>
                <td class="address-col" style="border-right: 1px solid #eee;">
                  <div class="address-title">Sold By</div>
                  <div class="address-body"><strong>Shankar kumar Das</strong>
3 kalinagar link road
Kolkata - 700066
West Bengal | IN
<strong>GSTIN: 19AFBPD8393K1Z1</strong></div>
                </td>
                <td class="address-col" style="border-right: 1px solid #eee;">
                  <div class="address-title">Billing Address</div>
                  <div class="address-body"><strong>${customerName}</strong>
${addressBody}</div>
                </td>
                <td class="address-col">
                  <div class="address-title">Shipping Address</div>
                  <div class="address-body"><strong>${customerName}</strong>
${addressBody}</div>
                </td>
              </tr>
            </table>

            <table class="items-table">
              <thead>
                <tr>
                  <th rowspan="2" style="text-align: left; vertical-align: middle;">Product</th>
                  <th rowspan="2" style="text-align: right; vertical-align: middle; width: 80px;">Unit Price</th>
                  <th rowspan="2" style="text-align: center; vertical-align: middle; width: 40px;">Qty</th>
                  <th rowspan="2" style="text-align: right; vertical-align: middle; width: 95px;">Taxable Amount</th>
                  <th colspan="3" style="text-align: center; border-bottom: 1px solid #ccc; padding: 5px;">Tax</th>
                  <th rowspan="2" style="text-align: right; vertical-align: middle; width: 95px;">Total</th>
                </tr>
                <tr>
                  <th style="width: 50px; font-size: 11px; padding: 5px;">Name</th>
                  <th style="width: 45px; font-size: 11px; padding: 5px;">Rate</th>
                  <th style="width: 60px; font-size: 11px; padding: 5px;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="summary-container">
              <table class="summary-table">
                <tr>
                  <td class="label">Sub Total:</td>
                  <td class="value">₹${subtotal.toFixed(2)}</td>
                </tr>
                ${order.discount > 0 ? `
                <tr>
                  <td class="label">Coupon Discount:</td>
                  <td class="value">- ₹${order.discount.toFixed(2)}</td>
                </tr>
                ` : ""}
                ${shippingCharges > 0 ? `
                <tr>
                  <td class="label">Shipping Charges:</td>
                  <td class="value">₹${shippingCharges.toFixed(2)}</td>
                </tr>
                ` : ""}
                ${codFee > 0 ? `
                <tr>
                  <td class="label">Cash on Delivery Fee:</td>
                  <td class="value">₹${codFee.toFixed(2)}</td>
                </tr>
                ` : ""}
                <tr class="total-row">
                  <td class="label">Total:</td>
                  <td class="value">₹${order.totalAmount.toFixed(2)}</td>
                </tr>
              </table>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
                      <div className="pt-3 border-t border-brand/10 flex justify-end">
                        <button
                          type="button"
                          onClick={() => printReceipt(order)}
                          className="bg-brand-secondary hover:bg-brand-topbar text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow active:scale-95 duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                          Print Invoice Receipt
                        </button>
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
