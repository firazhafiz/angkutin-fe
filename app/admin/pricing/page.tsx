'use client';

import React, { useState } from 'react';
import { Pencil, Check, X, Trash2, Plus } from 'lucide-react';
import ChartCard from '@/components/admin/ChartCard';
import DataTable, { type Column } from '@/components/admin/DataTable';
import { type PricingRule } from '@/types/models';
import { WasteCategory } from '@/types/enums';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { cn } from '@/lib/cn';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';


const fmtRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? '-' : date.toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit',
  });
};

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
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [editLabel, setEditLabel] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['waste-types'],
    queryFn: adminService.getWasteTypes,
  });

  const wasteTypes = data?.data || [];
  const mutuData = wasteTypes.filter(item => item.category.toString().toUpperCase() === 'MUTU');
  const residuData = wasteTypes.filter(item => item.category.toString().toUpperCase() === 'RESIDU');

  // Mutations
  const createWasteMutation = useMutation({
    mutationFn: adminService.createWasteType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waste-types'] });
      setIsMutuModalOpen(false);
      setIsResiduModalOpen(false);
      toast.success('Harga/Komoditas berhasil ditambahkan');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.response?.data?.error || 'Gagal menambahkan data';
      toast.error(msg);
    },
  });

  const updateWasteMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminService.updateWasteType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waste-types'] });
      setEditingId(null);
      toast.success('Harga berhasil diperbarui');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.response?.data?.error || 'Gagal memperbarui harga';
      toast.error(msg);
    },
  });

  const deleteWasteMutation = useMutation({
    mutationFn: adminService.deleteWasteType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waste-types'] });
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
      toast.success('Data berhasil dihapus');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.response?.data?.error || 'Gagal menghapus data';
      toast.error(msg);
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
    },
  });


  // Modal states
  const [isMutuModalOpen, setIsMutuModalOpen] = useState(false);
  const [isResiduModalOpen, setIsResiduModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'mutu' | 'residu';
    id: string | null;
    label: string;
  }>({
    isOpen: false,
    type: 'mutu',
    id: null,
    label: '',
  });

  // Residu form state
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [selectedTarif, setSelectedTarif] = useState<number>(0);

  // -- Edit Logic
  const startEdit = (id: string, currentPrice: number, currentLabel: string) => {
    setEditingId(id);
    setEditValue(currentPrice);
    setEditLabel(currentLabel);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue(0);
    setEditLabel('');
  };

  const saveMutuEdit = (id: string) => {
    updateWasteMutation.mutate({ 
      id, 
      data: { name: editLabel, unitPrice: editValue } 
    });
  };

  const saveResiduEdit = (id: string) => {
    updateWasteMutation.mutate({ 
      id, 
      data: { unitPrice: editValue } 
    });
  };

  // -- Delete Logic
  const deleteMutu = (id: string, label: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'mutu',
      id,
      label,
    });
  };

  const deleteResidu = (id: string, label: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'residu',
      id,
      label,
    });
  };

  const executeConfirm = () => {
    if (confirmModal.id) {
      deleteWasteMutation.mutate(confirmModal.id);
    }
  };

  // -- Add Mutu Logic
  const handleAddMutu = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createWasteMutation.mutate({
      name: formData.get('name') as string,
      category: 'MUTU',
      unitPrice: Number(formData.get('unitPrice')),
    });
  };

  // -- Add Residu Logic
  const handleAddResidu = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedVehicle || selectedTarif <= 0) return;
    createWasteMutation.mutate({
      name: selectedVehicle,
      category: 'RESIDU',
      unitPrice: selectedTarif,
    });
    setSelectedVehicle('');
    setSelectedTarif(0);
  };

  // -- Columns
  const mutuColumns: Column<PricingRule>[] = [
    {
      key: 'name',
      header: 'Tipe Komoditas',
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-secondary shrink-0" />
          {editingId === item.id ? (
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="w-full rounded-lg border border-primary px-2 py-1 text-sm font-medium text-dark outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Nama komoditas..."
            />
          ) : (
            <span className="font-medium text-dark">{item.name}</span>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Kategori',
      render: (item) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary/10 text-secondary border border-secondary/20 uppercase">
          {item.category}
        </span>
      ),
    },
    {
      key: 'unitPrice',
      header: 'Harga / kg',
      align: 'right',
      numeric: true,
      render: (item) =>
        editingId === item.id ? (
          <div className="flex items-center justify-end">
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(Number(e.target.value))}
              className="w-28 rounded-lg border border-primary px-2 py-1 text-right text-sm font-mono outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
          </div>
        ) : (
          <div className="flex items-center justify-end">
            <span className="font-mono tabular-nums font-semibold text-dark">{fmtRupiah(item.unitPrice)}</span>
          </div>
        ),
    },
    {
      key: 'createdAt',
      header: 'Dibuat',
      align: 'right',
      render: (item) => (
        <span className="text-xs text-gray-400">
          {formatDate(item.createdAt)}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Terakhir Diubah',
      align: 'right',
      render: (item) => (
        <span className="text-xs text-gray-400">
          {formatDate(item.updatedAt)}
        </span>
      ),
    },
    {
      key: 'id' as any,
      header: 'Aksi',
      align: 'center',
      render: (item) => (
        <div className="flex items-center justify-center gap-2">
          {editingId === item.id ? (
            <>
              <button
                onClick={() => saveMutuEdit(item.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white hover:bg-[#015558] transition-all shadow-md"
                title="Simpan"
              >
                <Check size={14} />
              </button>
              <button
                onClick={cancelEdit}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all shadow-sm"
                title="Batal"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => startEdit(item.id, item.unitPrice, item.name)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                title="Edit"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => deleteMutu(item.id, item.name)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                title="Hapus"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const residuColumns: Column<PricingRule>[] = [
    {
      key: 'name',
      header: 'Tipe Kendaraan',
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
          {editingId === item.id ? (
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="w-full rounded-lg border border-amber-500 px-2 py-1 text-sm font-medium text-dark outline-none focus:ring-2 focus:ring-amber-100"
              placeholder="Nama kendaraan..."
            />
          ) : (
            <span className="font-medium text-dark">{vehicleTarifDefaults[item.name]?.label || item.name}</span>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Kategori',
      render: (item) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-600 border border-amber-200 uppercase">
          {item.category}
        </span>
      ),
    },
    {
      key: 'unitPrice',
      header: 'Tarif / kg',
      align: 'right',
      numeric: true,
      render: (item) =>
        editingId === item.id ? (
          <div className="flex items-center justify-end">
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(Number(e.target.value))}
              className="w-28 rounded-lg border border-amber-500 px-2 py-1 text-right text-sm font-mono outline-none focus:ring-2 focus:ring-amber-100"
              autoFocus
            />
          </div>
        ) : (
          <div className="flex items-center justify-end">
            <span className="font-mono tabular-nums font-semibold text-dark">{fmtRupiah(item.unitPrice)}</span>
          </div>
        ),
    },
    {
      key: 'createdAt',
      header: 'Dibuat',
      align: 'right',
      render: (item) => (
        <span className="text-xs text-gray-400">
          {formatDate(item.createdAt)}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Terakhir Diubah',
      align: 'right',
      render: (item) => (
        <span className="text-xs text-gray-400">
          {formatDate(item.updatedAt)}
        </span>
      ),
    },
    {
      key: 'id' as any,
      header: 'Aksi',
      align: 'center',
      render: (item) => (
        <div className="flex items-center justify-center gap-2">
          {editingId === item.id ? (
            <>
              <button
                onClick={() => saveResiduEdit(item.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-md"
                title="Simpan"
              >
                <Check size={14} />
              </button>
              <button
                onClick={cancelEdit}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all shadow-sm"
                title="Batal"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => startEdit(item.id, item.unitPrice, item.name)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                title="Edit"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => deleteResidu(item.id, vehicleTarifDefaults[item.name]?.label || item.name)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                title="Hapus"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
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
          emptyMessage={isLoading ? "Memuat data mutu..." : "Belum ada komoditas mutu"}
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
          emptyMessage={isLoading ? "Memuat data tarif residu..." : "Belum ada tarif residu"}
        />
      </ChartCard>

      {/* Modal Tambah Komoditas Mutu */}
      <Modal
        isOpen={isMutuModalOpen}
        onClose={() => setIsMutuModalOpen(false)}
        title="Tambah Komoditas Mutu"
      >
        <form onSubmit={handleAddMutu} className="space-y-4">
          <Input name="name" label="Nama Komoditas (contoh: Kertas HVS)" required />
          <Input name="unitPrice" type="number" label="Harga per Kg (Rp)" min="0" required />
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

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={executeConfirm}
        title={confirmModal.type === 'mutu' ? 'Hapus Komoditas' : 'Hapus Tarif Residu'}
        message={`Apakah Anda yakin ingin menghapus ${confirmModal.label} secara permanen?`}
        confirmText="Hapus"
        type="danger"
        icon="delete"
        isLoading={deleteWasteMutation.isPending}
      />
    </div>
  );
}
