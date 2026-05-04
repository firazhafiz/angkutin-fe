'use client';

import React, { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import ChartCard from '@/components/admin/ChartCard';
import DataTable, { type Column } from '@/components/admin/DataTable';
import {
  mockMutuPricing,
  mockResiduPricing,
  type ResiduPricing,
} from '@/services/mock/admin.mock';
import type { PricingRule } from '@/types/models';
import { cn } from '@/lib/cn';

// ──────────────────────────────────────────────────────────
// Pricing Page — Item 34 dari PRD
// Dua tabel: Harga Mutu (berdasarkan komoditas) dan
// Harga Residu (berdasarkan Vehicle Type).
// Mendukung inline editing.
// ──────────────────────────────────────────────────────────

const fmtRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);

export default function PricingPage() {
  const [mutuData, setMutuData] = useState(mockMutuPricing);
  const [residuData, setResiduData] = useState(mockResiduPricing);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const startEdit = (id: string, currentPrice: number) => {
    setEditingId(id);
    setEditValue(currentPrice);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue(0);
  };

  const saveMutuEdit = (id: string) => {
    setMutuData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, pricePerKg: editValue, updatedAt: new Date().toISOString().split('T')[0] } : item
      )
    );
    setEditingId(null);
  };

  const saveResiduEdit = (id: string) => {
    setResiduData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, pricePerKg: editValue, updatedAt: new Date().toISOString().split('T')[0] } : item
      )
    );
    setEditingId(null);
  };

  const mutuColumns: Column<PricingRule>[] = [
    {
      key: 'wasteType',
      header: 'Tipe Komoditas',
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="font-medium text-gray-900">{item.wasteType}</span>
        </div>
      ),
    },
    {
      key: 'pricePerKg',
      header: 'Harga / kg',
      align: 'right',
      render: (item) =>
        editingId === item.id ? (
          <div className="flex items-center justify-end gap-2">
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(Number(e.target.value))}
              className="w-28 rounded-lg border border-emerald-300 px-2 py-1 text-right text-sm outline-none focus:ring-2 focus:ring-emerald-100"
              autoFocus
            />
            <button
              onClick={() => saveMutuEdit(item.id)}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
            >
              <Check size={14} />
            </button>
            <button
              onClick={cancelEdit}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2">
            <span className="font-semibold text-gray-900">{fmtRupiah(item.pricePerKg)}</span>
            <button
              onClick={() => startEdit(item.id, item.pricePerKg)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600"
            >
              <Pencil size={12} />
            </button>
          </div>
        ),
    },
    {
      key: 'updatedAt',
      header: 'Terakhir Diubah',
      align: 'right',
      render: (item) => (
        <span className="text-xs text-gray-400">
          {new Date(item.updatedAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
  ];

  const residuColumns: Column<ResiduPricing>[] = [
    {
      key: 'vehicleLabel',
      header: 'Tipe Kendaraan',
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-amber-500" />
          <span className="font-medium text-gray-900">{item.vehicleLabel}</span>
        </div>
      ),
    },
    {
      key: 'pricePerKg',
      header: 'Tarif / kg',
      align: 'right',
      render: (item) =>
        editingId === item.id ? (
          <div className="flex items-center justify-end gap-2">
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(Number(e.target.value))}
              className="w-28 rounded-lg border border-amber-300 px-2 py-1 text-right text-sm outline-none focus:ring-2 focus:ring-amber-100"
              autoFocus
            />
            <button
              onClick={() => saveResiduEdit(item.id)}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white hover:bg-amber-600"
            >
              <Check size={14} />
            </button>
            <button
              onClick={cancelEdit}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2">
            <span className="font-semibold text-gray-900">{fmtRupiah(item.pricePerKg)}</span>
            <button
              onClick={() => startEdit(item.id, item.pricePerKg)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600"
            >
              <Pencil size={12} />
            </button>
          </div>
        ),
    },
    {
      key: 'updatedAt',
      header: 'Terakhir Diubah',
      align: 'right',
      render: (item) => (
        <span className="text-xs text-gray-400">
          {new Date(item.updatedAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">Tarif Harga</h2>
        <p className="text-sm text-gray-400">
          Kelola harga per kilogram untuk setiap komoditas mutu dan tarif residu kendaraan
        </p>
      </div>

      {/* Tabel Mutu */}
      <ChartCard
        title="💎 Harga Mutu — Komoditas Daur Ulang"
        subtitle="Harga pembelian per kg berdasarkan tipe sampah bernilai"
        action={
          <button className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600">
            + Tambah Komoditas
          </button>
        }
      >
        <DataTable
          columns={mutuColumns}
          data={mutuData}
          keyExtractor={(item) => item.id}
        />
      </ChartCard>

      {/* Tabel Residu */}
      <ChartCard
        title="🚛 Tarif Residu — Per Kendaraan"
        subtitle="Biaya pengangkutan residu berdasarkan tipe kendaraan kurir"
        action={
          <button className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-amber-600">
            + Tambah Tarif
          </button>
        }
      >
        <DataTable
          columns={residuColumns}
          data={residuData}
          keyExtractor={(item) => item.id}
        />
      </ChartCard>
    </div>
  );
}
