'use client';

import React, { useState } from 'react';
import { Check, X, ExternalLink } from 'lucide-react';
import DataTable, { type Column } from '@/components/admin/DataTable';
import ChartCard from '@/components/admin/ChartCard';
import { mockWithdrawals, mockGatewayLogs, type WithdrawalRequest, type GatewayTransaction } from '@/services/mock/admin.mock';
import { cn } from '@/lib/cn';

// ──────────────────────────────────────────────────────────
// Finance & Dispute Log — Item 36 dari PRD
// Tab 1: Withdrawal Approval Queue
// Tab 2: Payment Gateway Log (QRIS/VA dari Skenario B & C)
// ──────────────────────────────────────────────────────────

const fmtRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function FinancePage() {
  const [tab, setTab] = useState<'withdrawals' | 'gateway'>('withdrawals');

  const withdrawalColumns: Column<WithdrawalRequest>[] = [
    {
      key: 'userName', header: 'Pengguna',
      render: (item) => <span className="font-semibold text-gray-900">{item.userName}</span>,
    },
    {
      key: 'amount', header: 'Jumlah', align: 'right',
      render: (item) => <span className="font-bold text-gray-900">{fmtRupiah(item.amount)}</span>,
    },
    { key: 'provider', header: 'Provider' },
    { key: 'accountNumber', header: 'No. Akun' },
    {
      key: 'status', header: 'Status', align: 'center',
      render: (item) => {
        const styles: Record<string, string> = {
          pending: 'bg-amber-50 text-amber-600',
          approved: 'bg-emerald-50 text-emerald-600',
          rejected: 'bg-red-50 text-red-500',
        };
        return (
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', styles[item.status])}>
            {item.status}
          </span>
        );
      },
    },
    {
      key: 'requestedAt', header: 'Waktu',
      render: (item) => <span className="text-xs text-gray-400">{new Date(item.requestedAt).toLocaleString('id-ID')}</span>,
    },
    {
      key: 'actions', header: 'Aksi', align: 'center',
      render: (item) =>
        item.status === 'pending' ? (
          <div className="flex justify-center gap-1">
            <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600" title="Approve">
              <Check size={14} />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600" title="Reject">
              <X size={14} />
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        ),
    },
  ];

  const gatewayColumns: Column<GatewayTransaction>[] = [
    {
      key: 'orderId', header: 'Order ID',
      render: (item) => <span className="font-mono text-xs text-gray-600">{item.orderId}</span>,
    },
    {
      key: 'userName', header: 'Pengguna',
      render: (item) => <span className="font-semibold text-gray-900">{item.userName}</span>,
    },
    {
      key: 'method', header: 'Metode', align: 'center',
      render: (item) => (
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 uppercase">
          {item.method}
        </span>
      ),
    },
    {
      key: 'amount', header: 'Jumlah', align: 'right',
      render: (item) => <span className="font-bold text-gray-900">{fmtRupiah(item.amount)}</span>,
    },
    {
      key: 'scenario', header: 'Skenario', align: 'center',
      render: (item) => (
        <span className={cn('rounded-full px-2 py-0.5 text-xs font-bold', item.scenario === 'B' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600')}>
          {item.scenario}
        </span>
      ),
    },
    {
      key: 'status', header: 'Status', align: 'center',
      render: (item) => {
        const styles: Record<string, string> = {
          pending: 'bg-amber-50 text-amber-600',
          success: 'bg-emerald-50 text-emerald-600',
          failed: 'bg-red-50 text-red-500',
          expired: 'bg-gray-100 text-gray-500',
        };
        return (
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', styles[item.status])}>
            {item.status}
          </span>
        );
      },
    },
    {
      key: 'createdAt', header: 'Waktu',
      render: (item) => <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString('id-ID')}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">Keuangan</h2>
        <p className="text-sm text-gray-400">Approval penarikan saldo dan log transaksi payment gateway</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
        {([['withdrawals', '💳 Penarikan Saldo'], ['gateway', '🔗 Payment Gateway']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as 'withdrawals' | 'gateway')}
            className={cn('rounded-lg px-4 py-2 text-sm font-medium transition-all', tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700')}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'withdrawals' ? (
        <ChartCard title="Antrean Approval Penarikan" subtitle="Permintaan penarikan saldo In-App Wallet yang menunggu persetujuan">
          <DataTable columns={withdrawalColumns} data={mockWithdrawals} keyExtractor={(i) => i.id} />
        </ChartCard>
      ) : (
        <ChartCard title="Log Mutasi Payment Gateway" subtitle="Transaksi QRIS/VA dari Skenario B (Mutu < Residu) dan Skenario C (Full Residu)">
          <DataTable columns={gatewayColumns} data={mockGatewayLogs} keyExtractor={(i) => i.id} />
        </ChartCard>
      )}
    </div>
  );
}
