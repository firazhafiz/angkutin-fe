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

// Mapping kendaraan → label + tarif default
const vehicleTarifDefaults: Record<string, { label: string; tarif: number }> = {
  MOTOR: { label: 'Motor', tarif: 1500 },
  MOBIL_PICKUP: { label: 'Pickup', tarif: 1200 },
  TOSHA: { label: 'Viar', tarif: 1000 },
  TRUK_KECIL: { label: 'Truk Kecil', tarif: 1000 },
  TRUK_BESAR: { label: 'Truk Besar', tarif: 800 },
};

// Preset pilihan tarif
const tarifPresets = [800, 1000, 1200, 1500, 2000, 2500, 3000];

export default function PricingPage() {
  const [mutuData, setMutuData] = useState(mockMutuPricing);
  const [residuData, setResiduData] = useState(mockResiduPricing);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  // Modal states
  const [isMutuModalOpen, setIsMutuModalOpen] = useState(false);
  const [isResiduModalOpen, setIsResiduModalOpen] = useState(false);

  // Residu form state
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [selectedTarif, setSelectedTarif] = useState<number>(0);

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

  // -- Add Mutu Logic
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

  // -- Add Residu Logic
  const handleAddResidu = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedVehicle || selectedTarif <= 0) return;
    const vehicleInfo = vehicleTarifDefaults[selectedVehicle];
    const newItem: ResiduPricing = {
      id: `residu-${Date.now()}`,
      vehicleType: selectedVehicle as any,
      vehicleLabel: vehicleInfo?.label ?? selectedVehicle,
      pricePerKg: selectedTarif,
      updatedAt: new Date().toISOString(),
    };
    setResiduData([newItem, ...residuData]);
    setIsResiduModalOpen(false);
    setSelectedVehicle('');
    setSelectedTarif(0);
  };

  // -- Columns
  const mutuColumns: Column<PricingRule>[] = [
    {
      key: 'wasteType',
      header: 'Tipe Komoditas',
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-secondary shrink-0" />
          <span className="font-medium text-dark">{item.wasteType}</span>
        </div>
      ),
    },
    {
      key: 'pricePerKg',
      header: 'Harga / kg',
      align: 'right',
      numeric: true,
      render: (item) =>
        editingId === item.id ? (
          <div className="flex items-center justify-end gap-2">
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(Number(e.target.value))}
              className="w-28 rounded-lg border border-primary/30 px-2 py-1 text-right text-sm font-mono outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
            <button onClick={() => saveMutuEdit(item.id)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white hover:bg-[#015558]">
              <Check size={14} />
            </button>
            <button onClick={cancelEdit} className="flex h-7 w-7 items-center justify-center rounded-lg bg-soft-gray text-gray-500 hover:bg-gray-200">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="relative flex items-center justify-end group">
            <span className="font-mono tabular-nums font-semibold text-dark">{fmtRupiah(item.pricePerKg)}</span>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex gap-1 bg-white px-1 opacity-0 transition-opacity group-hover:opacity-100 shadow-sm rounded-lg">
              <button onClick={() => startEdit(item.id, item.pricePerKg)} className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-primary-light hover:text-primary">
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
          <div className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
          <span className="font-medium text-dark">{item.vehicleLabel}</span>
        </div>
      ),
    },
    {
      key: 'pricePerKg',
      header: 'Tarif / kg',
      align: 'right',
      numeric: true,
      render: (item) =>
        editingId === item.id ? (
          <div className="flex items-center justify-end gap-2">
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(Number(e.target.value))}
              className="w-28 rounded-lg border border-amber-300 px-2 py-1 text-right text-sm font-mono outline-none focus:ring-2 focus:ring-amber-100"
              autoFocus
            />
            <button onClick={() => saveResiduEdit(item.id)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white hover:bg-amber-600">
              <Check size={14} />
            </button>
            <button onClick={cancelEdit} className="flex h-7 w-7 items-center justify-center rounded-lg bg-soft-gray text-gray-500 hover:bg-gray-200">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="relative flex items-center justify-end group">
            <span className="font-mono tabular-nums font-semibold text-dark">{fmtRupiah(item.pricePerKg)}</span>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex gap-1 bg-white px-1 opacity-0 transition-opacity group-hover:opacity-100 shadow-sm rounded-lg">
              <button onClick={() => startEdit(item.id, item.pricePerKg)} className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-primary-light hover:text-primary">
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
        <h2 className="text-xl font-extrabold text-dark">Tarif Harga</h2>
        <p className="text-sm text-gray-400">
          Kelola harga per kilogram untuk setiap komoditas mutu dan tarif residu kendaraan
        </p>
      </div>

      {/* Tabel Mutu */}
      <ChartCard
        title="Harga Mutu — Komoditas Daur Ulang"
        subtitle="Harga pembelian per kg berdasarkan tipe sampah bernilai"
        action={
          <Button size="sm" onClick={() => setIsMutuModalOpen(true)} className="gap-2 bg-primary hover:bg-[#015558] border-primary hover:border-[#015558] text-white shadow-sm">
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
          <div className="pt-4 flex justify-end gap-3 border-t border-soft-gray">
            <Button type="button" variant="outline" onClick={() => setIsMutuModalOpen(false)}>Batal</Button>
            <Button type="submit" className="bg-primary hover:bg-[#015558] border-primary text-white">Simpan Komoditas</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Tambah Tarif Residu — 2 dropdown */}
      <Modal
        isOpen={isResiduModalOpen}
        onClose={() => {
          setIsResiduModalOpen(false);
          setSelectedVehicle('');
          setSelectedTarif(0);
        }}
        title="Tambah Tarif Residu"
      >
        <form onSubmit={handleAddResidu} className="space-y-4">
          {/* Field 1: Jenis Kendaraan Bermotor */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-dark">
              Jenis Kendaraan Bermotor
            </label>
            <select
              name="vehicleType"
              required
              value={selectedVehicle}
              onChange={(e) => {
                const v = e.target.value;
                setSelectedVehicle(v);
                if (vehicleTarifDefaults[v]) {
                  setSelectedTarif(vehicleTarifDefaults[v].tarif);
                } else {
                  setSelectedTarif(0);
                }
              }}
              className="w-full rounded-xl border border-soft-gray bg-white px-4 py-2.5 text-sm text-dark outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
            >
              <option value="">— Pilih Jenis Kendaraan —</option>
              {Object.entries(vehicleTarifDefaults).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>

          {/* Field 2: Tarif Residu Kendaraan (editable) */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-dark">
              Tarif Residu Kendaraan
              {selectedVehicle && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  (default: {fmtRupiah(vehicleTarifDefaults[selectedVehicle]?.tarif ?? 0)} / kg)
                </span>
              )}
            </label>
            <select
              value={selectedTarif}
              onChange={(e) => setSelectedTarif(Number(e.target.value))}
              disabled={!selectedVehicle}
              className={cn(
                "w-full rounded-xl border border-soft-gray bg-white px-4 py-2.5 text-sm text-dark outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 transition-all cursor-pointer",
                !selectedVehicle && "opacity-50 cursor-not-allowed"
              )}
            >
              <option value={0}>— Pilih Tarif —</option>
              {tarifPresets.map((t) => (
                <option key={t} value={t}>{fmtRupiah(t)} / kg</option>
              ))}
            </select>

            {/* Manual edit input */}
            <div className="flex items-center gap-2 rounded-xl border border-soft-gray bg-very-light-gray px-4 py-2.5">
              <span className="text-xs text-gray-400 shrink-0">Atau edit manual:</span>
              <span className="text-xs text-gray-500 font-medium shrink-0">Rp</span>
              <input
                type="number"
                value={selectedTarif || ''}
                onChange={(e) => setSelectedTarif(Number(e.target.value))}
                disabled={!selectedVehicle}
                placeholder="Ketik tarif (per kg)..."
                className={cn(
                  "w-full bg-transparent text-sm font-mono tabular-nums text-dark outline-none",
                  !selectedVehicle && "opacity-50 cursor-not-allowed"
                )}
                min={0}
              />
              <span className="text-xs text-gray-400 shrink-0">/ kg</span>
            </div>

            {selectedTarif > 0 && (
              <p className="text-xs text-primary font-medium">
                ✓ Tarif terpilih: {fmtRupiah(selectedTarif)} per kg
              </p>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-soft-gray">
            <Button type="button" variant="outline" onClick={() => {
              setIsResiduModalOpen(false);
              setSelectedVehicle('');
              setSelectedTarif(0);
            }}>Batal</Button>
            <Button
              type="submit"
              disabled={!selectedVehicle || selectedTarif <= 0}
              className="bg-amber-500 hover:bg-amber-600 border-amber-500 text-white disabled:opacity-50"
            >
              Simpan Tarif
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
