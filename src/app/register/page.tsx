"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setError("Address is required");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, address }),
      });

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center pt-24 pb-12 bg-brand-hero min-h-screen">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-brand/5">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-brand-secondary italic">Create Account</h1>
            <p className="text-text-dark/60 mt-2">Join GOGREEN Nursery today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-text-dark/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-text-dark/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border border-text-dark/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Shipping Address</label>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your initial shipping address..."
                className="w-full px-4 py-2 border border-text-dark/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all resize-none text-sm"
                rows={3}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-secondary text-white rounded-lg font-semibold hover:bg-brand-topbar transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-text-dark/60">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-topbar font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
