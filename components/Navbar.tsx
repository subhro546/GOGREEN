"use client";

import Link from 'next/link';
import { useCart } from '../src/context/CartContext';
import { useEffect, useState } from 'react';
import { FaSearch, FaShoppingCart, FaBars, FaTimes, FaUser, FaSignOutAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const { totalItems } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white w-full z-40 border-b border-gray-100 sticky top-0 shadow-sm">
      {/* Colourful top accent strip */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #2e7d32, #66bb6a, #f9a825, #f97316, #f43f5e)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-serif font-bold text-brand-dark flex items-center gap-2">
              <img src="/logo.png" alt="GoGreen Nursery Logo" className="h-10 w-10 object-contain" />
              <span>GoGreen Nursery</span>
            </Link>
          </div>

          {/* Navigation Menu (Desktop Only) */}
          <div className="hidden lg:flex space-x-8 items-center">
            <Link href="/" className="text-sm text-text-dark hover:text-brand-dark font-medium transition-colors">HOME</Link>
            <Link href="/#categories" className="text-sm text-text-dark hover:text-brand-dark font-medium transition-colors">CATEGORIES</Link>
            <Link href="/shop" className="text-sm text-text-dark hover:text-brand-dark font-medium transition-colors">PRODUCTS</Link>
            <Link href="/more" className="text-sm text-text-dark hover:text-brand-dark font-medium transition-colors">SERVICES</Link>
            <Link href="/about" className="text-sm text-text-dark hover:text-brand-dark font-medium transition-colors">ABOUT US</Link>
            <Link href="/more" className="text-sm text-text-dark hover:text-brand-dark font-medium transition-colors">MORE</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar (Desktop Only) */}
            <div className="relative hidden lg:block">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-4 pr-10 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-brand-topbar text-sm w-48 transition-colors"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark">
                <FaSearch />
              </button>
            </div>
            
            {/* Cart Icon */}
            <Link href="/cart" className="p-2 text-text-dark hover:text-brand-dark transition-colors relative group" aria-label="Cart">
              <FaShoppingCart className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute top-0 -right-1 bg-brand-dark text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full group-hover:scale-110 transition-transform">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-text-dark hover:text-brand-dark transition-colors lg:hidden focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 shadow-inner">
          {/* Mobile Search */}
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-brand-topbar text-sm transition-colors"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark">
              <FaSearch />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-3 font-medium text-text-dark">
            <Link href="/" onClick={closeMobileMenu} className="hover:text-brand-dark px-2 py-1.5 rounded-lg hover:bg-brand-hero/30 transition-colors">HOME</Link>
            <Link href="/#categories" onClick={closeMobileMenu} className="hover:text-brand-dark px-2 py-1.5 rounded-lg hover:bg-brand-hero/30 transition-colors">CATEGORIES</Link>
            <Link href="/shop" onClick={closeMobileMenu} className="hover:text-brand-dark px-2 py-1.5 rounded-lg hover:bg-brand-hero/30 transition-colors">PRODUCTS</Link>
            <Link href="/more" onClick={closeMobileMenu} className="hover:text-brand-dark px-2 py-1.5 rounded-lg hover:bg-brand-hero/30 transition-colors">SERVICES</Link>
            <Link href="/about" onClick={closeMobileMenu} className="hover:text-brand-dark px-2 py-1.5 rounded-lg hover:bg-brand-hero/30 transition-colors">ABOUT US</Link>
            <Link href="/more" onClick={closeMobileMenu} className="hover:text-brand-dark px-2 py-1.5 rounded-lg hover:bg-brand-hero/30 transition-colors">MORE</Link>
          </div>

          {/* User Account / Authentication Panel */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            {session ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-2 py-1 text-sm text-text-dark/60 font-semibold border-b border-gray-100 pb-2">
                  <FaUser className="w-4 h-4 text-brand-secondary" />
                  <span>Hello, {session.user?.name || 'User'}</span>
                </div>
                {session.user?.role === 'ADMIN' && (
                  <Link 
                    href="/admin/dashboard" 
                    onClick={closeMobileMenu} 
                    className="flex items-center gap-2 text-sm font-semibold text-brand-topbar px-2 py-1.5 hover:bg-brand-hero/30 rounded-lg transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link 
                  href="/profile" 
                  onClick={closeMobileMenu} 
                  className="flex items-center gap-2 text-sm text-text-dark px-2 py-1.5 hover:bg-brand-hero/30 rounded-lg transition-colors"
                >
                  My Profile
                </Link>
                <Link 
                  href="/orders" 
                  onClick={closeMobileMenu} 
                  className="flex items-center gap-2 text-sm text-text-dark px-2 py-1.5 hover:bg-brand-hero/30 rounded-lg transition-colors"
                >
                  Order History
                </Link>
                <button 
                  onClick={async () => {
                    closeMobileMenu();
                    await signOut({ redirect: false });
                    window.location.href = '/';
                  }} 
                  className="w-full text-left flex items-center gap-2 text-sm text-red-600 px-2 py-1.5 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link 
                  href="/login" 
                  onClick={closeMobileMenu} 
                  className="flex items-center justify-center gap-2 bg-brand-secondary hover:bg-brand-topbar text-white py-3 rounded-xl font-bold transition-all shadow-md text-sm"
                >
                  <FaUser />
                  <span>Log In / Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Contacts Panel */}
          <div className="border-t border-gray-100 pt-4 mt-2 space-y-2 text-xs text-text-dark/70">
            <p className="font-bold text-text-dark/50 uppercase tracking-wider text-[10px]">Contact Us</p>
            <div className="flex items-center gap-2 px-1">
              <FaPhoneAlt className="text-brand-secondary shrink-0" />
              <a href="tel:+917596811595" className="hover:underline font-semibold text-text-dark">+91 7596811595</a>
            </div>
            <div className="flex items-center gap-2 px-1">
              <FaEnvelope className="text-brand-secondary shrink-0" />
              <a href="mailto:gogreen.nursery20@gmail.com" className="hover:underline text-text-dark font-medium">gogreen.nursery20@gmail.com</a>
            </div>
            <div className="flex items-center gap-2 px-1">
              <FaWhatsapp className="text-green-500 shrink-0" />
              <a href="https://wa.me/917980028176" target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold text-text-dark">WhatsApp Support</a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;