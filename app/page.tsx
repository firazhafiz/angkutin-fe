import Footer from "@/components/landing/Footer";
import CtaBanner from "@/components/landing/Conclusion";
import Testimoni from "@/components/landing/Testimoni";
import About from "@/components/landing/About";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/Hero";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen w-full mx-auto bg-white">
      <Navbar />
      <HeroSection />
      <About />
      <Testimoni />
      <CtaBanner />
      <Footer />
    </div>
  );
}
