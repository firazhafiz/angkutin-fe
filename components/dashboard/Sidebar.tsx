"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Wallet, User, LogOut } from "lucide-react";
import { cn } from "@/lib/cn";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import LogoutModal from "./LogoutModal";

interface SidebarProps {
  role: "user" | "courier";
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogout = () => {
    authService.logout();
    router.push("/auth/login");
  };

  const navItems =
    role === "user"
      ? [
          { label: "Dashboard", icon: Home, href: "/dashboard/user" },
          {
            label: "Riwayat Pesanan",
            icon: ClipboardList,
            href: "/dashboard/user/history",
          },
          {
            label: "Dompet & Saldo",
            icon: Wallet,
            href: "/dashboard/user/wallet",
          },
          { label: "Profil Saya", icon: User, href: "/dashboard/user/profile" },
        ]
      : [
          { label: "Dashboard Shift", icon: Home, href: "/dashboard/courier" },
          {
            label: "Daftar Order",
            icon: ClipboardList,
            href: "/dashboard/courier/missions",
          },
          {
            label: "Dompet Komisi",
            icon: Wallet,
            href: "/dashboard/courier/wallet",
          },
          {
            label: "Profil Kurir",
            icon: User,
            href: "/dashboard/courier/profile",
          },
        ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white border-r border-gray-100 p-6">
      <div className="mb-10 px-2">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo/angkutin_tosca.png"
            alt="Logo"
            width={120}
            height={30}
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center text-sm gap-4 px-4 py-3.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary text-white "
                  : "text-gray-500 hover:bg-gray-50 hover:text-primary",
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-50">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex text-sm items-center gap-4 px-4 py-3.5 w-full rounded-xl text-red-500 hover:bg-red-50 transition-colors font-semibold cursor-pointer"
        >
          <LogOut size={20} />
          <span>Keluar Akun</span>
        </button>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </aside>
  );
}
