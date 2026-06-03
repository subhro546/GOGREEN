import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-hero min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-16 border border-brand/10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-secondary text-center mb-8 italic">
              Our Story
            </h1>
            
            <div className="space-y-6 text-text-dark text-lg leading-relaxed font-sans">
              <p>
                Welcome to <strong>Green Nursery</strong>, your number one source for all things green. 
                We&apos;re dedicated to providing you the very best of indoor and outdoor plants, 
                with an emphasis on quality, variety, and sustainability.
              </p>
              
              <p>
                Founded with a passion for bringing nature into urban spaces, Green Nursery has come a long way 
                from its beginnings. When we first started out, our passion for eco-friendly living drove us to start 
                our own business.
              </p>
              
              <p>
                We hope you enjoy our products as much as we enjoy offering them to you. 
                If you have any questions or comments, please don&apos;t hesitate to contact us.
              </p>
              
              <div className="pt-8 text-center">
                <p className="font-serif italic text-2xl text-brand-topbar">
                  Sincerely,
                </p>
                <p className="font-bold mt-2 text-brand-secondary">
                  The Green Nursery Team
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
