'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Tag,
  Truck,
  ScanLine,
  Users,
  Bike,
  Banknote,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ──────────────────────────────────────────────────────────
// Sidebar menu items — sesuai adminNavItems di config/navigation.ts
// ──────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  'layout-dashboard': LayoutDashboard,
  tag: Tag,
  truck: Truck,
  'scan-line': ScanLine,
  users: Users,
  bike: Bike,
  banknote: Banknote,
  settings: Settings,
};

interface MenuItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'layout-dashboard' },
  { label: 'Tarif Harga', href: '/admin/pricing', icon: 'tag' },
  { label: 'Armada', href: '/admin/fleet', icon: 'truck' },
  // { label: 'Terminal QR', href: '/admin/terminal', icon: 'scan-line' },
  { label: 'Pengguna', href: '/admin/users', icon: 'users' },
  { label: 'Kurir', href: '/admin/couriers', icon: 'bike' },
  { label: 'Keuangan', href: '/admin/finance', icon: 'banknote' },
  { label: 'Pengaturan', href: '/admin/settings', icon: 'settings' },
];

interface SidebarProps {
  onLogout?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  onLogout,
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();

  // Auto-close mobile sidebar on route change
  useEffect(() => {
    if (mobileOpen && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {/* ───── Mobile Overlay ───── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* ───── Sidebar ───── */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-gray-100 dark:border-gray-800',
          'bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out',
          collapsed ? 'md:w-[72px]' : 'md:w-[260px]',
          // Mobile: hidden by default, shown when mobileOpen
          mobileOpen
            ? 'w-[260px] translate-x-0'
            : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* ───── Logo Area ───── */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 dark:border-gray-800 px-4">
          <div className="flex items-center gap-3">
            {!collapsed && (
              <Image
                src="/logo/angkutin_tosca.png"
                alt="Angkutin"
                width={120}
                height={32}
                className="object-contain"
              />
            )}
          </div>
          <div className="flex items-center gap-1">
            {/* Collapse toggle — desktop only */}
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={collapsed ? "Buka Sidebar" : "Tutup Sidebar"}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            {/* Mobile close button */}
            <button
              onClick={onMobileClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            >
               <X size={18} />
            </button>
          </div>
        </div>

        {/* ───── Navigation ───── */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-4">
          <div className={cn('mb-3 px-2', collapsed && 'hidden')}>
            {/* <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Menu Utama
            </span> */}
          </div>

          <ul className="space-y-1">
            {menuItems.map((item) => {
              const IconComp = ICON_MAP[item.icon] ?? LayoutDashboard;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                      'transition-all duration-200',
                      isActive
                        ? (collapsed ? 'text-emerald-700 dark:text-emerald-400' : 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 text-emerald-700 dark:text-emerald-400 shadow-sm')
                        : (collapsed ? 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'),
                      collapsed && 'justify-center px-2'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-none'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      )}
                    >
                      <IconComp size={16} />
                    </div>
                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ───── Bottom Section ───── */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-3 py-3 space-y-2">

          {/* Logout */}
          <button
            onClick={onLogout}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
              'text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400',
              collapsed && 'justify-center px-2'
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-400">
              <LogOut size={16} />
            </div>
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
