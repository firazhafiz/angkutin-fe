"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import LogoutModal from "@/components/dashboard/LogoutModal";
import { storage } from "@/lib/storage";
import { authService } from "@/services/auth.service";
import { cn } from "@/lib/cn";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [adminUser, setAdminUser] = useState<{
    name: string;
    role: string;
  } | null>(() => {
    if (typeof window !== "undefined") {
      const user = storage.getUser<any>();
      const token = storage.getToken();
      if (token && user && user.role?.toUpperCase() === "ADMIN") {
        return user;
      }
    }
    return null;
  });

  useEffect(() => {
    setMounted(true);

    const token = storage.getToken();
    const user = storage.getUser<any>();

    if (!token || !user || user.role?.toUpperCase() !== "ADMIN") {
      authService.logout();
      router.replace("/auth/login");
      return;
    }

    if (!adminUser) {
      setAdminUser(user);
    }
  }, [router, adminUser]);

  const confirmLogout = () => {
    authService.logout();
    router.replace("/auth/login");
  };

  // Only show loading if not mounted yet (hydration) or if no admin user is found (checking auth)
  if (!mounted || !adminUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-emerald-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="text-sm font-medium text-emerald-800">
            Memuat panel admin...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-linear-to-br from-emerald-50/50 via-white to-teal-50/30">
      <Sidebar
        onLogout={() => setShowLogoutModal(true)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <TopBar
        userName={adminUser.name}
        collapsed={sidebarCollapsed}
        onMobileMenuToggle={() => setMobileSidebarOpen(true)}
      />

      {/* Main content — no left margin on mobile, offset on desktop */}
      <main
        className={cn(
          "transition-all duration-300 px-4 pt-4 pb-20 md:px-6 md:pt-6 md:pb-12 ",
          sidebarCollapsed ? "md:ml-[72px]" : "md:ml-[260px]",
        )}
      >
        {children}
        <div className="h-15" />
      </main>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
}
