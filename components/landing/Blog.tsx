"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { blogPosts } from "@/constant/blog-data";
import { FiArrowUpRight, FiClock } from "react-icons/fi";

export default function BlogSection() {
  return (
    <section id="blog" className="pt-16 pb-16  bg-primary-light/50">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary font-extralight tracking-widest uppercase text-xl mb-4"
            >
              Our Journal
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-black text-dark leading-tight"
            >
              Latest Insights & Sustainability News
            </motion.h2>
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.slice(0, 3).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black text-primary uppercase tracking-widest shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  <span>{post.date}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <FiClock /> {post.readTime}
                  </div>
                </div>

                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-lg font-black text-dark hover:text-primary transition-colors line-clamp-2 leading-tight mb-3">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-50">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-[10px] font-bold text-dark hover:text-primary transition-colors"
                  >
                    Read Article{" "}
                    <FiArrowUpRight className="transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mt-16"
        >
          <Link
            href="/blog"
            className="group flex items-center gap-3 px-10 py-4 bg-dark text-white rounded-full font-bold text-xs hover:bg-primary transition-all duration-500"
          >
            Explore the Journal{" "}
            <FiArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
