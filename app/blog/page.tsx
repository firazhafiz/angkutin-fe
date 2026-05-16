"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { blogPosts } from "@/constant/blog-data";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiClock, FiCalendar, FiSearch, FiFilter } from "react-icons/fi";

export default function BlogListingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const categories = ["All", ...Array.from(new Set(blogPosts.map(p => p.category)))];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <div className="bg-primary/5 py-20 mb-16">
          <div className="container mx-auto px-6 max-w-7xl text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-dark mb-6"
            >
              Our Blog
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-500 max-w-2xl mx-auto mb-10"
            >
              Latest news, tips, and insights on sustainable waste management and environmental innovation.
            </motion.p>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-4 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                      activeCategory === cat 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "bg-white text-dark border border-gray-200 hover:border-primary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="container mx-auto px-6 max-w-7xl">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-4xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col"
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-primary text-xs font-bold rounded-full shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-gray-400 text-xs mb-4 font-medium">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="text-primary" /> {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="text-primary" /> {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-50">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all"
                      >
                        Read Full Story <FiArrowUpRight />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 font-medium">No articles found matching your criteria.</p>
              <button 
                onClick={() => {setSearchQuery(""); setActiveCategory("All")}}
                className="mt-4 text-primary font-bold underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
