'use client';

import React from 'react';
import { MapPin, Truck, Bike, Navigation } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import { mockCourierLocations, mockCouriers } from '@/services/mock/admin.mock';
import { cn } from '@/lib/cn';

// ──────────────────────────────────────────────────────────
// Fleet Monitor — Item 32 dari PRD
// Untuk saat ini menampilkan daftar posisi kurir.
// Peta Google Maps akan diintegrasikan saat API key tersedia.
// ──────────────────────────────────────────────────────────

const statusColors: Record<string, string> = {
  idle: 'bg-gray-100 text-gray-500',
  delivering: 'bg-emerald-50 text-emerald-600',
  returning: 'bg-blue-50 text-blue-600',
};

const statusLabels: Record<string, string> = {
  idle: 'Menganggur',
  delivering: 'Mengantarkan',
  returning: 'Kembali',
};

export default function FleetPage() {
  const onlineCouriers = mockCouriers.filter((c) => c.isOnline).length;
  const deliveringCount = mockCourierLocations.filter((c) => c.status === 'delivering').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">Armada</h2>
        <p className="text-sm text-gray-400">Monitor posisi kurir secara real-time</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard label="Kurir Online" value={onlineCouriers} icon={Bike} iconColor="bg-gradient-to-br from-emerald-500 to-teal-600" />
        <StatsCard label="Sedang Delivery" value={deliveringCount} icon={Navigation} iconColor="bg-gradient-to-br from-blue-500 to-blue-600" />
        <StatsCard label="Total Kurir" value={mockCouriers.length} icon={Truck} iconColor="bg-gradient-to-br from-gray-500 to-gray-600" />
      </div>

      {/* Map Placeholder + Courier list */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Map Area */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-50 px-5 py-4">
            <h3 className="text-sm font-bold text-gray-900">Peta Armada</h3>
            <p className="text-xs text-gray-400">Data diperbarui setiap 10 detik</p>
          </div>
          {/* Map placeholder — akan diganti Google Maps / Leaflet */}
          <div className="flex h-[420px] flex-col items-center justify-center bg-gradient-to-br from-emerald-50/50 to-teal-50/30 p-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-500 mb-4">
              <MapPin size={36} />
            </div>
            <h4 className="text-sm font-bold text-gray-700 mb-1">Peta Akan Tampil Di Sini</h4>
            <p className="text-xs text-gray-400 text-center max-w-xs">
              Integrasikan Google Maps API key atau gunakan react-leaflet untuk menampilkan peta armada real-time
            </p>
            <div className="mt-4 flex gap-2">
              {mockCourierLocations.map((loc) => (
                <div key={loc.courierId} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm border border-gray-100">
                  <span className={cn('h-2 w-2 rounded-full', loc.status === 'delivering' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400')} />
                  <span className="text-xs font-medium text-gray-600">{loc.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Courier List */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-50 px-5 py-4">
            <h3 className="text-sm font-bold text-gray-900">Daftar Kurir Aktif</h3>
          </div>
          <div className="divide-y divide-gray-50 max-h-[460px] overflow-y-auto">
            {mockCourierLocations.map((loc) => (
              <div key={loc.courierId} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 text-xs font-bold text-white shrink-0">
                  {loc.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{loc.name}</p>
                  <p className="text-[10px] text-gray-400">
                    {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                    {loc.currentOrderId && <span className="ml-1 text-emerald-500">• {loc.currentOrderId}</span>}
                  </p>
                </div>
                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0', statusColors[loc.status])}>
                  {statusLabels[loc.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
