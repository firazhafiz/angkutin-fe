'use client';

import { adminService } from '@/services/admin.service';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CourierDetailPage() {
  const { courierId } = useParams<{ courierId: string }>();
  const [viewId, setViewId] = useState<string | null>(null);

  const { data: detailResponse, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['courier-detail', viewId],
    queryFn: () => adminService.getCourierDetail(viewId!),
    enabled: !!viewId,
  })

  const courierDetail = detailResponse?.data;

  useEffect(() => {
    if (courierId) {
      setViewId(courierId);
    }
  }, [courierId])

  if (isLoadingDetail) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-sm text-gray-500">Memuat data...</p>
      </div>
    )
  }
  
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
