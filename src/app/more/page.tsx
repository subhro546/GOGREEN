import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Link from "next/link";
import { FaLeaf, FaSeedling, FaTruck } from "react-icons/fa";

export default function MorePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-secondary italic mb-4">
              More Services
            </h1>
            <p className="text-text-dark text-lg max-w-2xl mx-auto">
              Beyond just selling plants, we offer a range of services to help you build and maintain your green spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-brand-hero p-8 rounded-3xl border border-brand/10 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-brand-topbar text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-lg">
                <FaLeaf />
              </div>
              <h3 className="text-2xl font-serif font-bold text-brand-secondary mb-3">Plant Styling</h3>
              <p className="text-text-dark mb-6">
                Not sure which plants fit your space? Our experts will visit your home or office to recommend the perfect green companions.
              </p>
              <Link href="/contact" className="text-brand-topbar font-bold hover:underline">
                Book a Consultation &rarr;
              </Link>
            </div>

            {/* Service 2 */}
            <div className="bg-brand-hero p-8 rounded-3xl border border-brand/10 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-brand-topbar text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-lg">
                <FaSeedling />
              </div>
              <h3 className="text-2xl font-serif font-bold text-brand-secondary mb-3">Plant Care & Maintenance</h3>
              <p className="text-text-dark mb-6">
                Let us do the dirty work. We offer weekly or monthly maintenance plans to keep your plants healthy and thriving.
              </p>
              <Link href="/contact" className="text-brand-topbar font-bold hover:underline">
                Learn More &rarr;
              </Link>
            </div>

            {/* Service 3 */}
            <div className="bg-brand-hero p-8 rounded-3xl border border-brand/10 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-brand-topbar text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-lg">
                <FaTruck />
              </div>
              <h3 className="text-2xl font-serif font-bold text-brand-secondary mb-3">Corporate Gifting</h3>
              <p className="text-text-dark mb-6">
                Give the gift of life. We provide beautiful, customized plant gifts for your clients and employees.
              </p>
              <Link href="/contact" className="text-brand-topbar font-bold hover:underline">
                Contact Sales &rarr;
              </Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
