"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Wallet, User } from "lucide-react";
import { cn } from "@/lib/cn";

interface BottomNavProps {
  role: "user" | "courier";
}

export default function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname();

  const navItems = role === "user" 
    ? [
        { label: "Home", icon: Home, href: "/dashboard/user" },
        { label: "Riwayat", icon: ClipboardList, href: "/dashboard/user/history" },
        { label: "Dompet", icon: Wallet, href: "/dashboard/user/wallet" },
        { label: "Profil", icon: User, href: "/dashboard/user/profile" },
      ]
    : [
        { label: "Shift", icon: Home, href: "/dashboard/courier" },
        { label: "Misi", icon: ClipboardList, href: "/dashboard/courier/missions" },
        { label: "Dompet", icon: Wallet, href: "/dashboard/courier/wallet" },
        { label: "Profil", icon: User, href: "/dashboard/courier/profile" },
      ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 md:hidden z-50">
      <div className="flex justify-between items-center max-w-sm mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-14 h-10 transition-colors duration-200",
                isActive ? "text-primary" : "text-gray-400"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {/* Optional: Tiny dot indicator for active state */}
              {isActive && <div className="w-1 h-1 bg-primary rounded-full mt-1" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
