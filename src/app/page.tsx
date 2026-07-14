import Navbar from "../../components/Navbar";
import CategoryBar from "../../components/CategoryBar";
import CategoriesSection from "../../components/CategoriesSection";
import BannerCarousel from "../../components/BannerCarousel";
import FeaturedProducts from "../../components/FeaturedProducts";
import PromoGrid from "../../components/PromoGrid";
import TestimonialSection from "../../components/TestimonialSection";
import Footer from "../../components/Footer";

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <CategoryBar />
      <main className="flex-1 flex flex-col">
        <CategoriesSection />
        <BannerCarousel />
        <FeaturedProducts />
        <PromoGrid />
        <TestimonialSection />
      </main>
      <Footer />
    </>
  );
}