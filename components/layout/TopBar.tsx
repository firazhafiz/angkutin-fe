'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Search, ChevronRight, Menu, User } from 'lucide-react';
import { cn } from '@/lib/cn';

// ──────────────────────────────────────────────────────────
// Breadcrumb map — label user-friendly per segment
// ──────────────────────────────────────────────────────────
const SEGMENT_LABELS: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  pricing: 'Tarif Harga',
  fleet: 'Armada',
  terminal: 'Terminal QR',
  users: 'Pengguna',
  couriers: 'Kurir',
  finance: 'Keuangan',
  settings: 'Pengaturan',
};

interface TopBarProps {
  userName?: string;
  collapsed?: boolean;
  onMobileMenuToggle?: () => void;
}

export default function TopBar({
  userName = 'Admin',
  collapsed = false,
  onMobileMenuToggle,
}: TopBarProps) {
  const pathname = usePathname();

  // Build breadcrumb from pathname
  const segments = pathname
    ?.replace(/^\//, '')
    .split('/')
    .filter(Boolean) ?? [];

  const breadcrumbs = segments.map((seg, i) => ({
    label: SEGMENT_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
    isLast: i === segments.length - 1,
  }));

  // Generate greeting berdasarkan waktu
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Selamat Pagi' : hour < 17 ? 'Selamat Siang' : 'Selamat Malam';

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 dark:border-gray-800',
        'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg px-4 md:px-6 transition-all duration-300',
        // On mobile: no left margin. On desktop: offset by sidebar width
        collapsed ? 'md:ml-[72px]' : 'md:ml-[260px]'
      )}
    >
      {/* Left — Hamburger (mobile) + Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMobileMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 md:hidden"
        >
          <Menu size={18} />
        </button>

        <div className="flex flex-col">
          {/* Page title */}
          <h1 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
            {breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : 'Dashboard'}
          </h1>
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Notifications */}

        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white">
          <Bell size={16} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-gray-900">
            3
          </span>
        </button>

        {/* Divider — hidden on mobile */}
        <div className="hidden sm:block h-8 w-px bg-gray-100 dark:bg-gray-800" />

        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{userName}</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{greeting}</span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-sm ring-1 ring-emerald-100 dark:ring-emerald-900/30">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
