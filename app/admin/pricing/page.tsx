'use client';

import React, { useState } from 'react';
import { Pencil, Check, X, Trash2, Plus } from 'lucide-react';
import ChartCard from '@/components/admin/ChartCard';
import DataTable, { type Column } from '@/components/admin/DataTable';
import {
  mockMutuPricing,
  mockResiduPricing,
  type ResiduPricing,
} from '@/services/mock/admin.mock';
import type { PricingRule } from '@/types/models';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/cn';

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

  // Modal states
  const [isMutuModalOpen, setIsMutuModalOpen] = useState(false);
  const [isResiduModalOpen, setIsResiduModalOpen] = useState(false);

  // -- Edit Logic
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

  // -- Delete Logic
  const deleteMutu = (id: string) => {
    if (confirm('Yakin ingin menghapus komoditas ini?')) {
      setMutuData((prev) => prev.filter(item => item.id !== id));
    }
  };

  const deleteResidu = (id: string) => {
    if (confirm('Yakin ingin menghapus tarif residu ini?')) {
      setResiduData((prev) => prev.filter(item => item.id !== id));
    }
  };

  // -- Add Logic
  const handleAddMutu = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: PricingRule = {
      id: `mutu-${Date.now()}`,
      wasteType: formData.get('wasteType') as string,
      category: 'MUTU' as any,
      pricePerKg: Number(formData.get('pricePerKg')),
      updatedAt: new Date().toISOString(),
    };
    setMutuData([newItem, ...mutuData]);
    setIsMutuModalOpen(false);
  };

  const handleAddResidu = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: ResiduPricing = {
      id: `residu-${Date.now()}`,
      vehicleType: formData.get('vehicleType') as any,
      vehicleLabel: formData.get('vehicleLabel') as string,
      pricePerKg: Number(formData.get('pricePerKg')),
      updatedAt: new Date().toISOString(),
    };
    setResiduData([newItem, ...residuData]);
    setIsResiduModalOpen(false);
  };

  // -- Columns
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
            <button onClick={() => saveMutuEdit(item.id)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">
              <Check size={14} />
            </button>
            <button onClick={cancelEdit} className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2 group">
            <span className="font-semibold text-gray-900">{fmtRupiah(item.pricePerKg)}</span>
            <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
              <button onClick={() => startEdit(item.id, item.pricePerKg)} className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600">
                <Pencil size={12} />
              </button>
              <button onClick={() => deleteMutu(item.id)} className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600">
                <Trash2 size={12} />
              </button>
            </div>
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
            day: 'numeric', month: 'short', year: 'numeric',
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
            <button onClick={() => saveResiduEdit(item.id)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white hover:bg-amber-600">
              <Check size={14} />
            </button>
            <button onClick={cancelEdit} className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2 group">
            <span className="font-semibold text-gray-900">{fmtRupiah(item.pricePerKg)}</span>
            <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
              <button onClick={() => startEdit(item.id, item.pricePerKg)} className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600">
                <Pencil size={12} />
              </button>
              <button onClick={() => deleteResidu(item.id)} className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600">
                <Trash2 size={12} />
              </button>
            </div>
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
            day: 'numeric', month: 'short', year: 'numeric',
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
        title="Harga Mutu — Komoditas Daur Ulang"
        subtitle="Harga pembelian per kg berdasarkan tipe sampah bernilai"
        action={
          <Button size="sm" onClick={() => setIsMutuModalOpen(true)} className="gap-2 bg-emerald-500 hover:bg-emerald-600 border-emerald-500 hover:border-emerald-600 text-white shadow-sm">
            <Plus size={16} /> Tambah Komoditas
          </Button>
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
        title="Tarif Residu — Per Kendaraan"
        subtitle="Biaya pengangkutan residu berdasarkan tipe kendaraan kurir"
        action={
          <Button size="sm" onClick={() => setIsResiduModalOpen(true)} className="gap-2 bg-amber-500 hover:bg-amber-600 border-amber-500 hover:border-amber-600 text-white shadow-sm">
            <Plus size={16} /> Tambah Tarif
          </Button>
        }
      >
        <DataTable
          columns={residuColumns}
          data={residuData}
          keyExtractor={(item) => item.id}
        />
      </ChartCard>

      {/* Modal Tambah Komoditas Mutu */}
      <Modal
        isOpen={isMutuModalOpen}
        onClose={() => setIsMutuModalOpen(false)}
        title="Tambah Komoditas Mutu"
      >
        <form onSubmit={handleAddMutu} className="space-y-4">
          <Input name="wasteType" label="Nama Komoditas (contoh: Kertas HVS)" required />
          <Input name="pricePerKg" type="number" label="Harga per Kg (Rp)" min="0" required />
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setIsMutuModalOpen(false)}>Batal</Button>
            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 border-emerald-500 text-white">Simpan Komoditas</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Tambah Tarif Residu */}
      <Modal
        isOpen={isResiduModalOpen}
        onClose={() => setIsResiduModalOpen(false)}
        title="Tambah Tarif Residu"
      >
        <form onSubmit={handleAddResidu} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-900">Jenis Kendaraan Backend</label>
            <select 
              name="vehicleType"
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            >
              <option value="MOTOR">Motor</option>
              <option value="MOBIL_PICKUP">Mobil Pickup</option>
              <option value="TRUK_KECIL">Truk Kecil</option>
            </select>
          </div>
          <Input name="vehicleLabel" label="Label Kendaraan (contoh: Motor Roda Dua)" required />
          <Input name="pricePerKg" type="number" label="Tarif Residu per Kg (Rp)" min="0" required />
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setIsResiduModalOpen(false)}>Batal</Button>
            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 border-amber-500 text-white">Simpan Tarif</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
