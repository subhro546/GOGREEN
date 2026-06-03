import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="text-white pt-16 pb-8" style={{ background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 60%, #1a3a1f 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-serif font-bold text-white flex items-center gap-2">
              <img src="/logo.png" alt="GoGreen Nursery Logo" className="h-8 w-8 object-contain brightness-0 invert" />
              <span>GoGreen Nursery</span>
            </Link>
            <p className="text-brand-light/80 text-sm leading-relaxed max-w-xs">
              Bringing nature closer to you. We provide premium, healthy plants and accessories to transform your space into a green oasis.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/shop?category=Indoor%20Plant" className="text-brand-light/80 hover:text-white transition-colors text-sm">Indoor Plants</Link></li>
              <li><Link href="/shop?category=Low%20Maintenance" className="text-brand-light/80 hover:text-white transition-colors text-sm">Low Maintenance</Link></li>
              <li><Link href="/shop?category=Air%20Purifying" className="text-brand-light/80 hover:text-white transition-colors text-sm">Air Purifying</Link></li>
              <li><Link href="/shop" className="text-brand-light/80 hover:text-white transition-colors text-sm">All Plants</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-brand-light/80 hover:text-white transition-colors text-sm">Our Story</Link></li>
              <li><Link href="/blog" className="text-brand-light/80 hover:text-white transition-colors text-sm">Green Blog</Link></li>
              <li><Link href="/faq" className="text-brand-light/80 hover:text-white transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/contact" className="text-brand-light/80 hover:text-white transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Newsletter</h3>
            <p className="text-brand-light/80 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and plant care tips.
            </p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-light/50 transition-all text-sm"
              />
              <button 
                type="submit" 
                className="bg-brand text-white font-medium px-4 py-2 rounded-md hover:bg-brand/90 transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-brand-light/60 text-sm">
            &copy; {new Date().getFullYear()} GOGREEN Nursery. All rights reserved.
          </p>
          <div className="flex space-x-6 text-brand-light/60">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
