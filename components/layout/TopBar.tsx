'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Search, ChevronRight, Menu } from 'lucide-react';
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
        'sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100',
        'bg-white/80 backdrop-blur-lg px-4 md:px-6 transition-all duration-300',
        // On mobile: no left margin. On desktop: offset by sidebar width
        collapsed ? 'md:ml-[72px]' : 'md:ml-[260px]'
      )}
    >
      {/* Left — Hamburger (mobile) + Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMobileMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-500 md:hidden"
        >
          <Menu size={18} />
        </button>

        <div className="flex flex-col">
          {/* Breadcrumb trail — hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight size={10} className="text-gray-300" />}
                <span className={crumb.isLast ? 'text-gray-600 font-medium' : ''}>
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </div>
          {/* Page title */}
          <h1 className="text-base md:text-lg font-bold text-gray-900">
            {breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : 'Dashboard'}
          </h1>
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search — hidden on mobile */}
        <div className="hidden md:flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 border border-gray-100">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Cari..."
            className="w-40 bg-transparent text-sm text-gray-600 placeholder:text-gray-400 outline-none"
          />
          <kbd className="hidden lg:inline-flex items-center rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
          <Bell size={16} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
            3
          </span>
        </button>

        {/* Divider — hidden on mobile */}
        <div className="hidden sm:block h-8 w-px bg-gray-100" />

        {/* User info */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-xs font-bold text-white shadow-md shadow-emerald-100">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-gray-900">{userName}</span>
            <span className="text-[10px] text-gray-400">{greeting} 👋</span>
          </div>
        </div>
      </div>
    </header>
  );
}
