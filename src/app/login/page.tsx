"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push(callbackUrl);
        router.refresh(); // Refresh to update auth state in UI
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-brand/5">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-brand-secondary italic">Welcome Back</h1>
        <p className="text-text-dark/60 mt-2">Log in to your GOGREEN account</p>
      </div>

      {registered && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm text-center border border-green-200">
          Registration successful! Please log in.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand-secondary text-white rounded-lg font-semibold hover:bg-brand-topbar transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-text-dark/60">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-brand-topbar font-semibold hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center pt-24 pb-12 bg-brand-hero min-h-screen">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
