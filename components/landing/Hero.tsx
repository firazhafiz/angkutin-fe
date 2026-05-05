"use client";
import Image from "next/image";
import Link from "next/link";
import { Globe, Cloud, Sun, Compass } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const middleItemRef = useRef<HTMLDivElement>(null);

  const [isCentered, setIsCentered] = useState(false);

  // Auto-scroll ke elemen tengah saat pertama kali halaman dimuat (khusus mobile)
  useEffect(() => {
    const scrollCenter = () => {
      if (middleItemRef.current && scrollContainerRef.current) {
        // Hanya scroll jika di mobile (lebar layar < 1024px)
        if (window.innerWidth < 1024) {
          middleItemRef.current.scrollIntoView({
            behavior: "auto",
            block: "nearest",
            inline: "center",
          });
        }
        // Tandai sudah selesai centering agar bisa di-reveal
        setIsCentered(true);
      }
    };

    // Gunakan requestAnimationFrame untuk memastikan layout sudah selesai di-render
    const animationFrame = requestAnimationFrame(scrollCenter);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <section id="home" className="relative pt-26 overflow-hidden bg-white">
      {/* Floating decoration icons - Dikembalikan, plus pointer-events-none agar tidak mengganggu saat swipe di layar hp */}
      <div className="hidden md:flex absolute top-22 left-5 md:top-26 md:left-16 animate-float opacity-80 pointer-events-none z-0">
        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#D9E8D0] flex items-center justify-center">
          <Sun size={24} className="text-dark" />
        </div>
      </div>
      <div
        className="hidden md:flex absolute top-90 left-10 md:top-46 md:left-34 animate-float pointer-events-none z-0"
        style={{ animationDelay: "1s" }}
      >
        <div className="md:w-14 md:h-14 w-10 h-10 rounded-full border border-dark bg-white flex items-center justify-center">
          <Cloud size={24} className="text-primary" />
        </div>
      </div>

      <div className="hidden md:flex absolute top-40 right-5 md:top-26 md:right-16 animate-float opacity-80 pointer-events-none z-0">
        <div className="md:w-14 md:h-14 w-10 h-10 rounded-full bg-soft-gray flex items-center justify-center">
          <Globe size={24} className="text-dark" />
        </div>
      </div>
      <div
        className="hidden md:flex absolute top-46 right-5 md:top-46 md:right-34 animate-float pointer-events-none z-0"
        style={{ animationDelay: "2s" }}
      >
        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-primary flex items-center justify-center">
          <Compass size={24} className="text-white" />
        </div>
      </div>

      <div className="mx-auto px-6 w-full">
        {/* Headline */}
        <div className="text-center">
          <h1 className="text-3xl md:text-7xl font-bold text-dark leading-[1.1] max-w-4xl mx-auto tracking-tight">
            Join the movement for <br /> a cleaner world
          </h1>
        </div>

        {/* CTA and Side Text */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 pt-8">
          <div className="w-full md:w-1/3 text-center md:text-left">
            <Link
              href="/auth/register"
              className="inline-flex items-center px-8 py-3 bg-[#D9E8D0] text-dark font-extrabold rounded-full hover:bg-opacity-80 transition-all duration-300 text-md"
            >
              Start Now
            </Link>
          </div>
          <div className="w-full md:w-1/3 text-center md:text-right">
            <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-[280px] mx-auto md:ml-auto md:mr-0">
              We strive to protect nature for future generations by providing
              smart solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Image Grid - Desktop presisi, Mobile Swipe Horizontal Auto-Center */}
      <div className="w-full md:pt-0 pt-8">
        <div
          ref={scrollContainerRef}
          className={`flex flex-nowrap items-center justify-start lg:justify-center gap-6 overflow-x-auto snap-x snap-mandatory px-6 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-opacity duration-300 ${isCentered ? "opacity-100" : "opacity-0 lg:opacity-100"}`}
        >
          {/* Column 1: Volunteers */}
          <div className="relative w-[240px] h-[240px] rounded-4xl overflow-hidden shadow-sm shrink-0 snap-center">
            <Image
              src="/images/hero1.jpg"
              alt="Volunteers cleaning environment"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          {/* Column 2: Stacked Overlapping Cards */}
          <div className="flex flex-col w-[220px] shrink-0 snap-center">
            <div className="rounded-4xl bg-[#EBEBEB] p-7 min-h-[160px] flex flex-col justify-center relative z-10 shadow-sm">
              <h3 className="text-sm font-bold text-center text-dark mb-2">
                Real action for a <br /> cleaner planet
              </h3>
              <p className="text-[10px] text-center text-gray-400 leading-normal font-medium">
                More than thousands of tons of waste are processed daily to
                educate society about the problems of ecology and nature.
              </p>
            </div>
            <div className="rounded-4xl bg-[#D9E8D0] pt-14 pb-7 px-7 min-h-[180px] flex flex-col justify-center -mt-10 relative z-0 shadow-sm">
              <h3 className="text-sm font-bold text-center text-dark mb-2">
                Innovative projects <br /> for reforestation
              </h3>
              <p className="text-[10px] text-center text-gray-600 leading-normal font-medium">
                We carry out many successful projects for biodiversity
                conversation through an integrated digital waste platform
              </p>
            </div>
          </div>

          {/* Column 3: Tall Bin Image with Single Masking (Tengah) - Ditambahkan ref di sini */}
          <div
            ref={middleItemRef}
            className="relative w-[280px] h-[380px] overflow-hidden rounded-4xl shrink-0 snap-center"
            style={{
              clipPath:
                "path('M 32,0 H 248 C 265.673,0 280,14.327 280,32 V 160 C 255,160 235,180 235,190 C 235,200 255,220 280,220 V 348 C 280,365.673 265.673,380 248,380 H 32 C 14.327,380 0,365.673 0,348 V 220 C 25,220 45,200 45,190 C 45,180 25,160 0,160 V 32 C 0,14.327 14.327,0 32,0 Z')",
            }}
          >
            <Image
              src="/images/hero2.jpg"
              alt="Recycling bin"
              fill
              className="object-cover scale-110"
              priority
              sizes="100vw"
            />
          </div>

          {/* Column 4: Portrait Worker */}
          <div className="relative w-[220px] min-h-[317px] rounded-4xl overflow-hidden shrink-0 snap-center">
            <Image
              src="/images/hero3.jpg"
              alt="Environmental worker"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 px-6">
              <button className="flex-1 py-3 rounded-full border border-white text-white text-[12px] font-bold hover:bg-white hover:text-dark transition-all">
                Charity
              </button>
              <button className="flex-1 py-3 rounded-full border border-white text-white text-[12px] font-bold hover:bg-white hover:text-dark transition-all">
                Support
              </button>
            </div>
          </div>

          {/* Column 5: Gradient Card */}
          <div className="relative w-[240px] h-[240px] rounded-4xl overflow-hidden shadow-md flex items-center justify-center p-8 text-center shrink-0 snap-center">
            <Image
              src="/images/gradient.jpg"
              alt="Background gradient"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-primary/10" />
            <h3 className="relative z-10 text-white text-base font-bold leading-tight">
              Join us in the fight for a cleaner earth
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
