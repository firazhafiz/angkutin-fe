import Image from "next/image";
import { Sprout, Cpu } from "lucide-react";
import { FiArrowUpRight } from "react-icons/fi";

export default function About() {
  return (
    <section id="aboutus" className="md:pt-20 pt-14 pb-14 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Left */}
          <div>
            <p className="text-2xl font-light text-dark tracking-widest pb-8">
              About Us
            </p>
            <div className="relative w-full md:h-115 h-96 rounded-2xl overflow-hidden">
              <Image
                src="/images/about.jpg"
                alt="About Angkutin"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>

          {/* Right */}
          <div className="lg:pt-14 pt-0">
            <h2 className="text-3xl md:text-4xl font-bold text-dark leading-tight pb-4">
              Start your journey towards a sustainable future with smart
              recycling
            </h2>
            <p className="text-gray-500 text-xl leading-relaxed pb-8">
              Angkutin provides an integrated platform to transform how society
              manages daily waste.
            </p>

            {/* Get Started button */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-semibold text-dark">
                Get Started
              </span>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <FiArrowUpRight size={16} className="text-white" />
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-soft-gray">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mb-3">
                  <Sprout size={16} className="text-secondary" />
                </div>
                <h3 className="text-sm font-bold text-dark mb-2">
                  Environmentally Friendly
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Track and optimize recyclable waste collection to support a
                  sustainable ecosystem.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-soft-gray">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                  <Cpu size={16} className="text-primary" />
                </div>
                <h3 className="text-sm font-bold text-dark mb-2">
                  Innovation and Technological
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  A digital technology platform accelerating sustainable waste
                  management every day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
