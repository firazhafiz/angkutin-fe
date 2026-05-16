"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { blogPosts } from "@/constant/blog-data";

export default function GallerySection() {
  const galleryItems = [
    {
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop",
      text: "Transforming waste into opportunity with every pickup and dedicated effort every day."
    },
    {
      image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=2070&auto=format&fit=crop",
      text: "Dedicated teams sorting waste for a greener, sustainable future ahead with care."
    },
    {
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2070&auto=format&fit=crop",
      text: "Skillfully processing waste to protect our planet for generations to come with expertise."
    },
    {
      image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?q=80&w=2070&auto=format&fit=crop",
      text: "Efficient collection starts the journey to recycling and eco-friendly living for all."
    }
  ];

  return (
    <section id="gallery" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-7xl font-black text-[#016A70] tracking-tighter mb-2"
          >
            OUR
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl font-black text-dark tracking-tight uppercase"
          >
            Gallery
          </motion.p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {galleryItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1
              }}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-xl shadow-dark/5"
            >
              {/* Background Image */}
              <Image
                src={item.image}
                alt="Gallery Item"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              {/* Overlay - Smoother and less contrast */}
              <div className="absolute inset-0 bg-dark/0 group-hover:bg-[#016A70]/40 transition-colors duration-700" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Content - Hidden by default, reveals on hover */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-2 group-hover:translate-y-0">
                {/* Official Logo */}
                <div className="relative w-24 h-8 mb-4">
                  <Image
                    src="/logo/angkutin_tosca.png"
                    alt="Angkutin Logo"
                    fill
                    className="object-contain brightness-0 invert"
                  />
                </div>

                <p className="text-white text-xs md:text-sm font-medium leading-relaxed max-w-xs">
                  {item.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}