'use client';

import React from 'react';
import { cn } from '@/lib/cn';

// ──────────────────────────────────────────────────────────
// DataTable — Tabel data reusable untuk admin panel.
// Mendukung header kustom, render row kustom, loading state,
// dan kolom numerik (harga/angka) dengan border & tabular-nums.
// ──────────────────────────────────────────────────────────

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  numeric?: boolean; // kolom harga/angka → font-mono, right-align, border-left
  render?: (item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (item: T) => void;
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyMessage = 'Belum ada data',
  className,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className={cn('overflow-x-auto rounded-2xl border border-soft-gray bg-white', className)}>
      <table className="w-full text-sm">
        {/* Header */}
        <thead>
          <tr className="border-b border-soft-gray bg-very-light-gray">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400',
                  col.align === 'center' && 'text-center',
                  (col.align === 'right' || col.numeric) && 'text-right',
                  !col.align && !col.numeric && 'text-left',
                  col.numeric && 'border-l border-soft-gray'
                )}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-soft-gray">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={`skeleton-${i}`}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-soft-gray" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center">
                <p className="text-sm text-gray-400">{emptyMessage}</p>
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'transition-colors duration-150',
                  onRowClick && 'cursor-pointer hover:bg-primary-light/20',
                  !onRowClick && 'hover:bg-very-light-gray'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3 text-sm text-gray-600',
                      col.align === 'center' && 'text-center',
                      (col.align === 'right' || col.numeric) && 'text-right',
                      col.numeric && 'font-mono tabular-nums border-l border-soft-gray'
                    )}
                  >
                    {col.render
                      ? col.render(item, rowIndex)
                      : String((item as Record<string, unknown>)[col.key] ?? '-')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
