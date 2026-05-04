'use client';

import React, { useState } from 'react';
import { Search, Eye, ShieldCheck, Ban, Trash2 } from 'lucide-react';
import DataTable, { type Column } from '@/components/admin/DataTable';
import { mockUsers } from '@/services/mock/admin.mock';
import type { User } from '@/types/models';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter users based on search
  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewDetail = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const ActionButtons = ({ user }: { user: User }) => (
    <div className="flex items-center justify-center gap-1">
      <button 
        onClick={() => handleViewDetail(user)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors" 
        title="Lihat Detail"
      >
        <Eye size={14} />
      </button>
      <button className="flex h-7 w-7 items-center justify-center rounded-lg text-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors" title="Verifikasi">
        <ShieldCheck size={14} />
      </button>
      <button className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Suspend/Ban">
        <Ban size={14} />
      </button>
      <button className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="Hapus">
        <Trash2 size={14} />
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
    { key: 'actions', header: 'Aksi', align: 'center', render: (item) => <ActionButtons user={item} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Pengguna Terdaftar</h2>
          <p className="text-sm text-gray-500">Kelola dan pantau aktivitas pengguna aplikasi Angkutin</p>
        </div>
        
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 w-full md:w-auto">
          <Search size={14} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari nama atau email..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full md:w-52 bg-transparent text-sm text-gray-600 placeholder:text-gray-400 outline-none" 
          />
        </div>
      </div>

      {/* User Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <DataTable 
          columns={userColumns} 
          data={filteredUsers} 
          keyExtractor={(i) => i.id} 
          emptyMessage="Tidak ada pengguna ditemukan" 
        />
      </div>

      {/* User Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detail Profil Pengguna"
        maxWidth="max-w-xl"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-2xl font-bold text-white shadow-md">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
                <div className="mt-1 flex gap-2">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600 capitalize">
                    {selectedUser.role}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center">
                    ID: {selectedUser.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gray-50 p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">No. Telepon</span>
                <p className="mt-1 font-medium text-gray-900">{selectedUser.phone}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Tanggal Bergabung</span>
                <p className="mt-1 font-medium text-gray-900">
                  {new Date(selectedUser.createdAt).toLocaleDateString('id-ID', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Dummy Mock Details for Demo */}
            <div>
              <h4 className="mb-3 text-sm font-bold text-gray-900">Aktivitas Terakhir</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 rounded-lg border border-gray-100 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="text-gray-600">Menyelesaikan pesanan #ORD-009</span>
                  </div>
                  <span className="text-gray-400 text-xs">2 jam lalu</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg border border-gray-100 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-400"></div>
                    <span className="text-gray-600">Menambahkan metode pembayaran</span>
                  </div>
                  <span className="text-gray-400 text-xs">1 hari lalu</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
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
