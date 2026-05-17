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
  Camera,
  Star,
  Package,
  Wallet,
  Edit3,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import PersonalInfoSection from "./sections/PersonalInfoSection";
import AddressSection from "./sections/AddressSection";
import SecuritySection from "./sections/SecuritySection";
import NotificationSection from "./sections/NotificationSection";
import { userService } from "@/services/user.service";
import LogoutModal from "@/components/dashboard/LogoutModal";
import { orderService } from "@/services/order.service";
import { OrderStatus } from "@/types/enums";
import type { Order } from "@/types/models";

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
    id: "address" as ActiveSection,
    label: "My Addresses",
    desc: "Add, edit or delete saved addresses",
    icon: MapPin,
    color: "bg-emerald-50 text-emerald-600",
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

  const { data: ordersData } = useQuery({
    queryKey: ["userOrders"],
    queryFn: () => orderService.getOrders(),
  });

  const userData = profileData?.data;
  const allOrders: Order[] = ordersData?.data || [];
  const completedOrders = allOrders.filter((o) => o.status === OrderStatus.COMPLETED);
  const totalCompletedOrders = completedOrders.length;

  let calculatedPoints = 0;
  completedOrders.forEach((order) => {
    let orderPoints = 0;
    if (order.pointTransactions && order.pointTransactions.length > 0) {
      order.pointTransactions.forEach((pt) => {
        orderPoints += pt.points;
      });
    } else if (order.wasteItems && order.wasteItems.length > 0) {
      order.wasteItems.forEach((item) => {
        if (item.wasteType?.category === "MUTU") {
          orderPoints += Number(item.weight) || 0;
        }
      });
    }
    calculatedPoints += Math.floor(orderPoints);
  });

  const user = {
    name: userData?.name || "User",
    email: userData?.email || "...",
    phone: userData?.phone || "-",
    photoUrl: userData?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.name || "User"}`,
    joinDate: userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : "...",
    totalOrders: totalCompletedOrders,
    totalPoints: calculatedPoints,
    totalBalance: walletBalance,
    tier: "Silver",
  };

  if (active === "personal")
    return (
      <PersonalInfoSection user={user} onBack={() => setActive("overview")} />
    );
  if (active === "address")
    return <AddressSection onBack={() => setActive("overview")} />;
  if (active === "security")
    return <SecuritySection user={user} onBack={() => setActive("overview")} />;
  if (active === "notification")
    return <NotificationSection onBack={() => setActive("overview")} />;

  return (
    <DashboardLayout role="user">
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        {/* Hero Profile Card */}
        <div className="bg-dark rounded-xl p-8 text-white relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/5 rounded-full" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white/40">
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                {isProfileLoading ? (
                  <div className="h-8 w-48 bg-white/10 animate-pulse rounded-lg" />
                ) : (
                  <h1 className="text-2xl font-black tracking-tight">
                    {user.name}
                  </h1>
                )}
              </div>
              {isProfileLoading ? (
                <div className="h-4 w-32 bg-white/10 animate-pulse rounded mt-2" />
              ) : (
                <p className="text-white/50 text-sm font-medium">{user.email}</p>
              )}
              {isProfileLoading ? (
                <div className="h-3 w-40 bg-white/5 animate-pulse rounded mt-2" />
              ) : (
                <p className="text-white/30 text-xs mt-1">
                  Member since {user.joinDate}
                </p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full sm:w-auto mt-4 sm:mt-0">
              {[
                { label: "Orders", value: user.totalOrders, icon: Package },
                {
                  label: "Points",
                  value: user.totalPoints.toLocaleString(),
                  icon: Star,
                },
                { label: "Balance", value: "425k", icon: Wallet },
              ].map((s) => (
                <div key={s.label} className="text-left sm:text-center">
                  {s.label === "Balance" && isWalletLoading ? (
                    <div className="h-8 w-12 bg-white/10 animate-pulse rounded mb-1 sm:mx-auto" />
                  ) : (
                    <p className="text-2xl font-black tracking-tighter">
                      {s.label === "Balance" ? formatBalanceK(walletBalance) : s.value}
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
          <h2 className="text-lg font-bold text-dark  tracking-wide mb-4 px-1">
            Account Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className="group bg-white p-6 rounded-xl border border-gray-100 hover:border-primary/30 transition-all text-left flex items-center gap-5"
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
            Account Actions
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
                <p className="text-xs text-red-400">Log out from this device</p>
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
