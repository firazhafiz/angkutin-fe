'use client';

import { useParams } from 'next/navigation';

export default function TransactionDetailPage() {
  const { transactionId } = useParams<{ transactionId: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">Detail Transaksi</h2>
        <p className="text-sm text-gray-400">ID: {transactionId}</p>
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm text-center">
        <p className="text-sm text-gray-500">
          Detail transaksi akan ditampilkan di sini setelah integrasi backend
        </p>
      </div>
    </div>
  );
}
