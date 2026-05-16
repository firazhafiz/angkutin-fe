import Footer from "@/components/landing/Footer";
import CtaBanner from "@/components/landing/Conclusion";
import Testimoni from "@/components/landing/Testimoni";
import About from "@/components/landing/About";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/Hero";
import GallerySection from "@/components/landing/Gallery";
import BlogSection from "@/components/landing/Blog";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen w-full mx-auto bg-white">
      <Navbar />
      <HeroSection />
      <About />
      <GallerySection />
      <BlogSection />
      <Testimoni />
      <CtaBanner />
      <Footer />
    </div>
  );
}
