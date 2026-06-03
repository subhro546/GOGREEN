/* eslint-disable @next/next/no-img-element */
"use client";

import { useCart } from "../../context/CartContext";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [addresses, setAddresses] = useState<{ id: string; address: string }[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Load Razorpay Script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (session) {
      fetch("/api/profile/address")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setAddresses(data);
            if (data.length > 0) {
              setSelectedAddressId(data[0].id);
              setShippingAddress(data[0].address);
            }
          }
        })
        .catch((err) => console.error("Error fetching addresses", err));
    }
  }, [session]);

  if (!mounted) return null;

  const handleCheckout = async () => {
    if (!session) {
      router.push("/login?callbackUrl=/cart");
      return;
    }

    if (!shippingAddress.trim()) {
      alert("Please enter a shipping address before proceeding.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items, shippingAddress }),
      });

      const orderData = await res.json();

      if (!res.ok) {
        alert(orderData.message || "Failed to create order");
        setLoading(false);
        return;
      }

      if (orderData.isMock) {
        // Simulated mock payment API call
        const verifyRes = await fetch("/api/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_payment_id: "pay_mock_" + Math.random().toString(36).substring(2, 9),
            razorpay_order_id: orderData.id,
            razorpay_signature: "mock_signature",
            orderDbId: orderData.orderDbId,
            isMock: true,
          }),
        });

        if (verifyRes.ok) {
          clearCart();
          alert("Order placed successfully (Cash on Delivery / Mock Payment)!");
          router.push("/orders");
        } else {
          alert("Failed to place simulated order.");
        }
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: orderData.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: orderData.currency,
        name: "GOGREEN Nursery",
        description: "Plant Purchase Transaction",
        image: "https://example.com/your_logo",
        order_id: orderData.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async function (response: { razorpay_payment_id: string, razorpay_order_id: string, razorpay_signature: string }) {
          // Verify payment
          const verifyRes = await fetch("/api/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderDbId: orderData.orderDbId,
            }),
          });

          if (verifyRes.ok) {
            clearCart();
            alert("Payment successful! Your order has been placed.");
            router.push("/orders");
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: session.user?.name || "Customer",
          email: session.user?.email || "email@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#2E5C3B", // brand color
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp1 = new (window as { Razorpay?: any }).Razorpay(options);
      rzp1.on("payment.failed", function (response: { error: { description: string } }) {
        alert("Payment failed: " + response.error.description);
      });
      rzp1.open();
    } catch (error) {
      console.error("Error during checkout", error);
      alert("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 bg-brand-hero min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-brand-secondary italic mb-8">Your Cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-brand/5">
              <div className="text-6xl mb-6">🛒</div>
              <h2 className="text-2xl font-bold text-brand-secondary mb-2">Your cart is empty</h2>
              <p className="text-text-dark/60 mb-8">Looks like you haven&apos;t added any plants yet.</p>
              <Link
                href="/shop"
                className="inline-block bg-brand-secondary text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-topbar transition-colors shadow-lg hover:shadow-xl"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-brand/5"
                  >
                    <div className="w-24 h-24 bg-brand-hero rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl">🪴</span>
                      )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-xl font-bold text-text-dark mb-1">{item.name}</h3>
                      <p className="text-sm text-text-dark/50 mb-3 uppercase tracking-wider">{item.category}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 text-sm font-medium hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center border border-foreground/20 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-2 bg-brand-hero hover:bg-brand-light transition-colors"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 font-medium text-sm w-12 text-center text-text-dark">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-2 bg-brand-hero hover:bg-brand-light transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-lg font-bold text-brand-secondary min-w-[5rem] text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-brand/5 sticky top-28">
                  <h3 className="text-2xl font-bold text-brand-secondary mb-6">Order Summary</h3>
                  <div className="space-y-4 mb-6 text-text-dark/80">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-text-dark">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-medium text-text-dark text-brand">Free</span>
                    </div>
                  </div>
                  <div className="border-t border-brand/10 pt-6 mb-6">
                    <label className="block text-sm font-bold text-text-dark mb-3">
                      Shipping Address *
                    </label>
                    
                    {addresses.length > 0 ? (
                      <div className="space-y-3 mb-4">
                        {addresses.map((addr) => (
                          <label
                            key={addr.id}
                            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                              selectedAddressId === addr.id
                                ? "border-brand-secondary bg-brand-hero/20 shadow-sm"
                                : "border-text-dark/10 hover:bg-brand-hero/10"
                            }`}
                          >
                            <input
                              type="radio"
                              name="shipping_address"
                              checked={selectedAddressId === addr.id}
                              onChange={() => {
                                setSelectedAddressId(addr.id);
                                setShippingAddress(addr.address);
                              }}
                              className="mt-1 text-brand-secondary focus:ring-brand-secondary w-4 h-4 cursor-pointer"
                            />
                            <span className="text-sm font-medium text-text-dark whitespace-pre-wrap">{addr.address}</span>
                          </label>
                        ))}
                        <label
                          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                            selectedAddressId === "custom"
                              ? "border-brand-secondary bg-brand-hero/20 shadow-sm"
                              : "border-text-dark/10 hover:bg-brand-hero/10"
                          }`}
                        >
                          <input
                            type="radio"
                            name="shipping_address"
                            checked={selectedAddressId === "custom"}
                            onChange={() => {
                              setSelectedAddressId("custom");
                              setShippingAddress("");
                            }}
                            className="mt-1 text-brand-secondary focus:ring-brand-secondary w-4 h-4 cursor-pointer"
                          />
                          <span className="text-sm font-medium text-text-dark">Deliver to a different address</span>
                        </label>
                      </div>
                    ) : null}

                    {(addresses.length === 0 || selectedAddressId === "custom") && (
                      <textarea
                        required
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Enter full shipping address..."
                        className="w-full px-4 py-3 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary resize-none"
                        rows={3}
                      />
                    )}
                  </div>

                  <div className="border-t border-brand/10 pt-6 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-text-dark">Total</span>
                      <span className="text-2xl font-bold text-brand-secondary">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full bg-brand-secondary text-white py-4 rounded-xl font-bold hover:bg-brand-topbar transition-colors shadow-lg hover:shadow-xl flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : "Proceed to Checkout"}
                    {!loading && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
