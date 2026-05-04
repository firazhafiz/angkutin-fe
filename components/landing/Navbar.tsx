"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowUpRight,
  FiArrowDownLeft,
  FiMenu,
  FiX,
  FiPhoneCall,
} from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-60 flex items-center justify-between px-6 md:px-14 py-4 bg-white/70 backdrop-blur-sm border-b border-gray-100">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo/angkutin_tosca.png"
            alt="Angkutin logo"
            width={110}
            height={32}
            className="w-auto h-6 md:h-9"
            priority
          />
        </Link>

        {/* Desktop Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/auth/login"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-dark hover:text-primary transition-colors rounded-full border border-gray-200 hover:border-primary"
          >
            <FiArrowUpRight size={16} className="text-dark" /> Login
          </Link>
          <Link
            href="/auth/register"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-dark hover:text-primary transition-colors rounded-full border border-gray-200 hover:border-primary"
          >
            <FiArrowDownLeft size={16} className="text-dark" /> Register
          </Link>
        </nav>

        {/* Desktop Contact */}
        <Link
          href="#contact"
          className="hidden md:inline-flex items-center px-5 py-2 bg-dark text-white text-sm font-semibold rounded-full hover:bg-primary transition-all duration-300 "
        >
          Contact Us
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-dark hover:bg-primary hover:text-white transition-all duration-300"
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-55 bg-dark/40 backdrop-blur-sm md:hidden"
            onClick={toggleMenu}
          >
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="absolute top-0 left-0 right-0 bg-white px-6 pt-24 pb-10 rounded-b-3xl shadow-2xl border-b border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-6">
                <motion.div variants={itemVariants}>
                  <Link
                    href="/auth/login"
                    onClick={toggleMenu}
                    className="flex items-center justify-between w-full p-4 rounded-full border border-primary bg-gray-50 text-dark font-semibold group hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      <FiArrowUpRight
                        size={20}
                        className="text-primary group-hover:text-white"
                      />
                      Login
                    </span>
                    <span className="text-xs font-normal opacity-50">
                      Sign in to your account
                    </span>
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Link
                    href="/auth/register"
                    onClick={toggleMenu}
                    className="flex items-center justify-between w-full p-4 rounded-full bg-primary hover:bg-secondary transition-all duration-300 text-white font-semibold"
                  >
                    <span className="flex items-center gap-3">
                      <FiArrowDownLeft size={20} />
                      Register
                    </span>
                    <span className="text-xs font-normal opacity-80">
                      Join the movement
                    </span>
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-2">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">
                    Navigation
                  </div>
                  <nav className="flex flex-col gap-2">
                    {["Home", "About Us", "Testimonials", "Our Mission"].map(
                      (label) => (
                        <Link
                          key={label}
                          href={`#${label.toLowerCase().replace(" ", "")}`}
                          onClick={toggleMenu}
                          className="p-2 text-dark font-medium hover:text-primary transition-colors flex items-center justify-between"
                        >
                          {label}
                          <FiArrowUpRight
                            size={14}
                            className="opacity-0 group-hover:opacity-100"
                          />
                        </Link>
                      ),
                    )}
                  </nav>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-4">
                  <Link
                    href="#contact"
                    onClick={toggleMenu}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-dark text-white font-bold hover:bg-primary transition-colors duration-300 "
                  >
                    <FiPhoneCall size={18} />
                    Get in Touch
                  </Link>
                </motion.div>
              </div>

              {/* Decorative circle */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
