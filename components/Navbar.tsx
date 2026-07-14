"use client";

import Link from 'next/link';
import { useCart } from '../src/context/CartContext';
import { useEffect, useState, useRef } from 'react';
import { FaSearch, FaShoppingCart, FaBars, FaTimes, FaUser, FaSignOutAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';

interface MenuCategory {
  name: string;
  image: string;
  tag: string;
  subcategories: string[];
}

const Navbar = () => {
  const { totalItems } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  // Drilldown menu state
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [isMobileProductsExpanded, setIsMobileProductsExpanded] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const desktopTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch menu categories
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('/api/categories/menu');
        if (res.ok) {
          const data = await res.json();
          setMenuCategories(data);
        }
      } catch (err) {
        console.error('Error fetching menu:', err);
      }
    };
    fetchMenu();
  }, []);

  // Close desktop menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(e.target as Node) &&
        desktopTriggerRef.current &&
        !desktopTriggerRef.current.contains(e.target as Node)
      ) {
        setIsDesktopMenuOpen(false);
        setHoveredCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setExpandedMobileCategory(null);
    setIsMobileProductsExpanded(false);
  };

  const toggleMobileCategory = (catName: string) => {
    setExpandedMobileCategory(expandedMobileCategory === catName ? null : catName);
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
            
            {/* Categories Drilldown Trigger */}
            <div className="relative" ref={desktopTriggerRef}>
              <button
                onMouseEnter={() => setIsDesktopMenuOpen(true)}
                onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isDesktopMenuOpen ? 'text-brand-dark' : 'text-text-dark hover:text-brand-dark'
                }`}
              >
                PRODUCTS
                <FaChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${isDesktopMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
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

      {/* ── Desktop Drilldown Mega-Menu ── */}
      {isDesktopMenuOpen && (
        <div
          ref={desktopMenuRef}
          className="hidden lg:block absolute left-0 right-0 bg-white border-t border-gray-100 shadow-2xl z-50"
          onMouseLeave={() => {
            setIsDesktopMenuOpen(false);
            setHoveredCategory(null);
          }}
          onMouseEnter={() => setIsDesktopMenuOpen(true)}
        >
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex gap-0 min-h-[280px]">
              {/* Left: Category list */}
              <div className="w-64 border-r border-gray-100 pr-4">
                <p className="text-[10px] uppercase tracking-widest text-text-dark/40 font-bold mb-3 px-3">Shop by Category</p>
                <ul className="space-y-0.5">
                  {menuCategories.map((cat) => (
                    <li key={cat.name}>
                      <div
                        onMouseEnter={() => setHoveredCategory(cat.name)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                          hoveredCategory === cat.name
                            ? 'bg-brand-hero text-brand-secondary font-bold shadow-sm'
                            : 'text-text-dark/80 hover:bg-brand-hero/50'
                        }`}
                      >
                        <Link
                          href={`/shop?category=${encodeURIComponent(cat.name)}`}
                          onClick={() => {
                            setIsDesktopMenuOpen(false);
                            setHoveredCategory(null);
                          }}
                          className="text-sm font-medium flex-1"
                        >
                          {cat.name}
                        </Link>
                        {cat.subcategories.length > 0 && (
                          <FaChevronRight className="w-2.5 h-2.5 text-text-dark/30 shrink-0" />
                        )}
                      </div>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/shop"
                      onClick={() => {
                        setIsDesktopMenuOpen(false);
                        setHoveredCategory(null);
                      }}
                      className="flex items-center px-3 py-2.5 rounded-xl text-sm font-bold text-brand-topbar hover:bg-brand-hero/50 transition-all mt-2 border-t border-gray-100 pt-3"
                    >
                      🌿 View All Plants
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Right: Subcategory panel */}
              <div className="flex-1 pl-8">
                {hoveredCategory ? (
                  (() => {
                    const activeCat = menuCategories.find((c) => c.name === hoveredCategory);
                    if (!activeCat) return null;
                    return (
                      <div className="animate-fade-in">
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-lg font-serif font-bold text-brand-secondary italic">{activeCat.name}</h3>
                          {activeCat.tag && (
                            <span className="text-[10px] bg-brand-hero text-brand-secondary font-bold px-2.5 py-0.5 rounded-full border border-brand/10">
                              {activeCat.tag}
                            </span>
                          )}
                        </div>
                        {activeCat.subcategories.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {activeCat.subcategories.map((sub) => (
                              <Link
                                key={sub}
                                href={`/shop?category=${encodeURIComponent(activeCat.name)}&subcategory=${encodeURIComponent(sub)}`}
                                onClick={() => {
                                  setIsDesktopMenuOpen(false);
                                  setHoveredCategory(null);
                                }}
                                className="group/sub flex items-center gap-2.5 px-4 py-3 rounded-xl border border-gray-100 hover:border-brand-secondary/30 hover:bg-brand-hero/60 hover:shadow-sm transition-all duration-200"
                              >
                                <span className="w-2 h-2 rounded-full bg-brand-secondary/40 group-hover/sub:bg-brand-secondary transition-colors shrink-0" />
                                <span className="text-sm text-text-dark/80 group-hover/sub:text-brand-secondary font-medium transition-colors">
                                  {sub}
                                </span>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-text-dark/40 py-4">
                            <span className="text-2xl">🌱</span>
                            <p className="text-sm">
                              No subcategories yet.{' '}
                              <Link
                                href={`/shop?category=${encodeURIComponent(activeCat.name)}`}
                                onClick={() => {
                                  setIsDesktopMenuOpen(false);
                                  setHoveredCategory(null);
                                }}
                                className="text-brand-secondary font-bold hover:underline"
                              >
                                Browse all {activeCat.name}
                              </Link>
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-text-dark/30 py-12">
                    <span className="text-4xl mb-3">🌿</span>
                    <p className="text-sm font-medium">Hover a category to explore subcategories</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 shadow-inner max-h-[85vh] overflow-y-auto">
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
          <div className="flex flex-col space-y-1 font-medium text-text-dark">
            <Link href="/" onClick={closeMobileMenu} className="hover:text-brand-dark px-2 py-2 rounded-lg hover:bg-brand-hero/30 transition-colors">HOME</Link>
            
            {/* Mobile Categories Accordion */}
            <div className="rounded-xl overflow-hidden">
              <button
                onClick={() => setIsMobileProductsExpanded(!isMobileProductsExpanded)}
                className={`w-full flex items-center justify-between px-2 py-2 rounded-lg transition-colors ${
                  isMobileProductsExpanded ? 'bg-brand-hero/50 text-brand-dark' : 'hover:bg-brand-hero/30 hover:text-brand-dark'
                }`}
              >
                <span>PRODUCTS</span>
                <FaChevronDown className={`w-3 h-3 transition-transform duration-300 ${isMobileProductsExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isMobileProductsExpanded && (
                <div className="pl-2 pr-1 py-2 space-y-1 animate-slide-down">
                  {menuCategories.map((cat) => (
                    <div key={cat.name} className="rounded-lg overflow-hidden">
                      {cat.subcategories.length > 0 ? (
                        <>
                          <button
                            onClick={() => toggleMobileCategory(cat.name)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                              expandedMobileCategory === cat.name
                                ? 'bg-brand-hero text-brand-secondary font-bold'
                                : 'text-text-dark/70 hover:bg-brand-hero/40'
                            }`}
                          >
                            <span>{cat.name}</span>
                            <FaChevronRight className={`w-2.5 h-2.5 transition-transform duration-200 ${
                              expandedMobileCategory === cat.name ? 'rotate-90' : ''
                            }`} />
                          </button>
                          {expandedMobileCategory === cat.name && (
                            <div className="pl-4 py-1.5 space-y-0.5 animate-slide-down">
                              <Link
                                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                onClick={closeMobileMenu}
                                className="block px-3 py-1.5 text-xs font-bold text-brand-topbar hover:bg-brand-hero/40 rounded-lg transition-colors"
                              >
                                All {cat.name} →
                              </Link>
                              {cat.subcategories.map((sub) => (
                                <Link
                                  key={sub}
                                  href={`/shop?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub)}`}
                                  onClick={closeMobileMenu}
                                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-dark/60 hover:text-brand-secondary hover:bg-brand-hero/40 rounded-lg transition-colors"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary/30 shrink-0" />
                                  {sub}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={`/shop?category=${encodeURIComponent(cat.name)}`}
                          onClick={closeMobileMenu}
                          className="block px-3 py-2 rounded-lg text-sm text-text-dark/70 hover:bg-brand-hero/40 hover:text-brand-secondary transition-colors"
                        >
                          {cat.name}
                        </Link>
                      )}
                    </div>
                  ))}
                  <Link
                    href="/shop"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-lg text-sm font-bold text-brand-topbar hover:bg-brand-hero/40 transition-colors border-t border-gray-100 mt-1 pt-2"
                  >
                    🌿 View All Plants
                  </Link>
                </div>
              )}
            </div>

            <Link href="/more" onClick={closeMobileMenu} className="hover:text-brand-dark px-2 py-2 rounded-lg hover:bg-brand-hero/30 transition-colors">SERVICES</Link>
            <Link href="/about" onClick={closeMobileMenu} className="hover:text-brand-dark px-2 py-2 rounded-lg hover:bg-brand-hero/30 transition-colors">ABOUT US</Link>
            <Link href="/more" onClick={closeMobileMenu} className="hover:text-brand-dark px-2 py-2 rounded-lg hover:bg-brand-hero/30 transition-colors">MORE</Link>
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