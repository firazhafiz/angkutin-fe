'use client';

import React, { useState } from 'react';
import { Check, X, Search, FileText } from 'lucide-react';
import DataTable, { type Column } from '@/components/admin/DataTable';
import ChartCard from '@/components/admin/ChartCard';
import { mockWithdrawals, mockGatewayLogs, type WithdrawalRequest, type GatewayTransaction } from '@/services/mock/admin.mock';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

const fmtRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function FinancePage() {
  const [tab, setTab] = useState<'withdrawals' | 'gateway'>('withdrawals');

  const [withdrawals, setWithdrawals] = useState(mockWithdrawals);
  const [search, setSearch] = useState('');

  // Modals
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);

  // Filters
  const filteredWithdrawals = withdrawals.filter((w) =>
    w.userName.toLowerCase().includes(search.toLowerCase()) ||
    w.provider.toLowerCase().includes(search.toLowerCase())
  );

  const filteredGateway = mockGatewayLogs.filter((g) =>
    g.userName.toLowerCase().includes(search.toLowerCase()) ||
    g.orderId.toLowerCase().includes(search.toLowerCase())
  );

  // Actions
  const handleApprove = (id: string) => {
    if (confirm('Approve penarikan dana ini? Dana akan dianggap sudah ditransfer.')) {
      setWithdrawals((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
      );
    }
  };

  const openRejectModal = (withdrawal: WithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal);
    setRejectModalOpen(true);
  };

  const handleReject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedWithdrawal) {
      setWithdrawals((prev) =>
        prev.map((item) => (item.id === selectedWithdrawal.id ? { ...item, status: 'rejected' } : item))
      );
      setRejectModalOpen(false);
      setSelectedWithdrawal(null);
    }
  };

  const withdrawalColumns: Column<WithdrawalRequest>[] = [
    {
      key: 'userName', header: 'Pengguna',
      render: (item) => <span className="font-semibold text-dark">{item.userName}</span>,
    },
    {
      key: 'amount', header: 'Jumlah', align: 'right', numeric: true,
      render: (item) => <span className="font-bold text-dark">{fmtRupiah(item.amount)}</span>,
    },
    { key: 'provider', header: 'Provider' },
    { key: 'accountNumber', header: 'No. Akun', render: (item) => <span className="font-mono text-sm">{item.accountNumber}</span> },
    {
      key: 'status', header: 'Status', align: 'center',
      render: (item) => {
        const styles: Record<string, string> = {
          pending: 'bg-amber-50 text-amber-600 border-amber-200',
          approved: 'bg-[#d1fae5] text-secondary border-[#a7f3d0]',
          rejected: 'bg-red-50 text-red-500 border-red-200',
        };
        return (
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border',
            styles[item.status]
          )}>
            {item.status}
          </span>
        );
      },
    },
    {
      key: 'requestedAt', header: 'Waktu',
      render: (item) => <span className="text-xs text-gray-400">{new Date(item.requestedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>,
    },
    {
      key: 'actions', header: 'Aksi', align: 'center',
      render: (item) =>
        item.status === 'pending' ? (
          <div className="flex justify-center gap-1">
            <button onClick={() => handleApprove(item.id)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-white hover:bg-[#047857] shadow-sm" title="Approve">
              <Check size={14} />
            </button>
            <button onClick={() => openRejectModal(item)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-sm" title="Reject">
              <X size={14} />
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-300 flex justify-center"><FileText size={16} /></span>
        ),
    },
  ];

  const gatewayColumns: Column<GatewayTransaction>[] = [
    {
      key: 'orderId', header: 'Order ID',
      render: (item) => <span className="font-mono text-xs font-medium text-gray-600">{item.orderId}</span>,
    },
    {
      key: 'userName', header: 'Pengguna',
      render: (item) => <span className="font-semibold text-dark">{item.userName}</span>,
    },
    {
      key: 'method', header: 'Metode', align: 'center',
      render: (item) => (
        <span className="rounded-full border border-primary/20 bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary uppercase">
          {item.method}
        </span>
      ),
    },
    {
      key: 'amount', header: 'Jumlah', align: 'right', numeric: true,
      render: (item) => <span className="font-bold text-dark">{fmtRupiah(item.amount)}</span>,
    },
    {
      key: 'status', header: 'Status', align: 'center',
      render: (item) => {
        const styles: Record<string, string> = {
          success: 'bg-[#d1fae5] text-secondary border-[#a7f3d0]',
          failed: 'bg-red-50 text-red-500 border-red-200',
        };
        return (
          <span className={cn('rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize', styles[item.status])}>
            {item.status}
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
          <p className="text-sm text-gray-500">Kelola persetujuan penarikan saldo dan log transaksi</p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-soft-gray bg-white px-3 py-2 w-full md:w-64">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-600 placeholder:text-gray-400 outline-none"
          />
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 rounded-xl bg-soft-gray p-1 w-fit">
        {(['withdrawals', 'gateway'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn('rounded-lg px-4 py-2 text-sm font-medium transition-all', tab === key ? 'bg-white text-dark shadow-sm' : 'text-gray-500 hover:text-dark')}
          >
            {key === 'withdrawals' ? 'Penarikan Saldo' : 'Payment Gateway'}
          </button>
        ))}
      </div>

      {tab === 'withdrawals' ? (
        <ChartCard title="Antrean Approval Penarikan" subtitle="Permintaan penarikan saldo In-App Wallet yang menunggu persetujuan">
          <DataTable columns={withdrawalColumns} data={filteredWithdrawals} keyExtractor={(i) => i.id} emptyMessage="Tidak ada antrean penarikan" />
        </ChartCard>
      ) : (
        <ChartCard title="Log Mutasi Payment Gateway" subtitle="Riwayat pembayaran QRIS dari pengguna">
          <DataTable columns={gatewayColumns} data={filteredGateway} keyExtractor={(i) => i.id} emptyMessage="Tidak ada log transaksi" />
        </ChartCard>
      )}

      {/* Modal Reject Withdrawal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Tolak Penarikan Dana"
      >
        <form onSubmit={handleReject} className="space-y-4">
          <p className="text-sm text-gray-600">
            Anda akan menolak permintaan penarikan dana sebesar <strong className="text-dark">{selectedWithdrawal && fmtRupiah(selectedWithdrawal.amount)}</strong> dari <strong className="text-dark">{selectedWithdrawal?.userName}</strong>.
          </p>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-dark">Alasan Penolakan</label>
            <textarea
              required
              placeholder="Contoh: Nomor rekening tidak valid"
              className="w-full rounded-xl border border-soft-gray bg-white px-4 py-3 text-sm text-dark outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all min-h-[100px]"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-soft-gray">
            <Button type="button" variant="outline" onClick={() => setRejectModalOpen(false)}>Batal</Button>
            <Button type="submit" className="bg-red-500 hover:bg-red-600 border-red-500 text-white">Konfirmasi Penolakan</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
