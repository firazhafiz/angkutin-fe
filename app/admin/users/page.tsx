'use client';

import React, { useState } from 'react';
import { Search, Eye, ShieldCheck, Ban } from 'lucide-react';
import DataTable, { type Column } from '@/components/admin/DataTable';
import { mockUsers, mockCouriers } from '@/services/mock/admin.mock';
import type { User, CourierProfile } from '@/types/models';
import { cn } from '@/lib/cn';

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'couriers'>('users');
  const [search, setSearch] = useState('');

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCouriers = mockCouriers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const ActionButtons = () => (
    <div className="flex items-center justify-center gap-1">
      <button className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="Lihat Detail">
        <Eye size={14} />
      </button>
      <button className="flex h-7 w-7 items-center justify-center rounded-lg text-emerald-400 hover:bg-emerald-50 hover:text-emerald-600" title="Verifikasi">
        <ShieldCheck size={14} />
      </button>
      <button className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600" title="Suspend">
        <Ban size={14} />
      </button>
    </div>
  );

  const userColumns: Column<User>[] = [
    {
      key: 'name', header: 'Nama',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-xs font-bold text-white">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{item.name}</p>
            <p className="text-xs text-gray-400">{item.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'Telepon' },
    {
      key: 'createdAt', header: 'Bergabung',
      render: (item) => (
        <span className="text-xs text-gray-500">
          {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    { key: 'actions', header: 'Aksi', align: 'center', render: () => <ActionButtons /> },
  ];

  const courierColumns: Column<CourierProfile>[] = [
    {
      key: 'name', header: 'Nama Kurir',
      render: (item) => (
        <div className="flex items-center gap-3">
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
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 capitalize">
          {item.vehicleType.replace('_', ' ')}
        </span>
      ),
    },
    { key: 'vehiclePlate', header: 'Plat Nomor' },
    {
      key: 'isOnline', header: 'Status', align: 'center',
      render: (item) => (
        <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold', item.isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400')}>
          <span className={cn('h-1.5 w-1.5 rounded-full', item.isOnline ? 'bg-emerald-500' : 'bg-gray-400')} />
          {item.isOnline ? 'Online' : 'Offline'}
        </span>
      ),
    },
    {
      key: 'rating', header: 'Rating', align: 'center',
      render: (item) => <span className="text-sm font-semibold text-amber-500">⭐ {item.rating}</span>,
    },
    { key: 'totalDeliveries', header: 'Deliveries', align: 'right', render: (item) => <span className="font-medium">{item.totalDeliveries}</span> },
    { key: 'actions', header: 'Aksi', align: 'center', render: () => <ActionButtons /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">Pengguna & Kurir</h2>
        <p className="text-sm text-gray-400">Database pengguna dan kurir terdaftar</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
          {(['users', 'couriers'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn('rounded-lg px-4 py-2 text-sm font-medium transition-all', activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700')}
            >
              {tab === 'users' ? `Pengguna (${mockUsers.length})` : `Kurir (${mockCouriers.length})`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
          <Search size={14} className="text-gray-400" />
          <input type="text" placeholder="Cari nama atau email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-52 bg-transparent text-sm text-gray-600 placeholder:text-gray-400 outline-none" />
        </div>
      </div>

      {activeTab === 'users' ? (
        <DataTable columns={userColumns} data={filteredUsers} keyExtractor={(i) => i.id} emptyMessage="Tidak ada pengguna ditemukan" />
      ) : (
        <DataTable columns={courierColumns} data={filteredCouriers} keyExtractor={(i) => i.id} emptyMessage="Tidak ada kurir ditemukan" />
      )}
    </div>
  );
}
