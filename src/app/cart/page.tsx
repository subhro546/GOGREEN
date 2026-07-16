/* eslint-disable @next/next/no-img-element */
"use client";

import { useCart } from "../../context/CartContext";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const COD_THRESHOLD = 1000;

interface AddressForm {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

const emptyForm: AddressForm = {
  fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "",
};

function buildAddressString(f: AddressForm): string {
  return [
    f.fullName,
    f.phone ? `Ph: ${f.phone}` : "",
    f.line1,
    f.line2,
    `${f.city}${f.state ? ", " + f.state : ""}${f.pincode ? " - " + f.pincode : ""}`,
  ].filter(Boolean).join("\n");
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<{ id: string; address: string }[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [addressForm, setAddressForm] = useState<AddressForm>(emptyForm);
  const [paymentMethod, setPaymentMethod] = useState<"prepaid" | "cod">("prepaid");
  const { data: session } = useSession();
  const router = useRouter();

  const isCODEligible = totalPrice < COD_THRESHOLD;
  const isNewAddress = selectedAddressId === "new" || savedAddresses.length === 0;

  // Build the final shipping address string
  const shippingAddress = isNewAddress
    ? buildAddressString(addressForm)
    : savedAddresses.find((a) => a.id === selectedAddressId)?.address ?? "";

  useEffect(() => {
    setMounted(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isCODEligible) setPaymentMethod("prepaid");
  }, [isCODEligible]);

  useEffect(() => {
    if (session) {
      fetch("/api/profile/address")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setSavedAddresses(data);
            setSelectedAddressId(data[0].id);
          } else {
            setSelectedAddressId("new");
          }
        })
        .catch(() => setSelectedAddressId("new"));
    } else {
      setSelectedAddressId("new");
    }
  }, [session]);

  if (!mounted) return null;

  const field = (
    key: keyof AddressForm,
    label: string,
    placeholder: string,
    required = false,
    type = "text",
    half = false
  ) => (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label className="block text-xs font-bold text-text-dark/70 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={addressForm[key]}
        onChange={(e) => setAddressForm((prev) => ({ ...prev, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white transition-all"
      />
    </div>
  );

  const handleCheckout = async () => {
    if (!session) { router.push("/login?callbackUrl=/cart"); return; }

    // Validate address form if using new address
    if (isNewAddress) {
      const { fullName, phone, line1, city, state, pincode } = addressForm;
      if (!fullName || !phone || !line1 || !city || !state || !pincode) {
        alert("Please fill in all required address fields.");
        return;
      }
      if (!/^\d{10}$/.test(phone)) { alert("Please enter a valid 10-digit phone number."); return; }
      if (!/^\d{6}$/.test(pincode)) { alert("Please enter a valid 6-digit pincode."); return; }
    }

    if (!shippingAddress.trim()) { alert("Please provide a shipping address."); return; }

    setLoading(true);
    try {
      if (paymentMethod === "cod") {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, shippingAddress, paymentMethod: "cod" }),
        });
        const data = await res.json();
        if (!res.ok) { alert(data.message || "Failed to create order"); setLoading(false); return; }
        const verifyRes = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ razorpay_payment_id: "cod_" + Date.now(), razorpay_order_id: data.id, razorpay_signature: "cod", orderDbId: data.orderDbId, isMock: true }),
        });
        if (verifyRes.ok) { clearCart(); alert("Order placed! You will pay ₹" + (totalPrice + 49).toFixed(2) + " on delivery (includes ₹49 COD fee)."); router.push("/orders"); }
        else alert("Failed to place order. Please try again.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, shippingAddress, paymentMethod: "prepaid" }),
      });
      const orderData = await res.json();
      if (!res.ok) { alert(orderData.message || "Failed to create order"); setLoading(false); return; }

      if (orderData.isMock) {
        const verifyRes = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ razorpay_payment_id: "pay_mock_" + Math.random().toString(36).substring(2, 9), razorpay_order_id: orderData.id, razorpay_signature: "mock_signature", orderDbId: orderData.orderDbId, isMock: true }),
        });
        if (verifyRes.ok) { clearCart(); alert("Order placed successfully!"); router.push("/orders"); }
        else alert("Failed to place order.");
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "GoGreen Nursery",
        description: "Plant Purchase",
        order_id: orderData.id,
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch("/api/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...response, orderDbId: orderData.orderDbId }) });
          if (verifyRes.ok) { clearCart(); alert("Payment successful! Order placed."); router.push("/orders"); }
          else alert("Payment verification failed.");
        },
        prefill: { name: session.user?.name || "Customer", email: session.user?.email || "", contact: addressForm.phone || "9999999999" },
        theme: { color: "#2e7d32" },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp1 = new (window as { Razorpay?: any }).Razorpay(options);
      rzp1.on("payment.failed", (r: { error: { description: string } }) => alert("Payment failed: " + r.error.description));
      rzp1.open();
    } catch (error) {
      console.error("Checkout error", error);
      alert("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-brand-secondary italic mb-8">Your Cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-brand/5">
              <div className="text-6xl mb-6">🛒</div>
              <h2 className="text-2xl font-bold text-brand-secondary mb-2">Your cart is empty</h2>
              <p className="text-text-dark/60 mb-8">Looks like you haven&apos;t added any plants yet.</p>
              <Link href="/shop" className="inline-block bg-brand-secondary text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-topbar transition-colors shadow-lg">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

              {/* ── Cart Items ── */}
              <div className="lg:col-span-2 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-white p-3 sm:p-5 rounded-2xl shadow-sm border border-brand/5">
                    {/* Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-hero rounded-xl overflow-hidden shrink-0">
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        : <span className="flex h-full items-center justify-center text-2xl">🪴</span>}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-text-dark truncate">{item.name}</h3>
                      <p className="text-[10px] text-text-dark/50 uppercase tracking-wider mb-1">{item.category}</p>
                      <p className="text-sm font-bold text-brand-secondary">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    {/* Quantity + Remove */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center border border-text-dark/15 rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2.5 py-1.5 bg-brand-hero hover:bg-brand-light transition-colors text-sm font-bold">-</button>
                        <span className="px-2.5 py-1.5 text-sm font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1.5 bg-brand-hero hover:bg-brand-light transition-colors text-sm font-bold">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-red-400 text-xs font-semibold hover:underline">Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Order Summary Panel ── */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-brand/5 sticky top-28 space-y-6">
                  <h3 className="text-xl font-bold text-brand-secondary">Order Summary</h3>

                  {/* Price breakdown */}
                  <div className="space-y-2 text-sm text-text-dark/80">
                    <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold text-text-dark">₹{totalPrice.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Shipping</span><span className="font-semibold text-green-600">Free</span></div>
                  </div>

                  {/* ── Shipping Address ── */}
                  <div className="border-t border-brand/10 pt-5">
                    <p className="text-sm font-bold text-text-dark mb-3">Shipping Address</p>

                    {/* Saved addresses */}
                    {savedAddresses.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {savedAddresses.map((addr) => (
                          <label key={addr.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all text-sm ${selectedAddressId === addr.id ? "border-brand-secondary bg-brand-hero/20" : "border-text-dark/10 hover:bg-brand-hero/10"}`}>
                            <input type="radio" name="addr" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="mt-0.5 w-4 h-4 cursor-pointer shrink-0" />
                            <span className="text-text-dark/80 whitespace-pre-wrap leading-snug">{addr.address}</span>
                          </label>
                        ))}
                        <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all text-sm ${selectedAddressId === "new" ? "border-brand-secondary bg-brand-hero/20" : "border-text-dark/10 hover:bg-brand-hero/10"}`}>
                          <input type="radio" name="addr" checked={selectedAddressId === "new"} onChange={() => setSelectedAddressId("new")} className="w-4 h-4 cursor-pointer" />
                          <span className="font-semibold text-text-dark">+ Deliver to a new address</span>
                        </label>
                      </div>
                    )}

                    {/* Address form */}
                    {isNewAddress && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {field("fullName", "Full Name", "Subhrojit Das", true, "text", false)}
                        {field("phone", "Phone Number", "9876543210", true, "tel", false)}
                        {field("line1", "Address Line 1", "House / Flat / Building no.", true, "text", false)}
                        {field("line2", "Address Line 2", "Street, Area, Landmark (optional)", false, "text", false)}
                        {field("city", "City", "Kolkata", true, "text", true)}
                        {field("state", "State", "West Bengal", true, "text", true)}
                        {field("pincode", "Pincode", "700066", true, "text", true)}
                      </div>
                    )}
                  </div>

                  {/* ── Payment Method ── */}
                  <div className="border-t border-brand/10 pt-5">
                    <p className="text-sm font-bold text-text-dark mb-3">Payment Method</p>
                    {isCODEligible ? (
                      <div className="space-y-2">
                        <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all text-sm ${paymentMethod === "prepaid" ? "border-brand-secondary bg-brand-hero/20" : "border-text-dark/10 hover:bg-brand-hero/10"}`}>
                          <input type="radio" name="payment" checked={paymentMethod === "prepaid"} onChange={() => setPaymentMethod("prepaid")} className="w-4 h-4" />
                          <div>
                            <p className="font-bold text-text-dark">Pay Online</p>
                            <p className="text-xs text-text-dark/50">UPI, Cards, Net Banking</p>
                          </div>
                        </label>
                        <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all text-sm ${paymentMethod === "cod" ? "border-brand-secondary bg-brand-hero/20" : "border-text-dark/10 hover:bg-brand-hero/10"}`}>
                          <input type="radio" name="payment" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="w-4 h-4" />
                          <div>
                            <p className="font-bold text-text-dark">Cash on Delivery</p>
                            <p className="text-xs text-text-dark/50">Pay ₹{(totalPrice + 49).toFixed(2)} at your door (includes ₹49.00 fee)</p>
                          </div>
                        </label>
                        <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">💡 COD available for orders under ₹{COD_THRESHOLD}</p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl border border-brand-secondary bg-brand-hero/20 text-sm">
                        <p className="font-bold text-text-dark">Pay Online (Prepaid)</p>
                        <p className="text-xs text-text-dark/50 mt-0.5">UPI, Cards, Net Banking via Razorpay</p>
                        <p className="text-xs text-text-dark/40 mt-1">COD not available for orders above ₹{COD_THRESHOLD}</p>
                      </div>
                    )}
                  </div>

                  {/* ── Total + CTA ── */}
                  <div className="border-t border-brand/10 pt-5 space-y-2">
                    <div className="flex justify-between items-center text-sm text-text-dark/70">
                      <span>Subtotal</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                    {paymentMethod === "cod" && (
                      <div className="flex justify-between items-center text-xs text-amber-700 font-bold bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100/50">
                        <span>Cash on Delivery Fee</span>
                        <span>+ ₹49.00</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-5 pt-2 border-t border-brand/5">
                      <span className="text-lg font-bold text-text-dark">Total Amount</span>
                      <span className="text-2xl font-bold text-brand-secondary">₹{(totalPrice + (paymentMethod === "cod" ? 49 : 0)).toFixed(2)}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      disabled={loading}
                      className="w-full bg-brand-secondary text-white py-4 rounded-xl font-bold hover:bg-brand-topbar transition-colors shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Processing..." : paymentMethod === "cod" ? "Place Order (COD)" : "Pay Now"}
                      {!loading && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                      )}
                    </button>
                  </div>
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
