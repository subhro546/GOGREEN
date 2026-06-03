"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaWhatsapp,
  FaMapMarkerAlt, 
  FaTruck, 
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa';

const TopBar = () => {
  const { data: session } = useSession();

  return (
    <div className="bg-brand-topbar text-white text-xs py-2 px-4 sm:px-6 lg:px-8 hidden lg:block relative z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <a href="https://www.facebook.com/greenshankar2020" target="_blank" rel="noopener noreferrer" className="hover:text-brand-light transition-colors" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://www.instagram.com/nursery.gogreen/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-light transition-colors" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://wa.me/917980028176" target="_blank" rel="noopener noreferrer" className="hover:text-brand-light transition-colors" aria-label="WhatsApp"><FaWhatsapp /></a>
          </div>
          <div className="flex items-center space-x-4 border-l border-white/20 pl-4">
            <a href="tel:+917596811595" className="hover:text-brand-light transition-colors">+91 7596811595</a>
            <a href="mailto:gogreen.nursery20@gmail.com" className="border-l border-white/20 pl-4 hover:text-brand-light transition-colors">gogreen.nursery20@gmail.com</a>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          <a 
            href="https://www.google.com/maps/search/?api=1&query=Go+Green+Nursery+Kolkata+Maheshtala"
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center space-x-1 hover:text-brand-light transition-colors"
          >
            <FaMapMarkerAlt />
            <span>Kolkata</span>
          </a>
          <Link href="/orders" className="flex items-center space-x-1 border-l border-white/20 pl-4 hover:text-brand-light transition-colors">
            <FaTruck />
            <span>Track Order</span>
          </Link>
          
          {session ? (
            <div className="relative group border-l border-white/20 pl-4">
              <button className="flex items-center space-x-1 hover:text-brand-light transition-colors">
                <FaUser />
                <span>{session.user?.name?.split(' ')[0] || 'My Account'}</span>
              </button>
              
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-brand/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden text-text-dark text-sm z-50">
                {session.user?.role === 'ADMIN' && (
                  <Link href="/admin/dashboard" className="px-4 py-3 font-semibold text-brand-topbar hover:bg-brand-hero transition-colors">
                    Admin Dashboard
                  </Link>
                )}
                <Link href="/profile" className="px-4 py-3 hover:bg-brand-hero transition-colors">
                  My Profile
                </Link>
                <Link href="/orders" className="px-4 py-3 hover:bg-brand-hero transition-colors">
                  Order History
                </Link>
                <button 
                  onClick={async () => {
                    await signOut({ redirect: false });
                    window.location.href = '/';
                  }} 
                  className="px-4 py-3 text-red-600 hover:bg-red-50 text-left transition-colors flex items-center space-x-2 w-full"
                >
                  <FaSignOutAlt />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="flex items-center space-x-1 border-l border-white/20 pl-4 hover:text-brand-light transition-colors">
              <FaUser />
              <span>Log In / Sign Up</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
