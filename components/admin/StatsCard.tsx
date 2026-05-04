'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { LucideIcon } from 'lucide-react';

// ──────────────────────────────────────────────────────────
// StatsCard — Kartu metrik angka untuk dashboard admin.
// Mendukung tren naik/turun dan warna ikon kustom.
// ──────────────────────────────────────────────────────────

interface StatsCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number; // persen perubahan, misal 12.5
    direction: 'up' | 'down';
  };
  iconColor?: string; // tailwind bg class, e.g. "bg-emerald-500"
  className?: string;
}

export default function StatsCard({
  label,
  value,
  subtitle,
  icon: Icon,
  trend,
  iconColor = 'bg-emerald-500',
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5',
        'shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-200',
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-gray-50 to-transparent opacity-80" />

      <div className="relative flex items-start justify-between gap-2">
        {/* Left — Info */}
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[10px] md:text-xs font-medium uppercase tracking-wider text-gray-400">
            {label}
          </span>
          <span className="text-lg md:text-2xl font-extrabold text-gray-900 tracking-tight truncate">
            {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
          </span>
          {subtitle && (
            <span className="text-xs text-gray-400">{subtitle}</span>
          )}
          {trend && (
            <div className="mt-1 flex items-center gap-1">
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                  trend.direction === 'up'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-red-50 text-red-500'
                )}
              >
                {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-[10px] text-gray-400">vs minggu lalu</span>
            </div>
          )}
        </div>

        {/* Right — Icon */}
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white',
            'shadow-lg transition-transform duration-300 group-hover:scale-105',
            iconColor
          )}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
