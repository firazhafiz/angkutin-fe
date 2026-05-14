'use client';

import React, { useState } from 'react';
import { Search, Eye, Ban, Trash2, CheckCircle2 } from 'lucide-react';
import DataTable, { type Column } from '@/components/admin/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import type { UserProfile } from '@/types/api';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: adminService.getAllUsers,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: 'ACTIVE' | 'SUSPENDED' } }) => adminService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Status pengguna berhasil diperbarui');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.response?.data?.error || 'Gagal memperbarui status';
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsDetailModalOpen(false);
      toast.success('Pengguna berhasil dihapus');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.response?.data?.error || 'Gagal menghapus pengguna';
      toast.error(msg);
    },
  });

  const users = data?.data || [];
  
  // Only display users with role USER
  const filteredUsers = users.filter((u) => {
    if (u.role !== 'USER') return false;
    const searchLower = search.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(searchLower) ||
      (u.email || '').toLowerCase().includes(searchLower) ||
      (u.phone || '').toLowerCase().includes(searchLower)
    );
  });

  const handleViewDetail = (user: UserProfile) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleToggleStatus = (user: UserProfile) => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (confirm(`Apakah Anda yakin ingin mengubah status ${user.name} menjadi ${newStatus}?`)) {
      updateMutation.mutate({ id: user.id, data: { status: newStatus } });
    }
  };

  const handleDelete = (user: UserProfile) => {
    if (confirm(`Apakah Anda yakin ingin menghapus ${user.name} secara permanen? Data yang terkait juga akan dihapus.`)) {
      deleteMutation.mutate(user.id);
    }
  };

  const ActionButtons = ({ user }: { user: UserProfile }) => (
    <div className="flex items-center justify-center gap-1">
      <button 
        onClick={() => handleViewDetail(user)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors" 
        title="Lihat Detail"
      >
        <Eye size={14} />
      </button>
      <button 
        onClick={() => handleToggleStatus(user)}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
          user.status === 'ACTIVE' 
            ? "text-red-400 hover:bg-red-50 hover:text-red-600" 
            : "text-emerald-400 hover:bg-emerald-50 hover:text-emerald-600"
        )} 
        title={user.status === 'ACTIVE' ? "Suspend Akun" : "Aktifkan Akun"}
      >
        {user.status === 'ACTIVE' ? <Ban size={14} /> : <CheckCircle2 size={14} />}
      </button>
      <button 
        onClick={() => handleDelete(user)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" 
        title="Hapus Permanen"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );

  const userColumns: Column<UserProfile>[] = [
    {
      key: 'name', header: 'Nama',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-xs font-bold text-white uppercase">
            {item.name ? item.name.charAt(0) : '?'}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{item.name}</p>
            <p className="text-xs text-gray-400">{item.email}</p>
          </div>
        </div>
      ),
    },
    { 
      key: 'phone', header: 'Telepon',
      render: (item) => <span className="text-sm text-gray-600">{item.phone || '-'}</span>
    },
    {
      key: 'status', header: 'Status', align: 'center',
      render: (item) => (
        <span className={cn(
          "px-2.5 py-0.5 rounded-full text-xs font-medium",
          item.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {item.status === 'ACTIVE' ? 'Aktif' : 'Suspended'}
        </span>
      )
    },
    {
      key: 'orders', header: 'Total Pesanan', align: 'center',
      render: (item) => <span className="text-sm font-medium text-gray-600">{item._count?.orders || 0}</span>
    },
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
          <p className="text-sm text-gray-500">Kelola dan pantau aktivitas pengguna (Customer) aplikasi Angkutin</p>
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
          emptyMessage={isLoading ? "Memuat data..." : isError ? "Gagal memuat data" : "Tidak ada pengguna ditemukan"} 
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
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-2xl font-bold text-white shadow-md uppercase">
                {selectedUser.name ? selectedUser.name.charAt(0) : '?'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
                <div className="mt-1 flex gap-2">
                  <span className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium uppercase",
                    selectedUser.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                  )}>
                    {selectedUser.status}
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
                <p className="mt-1 font-medium text-gray-900">{selectedUser.phone || '-'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Tanggal Bergabung</span>
                <p className="mt-1 font-medium text-gray-900">
                  {new Date(selectedUser.createdAt).toLocaleDateString('id-ID', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Pesanan</span>
                <p className="mt-1 font-medium text-gray-900">{selectedUser._count?.orders || 0} Pesanan</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Status Verifikasi</span>
                <p className="mt-1 font-medium text-gray-900">{selectedUser.isVerified ? 'Terverifikasi' : 'Belum Verifikasi'}</p>
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
