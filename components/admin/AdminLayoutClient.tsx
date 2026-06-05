"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/admin/dashboard", label: "📊 Dashboard" },
    { href: "/admin/categories", label: "🗂️ Categories" },
    { href: "/admin/products", label: "🪴 Products" },
    { href: "/admin/orders", label: "📦 Orders" },
  ];

  const sidebarContent = (
    <>
      <div className="h-20 flex items-center justify-between px-6 border-b border-brand/5">
        <Link href="/" className="text-xl font-serif font-bold text-brand-dark flex items-center gap-2">
          <img src="/logo.png" alt="GoGreen Logo" className="h-8 w-8 object-contain" />
          <span>GoGreen Admin</span>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(false)} 
          className="p-2 text-text-dark/60 hover:text-brand-secondary lg:hidden"
          aria-label="Close sidebar"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href}
              href={link.href} 
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive 
                  ? "text-white bg-brand-secondary shadow-md scale-[1.02]" 
                  : "text-text-dark/80 hover:text-brand-secondary hover:bg-brand-hero"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-brand/5">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-4 py-3 text-text-dark/80 hover:text-brand-secondary hover:bg-brand-hero rounded-xl font-medium transition-colors"
        >
          🏠 Back to Store
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-brand-hero overflow-hidden relative">
      {/* Desktop Sidebar (Permanent) */}
      <aside className="w-64 bg-white border-r border-brand/5 flex flex-col shadow-lg hidden lg:flex shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Drawer Overlay) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          
          {/* Drawer container */}
          <aside className="relative flex flex-col w-64 max-w-xs bg-white h-full shadow-2xl z-50 border-r border-brand/5 transition-transform duration-300 transform translate-x-0">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-brand/5 flex items-center justify-between px-6 lg:hidden shrink-0 shadow-sm z-30">
          <Link href="/" className="text-lg font-serif font-bold text-brand-dark flex items-center gap-2">
            <img src="/logo.png" alt="GoGreen Logo" className="h-6 w-6 object-contain" />
            <span>GoGreen Admin</span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 text-text-dark/80 hover:text-brand-secondary transition-colors"
            aria-label="Open sidebar"
          >
            <FaBars className="w-6 h-6" />
          </button>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
