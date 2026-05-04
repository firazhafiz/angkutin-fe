'use client';

import { useParams } from 'next/navigation';

export default function CourierDetailPage() {
  const { courierId } = useParams<{ courierId: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">Detail Kurir</h2>
        <p className="text-sm text-gray-400">ID: {courierId}</p>
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm text-center">
        <p className="text-sm text-gray-500">
          Detail kurir akan ditampilkan di sini setelah integrasi backend
        </p>
      </div>
    </div>
  );
}
