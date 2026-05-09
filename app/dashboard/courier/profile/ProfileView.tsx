"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { walletService } from "@/services/wallet.service";
import {
  User,
  MapPin,
  Shield,
  Bell,
  ChevronRight,
  Package,
  Wallet,
  LogOut,
  Star,
  Truck,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import LogoutModal from "@/components/dashboard/LogoutModal";

// Reusing User sections for now (they should be generic enough or we can duplicate if needed)
import PersonalInfoSection from "@/app/dashboard/user/profile/sections/PersonalInfoSection";
import AddressSection from "@/app/dashboard/user/profile/sections/AddressSection";
import SecuritySection from "@/app/dashboard/user/profile/sections/SecuritySection";
import NotificationSection from "@/app/dashboard/user/profile/sections/NotificationSection";

type ActiveSection =
  | "overview"
  | "personal"
  | "address"
  | "security"
  | "notification";

const menuItems = [
  {
    id: "personal" as ActiveSection,
    label: "Personal Information",
    desc: "Edit name, email, phone & photo",
    icon: User,
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: "security" as ActiveSection,
    label: "Account Security",
    desc: "Password, PIN & login sessions",
    icon: Shield,
    color: "bg-purple-50 text-purple-600",
  },
  {
    id: "notification" as ActiveSection,
    label: "Notifications",
    desc: "Manage your notification preferences",
    icon: Bell,
    color: "bg-orange-50 text-orange-600",
  },
];

export default function ProfileView() {
  const [active, setActive] = useState<ActiveSection>("overview");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // Courier specific status
  const router = useRouter();

  const handleLogout = () => {
    authService.logout();
    router.push("/auth/login");
  };

  const { data: walletData, isLoading: isWalletLoading } = useQuery({
    queryKey: ["walletBalance"],
    queryFn: walletService.getBalance,
  });

  const walletBalance = walletData?.data?.balance || 0;
  // Function to format balance to "k" format like in the design
  const formatBalanceK = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + "k";
    }
    return num.toString();
  };

  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userService.getProfile,
  });

  const userData = profileData?.data;

  // Added Courier-specific mock data
  const user = {
    name: userData?.name || "Kurir Angkutin",
    email: userData?.email || "kurir@angkutin.com",
    phone: userData?.phone || "+62 812-3456-7890",
    photoUrl:
      userData?.photoUrl ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${
        userData?.name || "Kurir"
      }`,
    joinDate: userData?.createdAt
      ? new Date(userData.createdAt).toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric",
        })
      : "April 2024",
    totalOrders: 156, // Mock courier stats
    totalPoints: 4200, // Mock points
    totalBalance: walletBalance,
    tier: "Gold Courier",
    vehicleType: "Motor Bak Roda 3", // Courier specific
    vehiclePlate: "D 1234 ABC", // Courier specific
  };

    return (
      <PersonalInfoSection 
        user={user} 
        onBack={() => setActive("overview")} 
        role="courier"
      />
    );
  if (active === "address")
    return <AddressSection onBack={() => setActive("overview")} />;
  if (active === "security")
    return <SecuritySection onBack={() => setActive("overview")} />;
  if (active === "notification")
    return <NotificationSection onBack={() => setActive("overview")} />;

  return (
    <DashboardLayout role="courier">
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        {/* Hero Profile Card */}
        <div className="bg-dark rounded-xl p-8 text-white relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/5 rounded-full" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar & Status */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white/40">
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-dark flex items-center justify-center",
                  isOnline ? "bg-green-500" : "bg-gray-400",
                )}
                title={isOnline ? "Online" : "Offline"}
              >
                {isOnline && <CheckCircle2 size={12} className="text-white" />}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                {isProfileLoading ? (
                  <div className="h-8 w-48 bg-white/10 animate-pulse rounded-lg" />
                ) : (
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-black tracking-tight">
                      {user.name}
                    </h1>
                    <button
                      onClick={() => setIsOnline(!isOnline)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer",
                        isOnline
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-white/10 text-white/50 border-white/10",
                      )}
                    >
                      {isOnline ? "Menerima Order" : "Sedang Istirahat"}
                    </button>
                  </div>
                )}
              </div>
              {isProfileLoading ? (
                <div className="h-4 w-32 bg-white/10 animate-pulse rounded mt-2" />
              ) : (
                <p className="text-white/50 text-sm font-medium">
                  {user.email}
                </p>
              )}

              {/* Courier Specific Badges */}
              {!isProfileLoading && (
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/5">
                    <Truck size={14} className="text-secondary" />
                    <span className="text-xs font-bold text-white/80">
                      {user.vehicleType}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/5">
                    <span className="text-xs font-black tracking-widest text-white/80">
                      {user.vehiclePlate}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full sm:w-auto mt-4 sm:mt-0">
              {[
                { label: "Orders", value: user.totalOrders, icon: Package },
                { label: "Komisi", value: "2.4M", icon: Wallet },
              ].map((s) => (
                <div key={s.label} className="text-left sm:text-center">
                  {s.label === "Komisi" && isWalletLoading ? (
                    <div className="h-8 w-12 bg-white/10 animate-pulse rounded mb-1 sm:mx-auto" />
                  ) : (
                    <p className="text-2xl font-black tracking-tighter">
                      {s.label === "Komisi"
                        ? formatBalanceK(walletBalance)
                        : s.value}
                    </p>
                  )}
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Menu Grid */}
        <div>
          <h2 className="text-lg font-bold text-dark tracking-wide mb-4 px-1">
            Pengaturan Akun & Kendaraan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className="group bg-white p-6 rounded-xl border border-gray-100 hover:border-primary/30 transition-all text-left flex items-center gap-5 cursor-pointer"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                    item.color,
                  )}
                >
                  <item.icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-dark text-sm">{item.label}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">
                    {item.desc}
                  </p>
                </div>
                <ChevronRight
                  size={18}
                  className="text-gray-600 group-hover:text-primary transition-colors shrink-0"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-base font-bold text-dark tracking-wide mb-4">
            Aksi Akun
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                <LogOut size={18} />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">Sign Out</p>
                <p className="text-xs text-red-400">
                  Keluar dari sesi kurir ini
                </p>
              </div>
            </button>
          </div>
        </div>

        <LogoutModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      </div>
    </DashboardLayout>
  );
}
