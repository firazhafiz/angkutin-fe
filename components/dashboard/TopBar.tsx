"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Search,
  LogOut,
  User,
  Settings,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { authService } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import LogoutModal from "./LogoutModal";

export default function TopBar() {
  const [greeting, setGreeting] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userService.getProfile,
  });

  const user = profileData?.data;

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 11) setGreeting("Selamat Pagi");
    else if (hours >= 11 && hours < 15) setGreeting("Selamat Siang");
    else if (hours >= 15 && hours < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");

    // Close menu when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const handleLogout = () => {
    authService.logout();
    router.push("/auth/login");
  };

  return (
    <header className="h-20 bg-white/60 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40">
      <div className="flex items-center gap-4 md:hidden">
        <Image
          src="/logo/angkutin_tosca.png"
          alt="Logo Angkutin"
          width={100}
          height={100}
        />
      </div>

      {/* Breadcrumb Menu */}
      <div className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
        <span className="hover:text-primary transition-colors cursor-pointer">
          {segments[1] || "User"}
        </span>
        {segments.length > 2 && (
          <>
            <span className="text-gray-400">/</span>
            <span className="text-dark">
              {segments[segments.length - 1].replace(/-/g, " ")}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <button className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        <div
          className="flex items-center gap-3 pl-2 md:pl-0 border-l border-gray-100 md:border-none relative"
          ref={menuRef}
        >
          <div className="hidden md:block text-right">
            {isProfileLoading ? (
              <div className="h-4 w-24 bg-gray-100 animate-pulse rounded mb-1" />
            ) : (
              <p className="text-sm font-bold text-dark leading-tight">
                {user?.name || "User"}
              </p>
            )}
            <p className="text-xs font-medium text-gray-400 leading-tight">
              {greeting}!
            </p>
          </div>

          {/* Mobile Clickable Avatar */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:pointer-events-none group flex items-center gap-2 focus:outline-none"
          >
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-primary/10 border-2 border-white ring-1 ring-gray-100 overflow-hidden shadow-sm transition-transform active:scale-95 md:active:scale-100 group-hover:ring-primary/30 md:group-hover:ring-gray-100">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ilham"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </button>

          {/* Mobile Only Dropdown */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden md:hidden"
              >
                <div className="p-4 border-b border-gray-50">
                  <p className="text-sm font-bold text-dark">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400">{greeting}!</p>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      router.push("/dashboard/user/profile");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary rounded-xl transition-colors"
                  >
                    <User size={18} />
                    Profil Saya
                  </button>
                </div>

                <div className="p-2 border-t border-gray-50 bg-gray-50/50">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={18} />
                    Keluar Akun
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </header>
  );
}
