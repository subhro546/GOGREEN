import Navbar from "../../components/Navbar";
import HeroSection from "../../components/HeroSection";
import CategoriesSection from "../../components/CategoriesSection";
import FeaturedProducts from "../../components/FeaturedProducts";
import Footer from "../../components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col">
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
      </main>
      <Footer />
    </>
  );
}