'use client';

import React from 'react';
import { cn } from '@/lib/cn';

// ──────────────────────────────────────────────────────────
// ChartCard — Wrapper kartu untuk grafik (Recharts dll).
// Menyediakan header (judul + aksi) dan area konten.
// ──────────────────────────────────────────────────────────

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode; // tombol/dropdown di header
  children: React.ReactNode;
  className?: string;
}

export default function ChartCard({
  title,
  subtitle,
  action,
  children,
  className,
}: ChartCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-100 bg-white shadow-sm',
        'transition-all duration-300 hover:shadow-md',
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 px-4 md:px-5 py-3 md:py-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      {/* Content — overflow-x-auto for tables/charts on small screens */}
      <div className="overflow-x-auto p-4 md:p-5">{children}</div>
    </div>
  );
}
