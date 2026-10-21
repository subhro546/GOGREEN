"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaSpinner } from "react-icons/fa";

interface AddressFormState {
  recipientName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

const initialAddressState: AddressFormState = {
  recipientName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [addressForm, setAddressForm] = useState<AddressFormState>(initialAddressState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: fieldName, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const cleanPhone = addressForm.phone.replace(/\s+/g, "").replace(/^\+91/, "").replace(/^0/, "");
    if (!/^\d{10}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!addressForm.line1.trim()) {
      setError("Please enter Address Line 1 (House / Flat / Street).");
      return;
    }

    if (!addressForm.city.trim()) {
      setError("Please enter your city.");
      return;
    }

    if (!addressForm.state.trim()) {
      setError("Please enter your state.");
      return;
    }

    const cleanPincode = addressForm.pincode.replace(/\s+/g, "");
    if (!/^\d{6}$/.test(cleanPincode)) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }

    // Build conventional address string matching cart and profile format
    const formattedAddress = [
      addressForm.recipientName.trim() || name.trim(),
      `Ph: ${cleanPhone}`,
      addressForm.line1.trim(),
      addressForm.line2.trim(),
      `${addressForm.city.trim()}${addressForm.state.trim() ? ", " + addressForm.state.trim() : ""}${cleanPincode ? " - " + cleanPincode : ""}`,
    ]
      .filter(Boolean)
      .join("\n");

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          address: formattedAddress,
        }),
      });

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center pt-28 pb-16 bg-brand-hero min-h-screen px-4 sm:px-6">
        <div className="w-full max-w-2xl p-6 sm:p-10 bg-white rounded-3xl shadow-xl border border-brand/10 transition-all">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 bg-brand-secondary/10 text-brand-secondary text-xs font-bold rounded-full uppercase tracking-wider mb-2">
              Join GoGreen
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-secondary italic">
              Create Account
            </h1>
            <p className="text-text-dark/60 mt-2 text-sm sm:text-base">
              Create your account with your delivery details to enjoy seamless plant shopping
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
              <span className="text-base font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Credentials Section */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-secondary flex items-center gap-2 pb-1 border-b border-brand/10">
                <FaUser className="text-brand-secondary" /> Account Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-dark/70 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Subhrojit Das"
                    className="w-full px-4 py-2.5 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-dark/70 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark/70 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-2.5 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <p className="text-[11px] text-text-dark/50 mt-1">
                  Must be at least 8 characters long.
                </p>
              </div>
            </div>

            {/* Shipping Address Section */}
            <div className="space-y-4 pt-2">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-brand-secondary flex items-center gap-2 pb-1 border-b border-brand/10">
                  <FaMapMarkerAlt className="text-brand-secondary" /> Conventional Shipping Address
                </h2>
                <p className="text-xs text-text-dark/50 mt-1">
                  This will be saved as your primary delivery address for orders.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-dark/70 mb-1">
                    Recipient Full Name <span className="text-text-dark/40 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={addressForm.recipientName}
                    onChange={handleAddressChange}
                    placeholder="Leave blank to use Account Name"
                    className="w-full px-4 py-2.5 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-dark/70 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleAddressChange}
                    placeholder="10-digit mobile (e.g. 9876543210)"
                    className="w-full px-4 py-2.5 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark/70 mb-1">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="line1"
                  value={addressForm.line1}
                  onChange={handleAddressChange}
                  placeholder="House / Flat / Building no., Street name"
                  className="w-full px-4 py-2.5 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark/70 mb-1">
                  Address Line 2 <span className="text-text-dark/40 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="line2"
                  value={addressForm.line2}
                  onChange={handleAddressChange}
                  placeholder="Apartment, suite, area, landmark (optional)"
                  className="w-full px-4 py-2.5 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-dark/70 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    placeholder="e.g. Kolkata"
                    className="w-full px-4 py-2.5 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-dark/70 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressChange}
                    placeholder="e.g. West Bengal"
                    className="w-full px-4 py-2.5 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-dark/70 mb-1">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="pincode"
                    value={addressForm.pincode}
                    onChange={handleAddressChange}
                    placeholder="e.g. 700066"
                    className="w-full px-4 py-2.5 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-secondary text-white rounded-xl font-bold hover:bg-brand-topbar transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Creating your account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-text-dark/60">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-secondary font-bold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
