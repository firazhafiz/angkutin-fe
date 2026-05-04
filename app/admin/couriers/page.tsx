'use client';

import React, { useState } from 'react';
import { Search, Eye, Ban, Plus, Trash2, Pencil, Star, RefreshCcw, Truck } from 'lucide-react';
import DataTable, { type Column } from '@/components/admin/DataTable';
import { mockCouriers } from '@/services/mock/admin.mock';
import type { CourierProfile } from '@/types/models';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/cn';

// Extend CourierProfile locally for suspended state if not in models
interface ExtendedCourier extends CourierProfile {
  isSuspended?: boolean;
}

export default function CouriersPage() {
  const [search, setSearch] = useState('');
  const [couriers, setCouriers] = useState<ExtendedCourier[]>(mockCouriers);

  // Modals state
  const [selectedCourier, setSelectedCourier] = useState<ExtendedCourier | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Filter couriers based on search
  const filteredCouriers = couriers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.vehiclePlate.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewDetail = (courier: ExtendedCourier) => {
    setSelectedCourier(courier);
    setIsDetailModalOpen(true);
  };

  const openAddForm = () => {
    setSelectedCourier(null);
    setIsEditMode(false);
    setIsFormModalOpen(true);
  };

  const openEditForm = (courier: ExtendedCourier) => {
    setSelectedCourier(courier);
    setIsEditMode(true);
    setIsFormModalOpen(true);
  };

  const toggleSuspend = (id: string) => {
    setCouriers((prev) =>
      prev.map(c => c.id === id ? { ...c, isSuspended: !c.isSuspended } : c)
    );
    if (selectedCourier?.id === id) {
      setSelectedCourier(prev => prev ? { ...prev, isSuspended: !prev.isSuspended } : prev);
    }
  };

  const ActionButtons = ({ courier }: { courier: ExtendedCourier }) => {
    if (courier.isSuspended) {
      return (
        <div className="flex items-center justify-center">
          <button
            onClick={() => toggleSuspend(courier.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors border border-emerald-100 shadow-sm"
            title="Unsuspend Kurir"
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-1">
        <button
          onClick={() => handleViewDetail(courier)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          title="Lihat Detail"
        >
          <Eye size={14} />
        </button>
        <button
          onClick={() => openEditForm(courier)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
          title="Edit Data"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => toggleSuspend(courier.id)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          title="Suspend"
        >
          <Ban size={14} />
        </button>
        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="Hapus">
          <Trash2 size={14} />
        </button>
      </div>
    );
  };

  const courierColumns: Column<ExtendedCourier>[] = [
    {
      key: 'name', header: 'Nama Kurir',
      render: (item) => (
        <div className={cn("flex items-center gap-3", item.isSuspended && "opacity-40 grayscale")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-xs font-bold text-white">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{item.name}</p>
            <p className="text-xs text-gray-400">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'vehicleType', header: 'Kendaraan',
      render: (item) => (
        <span className={cn("rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 capitalize", item.isSuspended && "opacity-40 grayscale")}>
          {item.vehicleType.replace('_', ' ')}
        </span>
      ),
    },
    { key: 'vehiclePlate', header: 'Plat Nomor', render: (item) => <span className={cn("font-medium", item.isSuspended && "opacity-40 grayscale")}>{item.vehiclePlate}</span> },
    {
      key: 'isOnline', header: 'Status', align: 'center',
      render: (item) => {
        if (item.isSuspended) {
          return <span className="rounded-full bg-gray-200 border border-gray-300 px-2.5 py-0.5 text-xs font-semibold text-gray-600">Suspended</span>;
        }
        return (
          <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold', item.isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400')}>
            <span className={cn('h-1.5 w-1.5 rounded-full', item.isOnline ? 'bg-emerald-500' : 'bg-gray-400')} />
            {item.isOnline ? 'Online' : 'Offline'}
          </span>
        );
      },
    },
    {
      key: 'rating', header: 'Rating', align: 'center',
      render: (item) => (
        <span className={cn("flex items-center justify-center gap-1 text-sm font-bold text-amber-500", item.isSuspended && "opacity-40 grayscale")}>
          <Star size={14} className="fill-amber-500 text-amber-500" /> {item.rating}
        </span>
      ),
    },
    { key: 'totalDeliveries', header: 'Deliveries', align: 'right', render: (item) => <span className={cn("font-medium text-gray-900", item.isSuspended && "opacity-40 grayscale")}>{item.totalDeliveries}</span> },
    { key: 'actions', header: 'Aksi', align: 'center', render: (item) => <ActionButtons courier={item} /> },
  ];

  // Form Submit (Add / Edit)
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (isEditMode && selectedCourier) {
      setCouriers(prev => prev.map(c => c.id === selectedCourier.id ? {
        ...c,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        vehicleType: formData.get('vehicleType') as any,
        vehiclePlate: formData.get('vehiclePlate') as string,
      } : c));
    } else {
      const newCourier: ExtendedCourier = {
        id: `courier-${Date.now()}`,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        role: 'courier' as any,
        createdAt: new Date().toISOString(),
        vehicleType: formData.get('vehicleType') as any,
        vehiclePlate: formData.get('vehiclePlate') as string,
        isOnline: false,
        rating: 0,
        totalDeliveries: 0,
        isSuspended: false,
      };
      setCouriers([newCourier, ...couriers]);
    }
    setIsFormModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Daftar Kurir</h2>
          <p className="text-sm text-gray-500">Kelola data kurir yang bertugas menjemput sampah</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 w-full sm:w-auto">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, email, plat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-52 bg-transparent text-sm text-gray-600 placeholder:text-gray-400 outline-none"
            />
          </div>
          <Button
            onClick={openAddForm}
            className="w-full sm:w-auto gap-2"
          >
            <Plus size={16} />
            Tambah Kurir
          </Button>
        </div>
      </div>

      {/* Courier Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <DataTable
          columns={courierColumns}
          data={filteredCouriers}
          keyExtractor={(i) => i.id}
          emptyMessage="Tidak ada kurir ditemukan"
        />
      </div>

      {/* Form Courier Modal (Add/Edit) */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={isEditMode ? "Edit Data Kurir" : "Tambah Kurir Baru"}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input name="name" label="Nama Lengkap" defaultValue={selectedCourier?.name} placeholder="Budi Santoso" required />
            <Input name="phone" label="No. Telepon" defaultValue={selectedCourier?.phone} placeholder="081234567890" required />
          </div>
          <Input name="email" type="email" label="Alamat Email" defaultValue={selectedCourier?.email} placeholder="budi@angkutin.id" required />

          {!isEditMode && (
            <Input name="password" type="password" label="Password Sementara" placeholder="••••••••" required />
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-900">Tipe Kendaraan</label>
              <select
                name="vehicleType"
                required
                defaultValue={selectedCourier?.vehicleType}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              >
                <option value="MOTOR">Motor</option>
                <option value="MOBIL_PICKUP">Mobil Pickup</option>
                <option value="TRUK_KECIL">Truk Kecil</option>
              </select>
            </div>
            <Input name="vehiclePlate" label="Plat Nomor" defaultValue={selectedCourier?.vehiclePlate} placeholder="B 1234 XYZ" required />
          </div>

          <div className="pt-4 mt-2 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setIsFormModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit">
              {isEditMode ? "Simpan Perubahan" : "Simpan Data Kurir"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Courier Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detail Profil Kurir"
        maxWidth="max-w-2xl"
      >
        {selectedCourier && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center gap-5 border-b border-gray-100 pb-5">
              <div className={cn("flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold text-white shadow-md",
                selectedCourier.isSuspended ? "bg-gray-400" : "bg-gradient-to-br from-blue-400 to-indigo-500")}>
                {selectedCourier.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">{selectedCourier.name}</h3>
                  {selectedCourier.isSuspended ? (
                    <span className="rounded-full bg-red-50 border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-500">
                      Suspended
                    </span>
                  ) : (
                    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', selectedCourier.isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500')}>
                      <span className={cn('h-1.5 w-1.5 rounded-full', selectedCourier.isOnline ? 'bg-emerald-500' : 'bg-gray-400')} />
                      {selectedCourier.isOnline ? 'Sedang Online' : 'Offline'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{selectedCourier.email}</p>
                <div className="mt-2 flex gap-3 text-sm">
                  <span className="flex items-center gap-1 font-bold text-gray-700">
                    <Star size={14} className="fill-amber-500 text-amber-500" /> {selectedCourier.rating} Rating
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="font-medium text-gray-700">
                    {selectedCourier.totalDeliveries} Pengiriman Selesai
                  </span>
                </div>
              </div>
            </div>

            {/* Stats / Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-500">Tipe Kendaraan</span>
                <p className="mt-1 font-bold text-gray-900 capitalize">{selectedCourier.vehicleType.replace('_', ' ')}</p>
              </div>
              <div className="rounded-xl bg-indigo-50 p-4 border border-indigo-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">Plat Nomor</span>
                <p className="mt-1 font-bold text-gray-900">{selectedCourier.vehiclePlate}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">No. Telepon</span>
                <p className="mt-1 font-bold text-gray-900">{selectedCourier.phone}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Bergabung</span>
                <p className="mt-1 font-bold text-gray-900">
                  {new Date(selectedCourier.createdAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Dummy Mock History for Demo */}
            <div>
              <h4 className="mb-3 text-sm font-bold text-gray-900 flex justify-between items-center">
                <span>Histori Misi Terakhir</span>
                <button className="text-xs text-primary hover:underline font-semibold">Lihat Semua</button>
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 rounded-xl border border-gray-100 text-sm hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600">
                      <Truck size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Penjemputan #ORD-120</p>
                      <p className="text-xs text-gray-500">Jl. Merdeka Raya No. 45</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600">+ Rp 12.500</p>
                    <p className="text-xs text-gray-400">Hari ini, 14:30</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              {selectedCourier.isSuspended ? (
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600 border-emerald-500 text-white gap-2"
                  onClick={() => {
                    toggleSuspend(selectedCourier.id);
                  }}
                >
                  <RefreshCcw size={16} /> Unsuspend Akun
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200"
                  onClick={() => {
                    toggleSuspend(selectedCourier.id);
                  }}
                >
                  Suspend Akun
                </Button>
              )}
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                Tutup
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
