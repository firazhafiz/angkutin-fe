'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import { storage } from '@/lib/storage';
import { cn } from '@/lib/cn';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [adminUser, setAdminUser] = useState<{ name: string; role: string } | null>(null);
  useEffect(() => {
    setMounted(true);

    const token = storage.getToken();
    const user = storage.getUser();

    // // Jika tidak ada token atau bukan admin, tendang ke login
    if (!token || !user) {
      storage.clear(); // Bersihkan sisa data jika ada
      router.replace('/auth/login');
      return;
    }

    setAdminUser(user as any);
  }, [router]);

  const handleLogout = () => {
    storage.clear();
    router.replace('/auth/login');
  };

  if (!mounted || !adminUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-primary-light/30">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-light border-t-primary" />
          <p className="text-sm text-gray-500">Memuat panel admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary-light/30 via-very-light-gray to-primary-light/20">
      <Sidebar
        onLogout={handleLogout}
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
          'transition-all duration-300 px-4 pt-4 pb-20 md:px-6 md:pt-6 md:pb-12 ',
          sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-[260px]'
        )}
      >
        {children}
        <div className="h-15" />
      </main>
    </div>
  );
}
