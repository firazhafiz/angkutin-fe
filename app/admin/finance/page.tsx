'use client';

import React, { useState } from 'react';
import { Check, X, Search, FileText, Loader2 } from 'lucide-react';
import DataTable, { type Column } from '@/components/admin/DataTable';
import ChartCard from '@/components/admin/ChartCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { AdminTransaction, AdminWithdrawal } from '@/types/api';
import { toast } from 'sonner';

const fmtRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function FinancePage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<'withdrawals' | 'transactions'>('withdrawals');
  const [search, setSearch] = useState('');

  // Modals
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<AdminWithdrawal | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Queries
  const { data: withdrawalsData, isLoading: isLoadingWithdrawals } = useQuery({
    queryKey: ['admin', 'withdrawals'],
    queryFn: () => adminService.getWithdrawals(),
  });

  const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['admin', 'transactions'],
    queryFn: () => adminService.getTransactions(),
  });

  // Mutations
  const approveMutation = useMutation({
    mutationFn: (id: string) => adminService.approveWithdrawal(id),
    onSuccess: () => {
      toast.success('Penarikan dana berhasil disetujui');
      queryClient.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'transactions'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal menyetujui penarikan');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string, reason: string }) =>
      adminService.rejectWithdrawal(id, { reason }),
    onSuccess: () => {
      toast.error('Penarikan dana berhasil ditolak');
      setRejectModalOpen(false);
      setSelectedWithdrawal(null);
      setRejectReason('');
      queryClient.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'transactions'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal menolak penarikan');
    }
  });

  const withdrawals = withdrawalsData?.data || [];
  const transactions = transactionsData?.data || [];

  // Filters — withdrawals: hanya PENDING & PROCESS, transactions: hanya SUCCESS & FAILED
  const filteredWithdrawals = withdrawals
    .filter((w) => w.status === 'PENDING' || w.status === 'PROCESS')
    .filter((w) =>
      (w.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (w.method || "").toLowerCase().includes(search.toLowerCase())
    );

  const filteredTransactions = transactions
    .filter((t) => t.status === 'SUCCESS' || t.status === 'FAILED')
    .filter((t) =>
      (t.wallet?.user?.name || "").toLowerCase().includes(search.toLowerCase())
    );

  // Actions
  const handleApprove = (id: string) => {
    if (confirm('Approve penarikan dana ini? Pastikan Anda sudah melakukan transfer secara manual jika diperlukan.')) {
      approveMutation.mutate(id);
    }
  };

  const openRejectModal = (withdrawal: AdminWithdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWithdrawal && rejectReason) {
      rejectMutation.mutate({ id: selectedWithdrawal.id, reason: rejectReason });
    }
  };

  const withdrawalColumns: Column<AdminWithdrawal>[] = [
    {
      key: 'user', header: 'Pengguna',
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-dark">{item.user?.name || "User tidak ditemukan"}</span>
          <span className="text-[10px] text-gray-400">{item.user?.email || "-"}</span>
        </div>
      ),
    },
    {
      key: 'amount', header: 'Jumlah', align: 'right', numeric: true,
      render: (item) => <span className="font-bold text-dark">{fmtRupiah(item.amount)}</span>,
    },
    {
      key: 'method', header: 'Metode',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-dark">{item.method}</span>
          <span className="text-[10px] text-gray-500">{item.accountName}</span>
        </div>
      )
    },
    { key: 'accountNumber', header: 'No. Rekening', render: (item) => <span className="font-mono text-xs">{item.accountNumber}</span> },
    {
      key: 'status', header: 'Status', align: 'center',
      render: (item) => {
        const styles: Record<string, string> = {
          PENDING: 'bg-amber-50 text-amber-600 border-amber-200',
          PROCESS: 'bg-blue-50 text-blue-600 border-blue-200',
        };
        return (
          <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border',
            styles[item.status] || 'bg-gray-50 text-gray-600 border-gray-200'
          )}>
            {item.status === 'PENDING' ? 'Menunggu' : item.status === 'PROCESS' ? 'Diproses' : item.status}
          </span>
        );
      },
    },
    {
      key: 'createdAt', header: 'Waktu',
      render: (item) => <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>,
    },
    {
      key: 'id' as any, header: 'Aksi', align: 'center',
      render: (item) =>
        item.status === 'PENDING' ? (
          <div className="flex justify-center gap-1">
            <button
              onClick={() => handleApprove(item.id)}
              disabled={approveMutation.isPending}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-white hover:bg-[#047857] shadow-sm disabled:opacity-50"
              title="Approve"
            >
              {approveMutation.isPending && approveMutation.variables === item.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            </button>
            <button
              onClick={() => openRejectModal(item)}
              disabled={rejectMutation.isPending}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-sm disabled:opacity-50"
              title="Reject"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <span className="text-[10px] text-gray-400 italic">Sedang diproses</span>
        ),
    },
  ];

  const transactionColumns: Column<AdminTransaction>[] = [
    {
      key: 'user', header: 'Pengguna',
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-dark">{item.wallet?.user?.name || "User tidak ditemukan"}</span>
          <span className="text-[10px] text-gray-400">{item.wallet?.user?.email || "-"}</span>
        </div>
      ),
    },
    {
      key: 'amount', header: 'Jumlah', align: 'right', numeric: true,
      render: (item) => (
        <span className={cn("font-bold", item.amount > 0 ? "text-secondary" : "text-red-500")}>
          {item.amount > 0 ? '+' : ''}{fmtRupiah(item.amount)}
        </span>
      ),
    },
    {
      key: 'type', header: 'Tipe',
      render: (item) => (
        <div className="flex flex-col">
          <span className={cn(
            "text-sm font-medium",
            item.type === 'CREDIT' ? "text-green-600" :
              item.type === 'DEBIT' ? "text-red-600" :
                "text-gray-600"
          )}>
            {item.type === 'CREDIT' ? 'Credit' :
              item.type === 'DEBIT' ? 'Debit' :
                item.type}
          </span>
          <span className="text-[10px] text-gray-500 line-clamp-1">{item.description || item.referenceType || '-'}</span>
        </div>
      ),
    },
    {
      key: 'status', header: 'Status', align: 'center',
      render: (item) => {
        const styles: Record<string, string> = {
          SUCCESS: 'bg-[#d1fae5] text-secondary border-[#a7f3d0]',
          FAILED: 'bg-red-50 text-red-500 border-red-200',
        };
        return (
          <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border',
            styles[item.status] || 'bg-gray-50 text-gray-600 border-gray-200'
          )}>
            {item.status === 'SUCCESS' ? 'Berhasil' : item.status === 'FAILED' ? 'Gagal' : item.status}
          </span>
        );
      },
    },
    {
      key: 'createdAt', header: 'Waktu',
      render: (item) => <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-dark">Keuangan</h2>
          <p className="text-sm text-gray-500">Kelola persetujuan penarikan saldo dan riwayat transaksi</p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-soft-gray bg-white px-3 py-2 w-full md:w-64">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-600 placeholder:text-gray-400 outline-none"
          />
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 rounded-xl bg-soft-gray p-1 w-fit">
        <button
          onClick={() => setTab('withdrawals')}
          className={cn('rounded-lg px-4 py-2 text-sm font-medium transition-all', tab === 'withdrawals' ? 'bg-white text-dark shadow-sm' : 'text-gray-500 hover:text-dark')}
        >
          Penarikan Saldo
        </button>
        <button
          onClick={() => setTab('transactions')}
          className={cn('rounded-lg px-4 py-2 text-sm font-medium transition-all', tab === 'transactions' ? 'bg-white text-dark shadow-sm' : 'text-gray-500 hover:text-dark')}
        >
          Riwayat Transaksi
        </button>
      </div>

      {tab === 'withdrawals' ? (
        <ChartCard title="Antrean Approval Penarikan" subtitle="Permintaan penarikan saldo In-App Wallet yang menunggu persetujuan">
          <DataTable
            columns={withdrawalColumns}
            data={filteredWithdrawals}
            keyExtractor={(i) => i.id}
            emptyMessage="Tidak ada antrean penarikan"
            loading={isLoadingWithdrawals}
          />
        </ChartCard>
      ) : (
        <ChartCard title="Riwayat Transaksi Global" subtitle="Seluruh mutasi saldo yang terjadi di sistem">
          <DataTable
            columns={transactionColumns}
            data={filteredTransactions}
            keyExtractor={(i) => i.id}
            emptyMessage="Tidak ada riwayat transaksi"
            loading={isLoadingTransactions}
          />
        </ChartCard>
      )}

      {/* Modal Reject Withdrawal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Tolak Penarikan Dana"
      >
        <form onSubmit={handleRejectSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">
            Anda akan menolak permintaan penarikan dana sebesar <strong className="text-dark">{selectedWithdrawal && fmtRupiah(selectedWithdrawal.amount)}</strong> dari <strong className="text-dark">{selectedWithdrawal?.user?.name || "User tidak ditemukan"}</strong>.
          </p>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-dark">Alasan Penolakan</label>
            <textarea
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Contoh: Nomor rekening tidak valid atau nama tidak sesuai"
              className="w-full rounded-xl border border-soft-gray bg-white px-4 py-3 text-sm text-dark outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all min-h-[100px]"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-soft-gray">
            <Button type="button" variant="outline" onClick={() => setRejectModalOpen(false)}>Batal</Button>
            <Button
              type="submit"
              className="bg-red-500 hover:bg-red-600 border-red-500 text-white"
              disabled={rejectMutation.isPending || !rejectReason}
            >
              {rejectMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Konfirmasi Penolakan'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
