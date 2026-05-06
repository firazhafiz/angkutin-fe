'use client';

import React from 'react';
import { MapPin, Truck, Bike, WifiOff } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import { mockCourierLocations, mockCouriers } from '@/services/mock/admin.mock';
import { cn } from '@/lib/cn';

// ──────────────────────────────────────────────────────────
// Fleet Monitor — Item 32 dari PRD
// Status kurir: Online / Offline
// ──────────────────────────────────────────────────────────

const statusColors: Record<string, string> = {
  idle: 'bg-soft-gray text-gray-500',
  delivering: 'bg-primary-light text-primary',
  returning: 'bg-primary-light text-primary',
};

const statusLabels: Record<string, string> = {
  idle: 'Offline',
  delivering: 'Online',
  returning: 'Online',
};

export default function FleetPage() {
  const onlineCouriers = mockCouriers.filter((c) => c.isOnline).length;
  const offlineCouriers = mockCouriers.filter((c) => !c.isOnline).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-dark">Armada</h2>
        <p className="text-sm text-gray-400">Monitor posisi dan status kurir secara real-time</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard
          label="Kurir Online"
          value={onlineCouriers}
          icon={Bike}
          iconColor="bg-gradient-to-br from-primary to-secondary"
        />
        <StatsCard
          label="Kurir Offline"
          value={offlineCouriers}
          icon={WifiOff}
          iconColor="bg-gradient-to-br from-gray-400 to-gray-500"
        />
        <StatsCard
          label="Total Kurir"
          value={mockCouriers.length}
          icon={Truck}
          iconColor="bg-gradient-to-br from-dark to-foreground"
        />
      </div>

      {/* Map Placeholder + Courier list */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Map Area */}
        <div className="lg:col-span-2 rounded-2xl border border-soft-gray bg-white shadow-sm overflow-hidden">
          <div className="border-b border-soft-gray px-5 py-4">
            <h3 className="text-sm font-bold text-dark">Peta Armada</h3>
            <p className="text-xs text-gray-400">Data diperbarui setiap 10 detik</p>
          </div>
          {/* Map placeholder */}
          <div className="flex h-[420px] flex-col items-center justify-center bg-gradient-to-br from-primary-light/30 to-primary/5 p-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-light text-primary mb-4">
              <MapPin size={36} />
            </div>
            <h4 className="text-sm font-bold text-dark mb-1">Peta Akan Tampil Di Sini</h4>
            <p className="text-xs text-gray-400 text-center max-w-xs">
              Integrasikan Google Maps API key atau gunakan react-leaflet untuk menampilkan peta armada real-time
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {mockCourierLocations.map((loc) => (
                <div key={loc.courierId} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm border border-soft-gray">
                  <span className={cn('h-2 w-2 rounded-full',
                    loc.status === 'delivering' ? 'bg-primary animate-pulse' : 'bg-gray-400'
                  )} />
                  <span className="text-xs font-medium text-dark">{loc.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Courier List */}
        <div className="rounded-2xl border border-soft-gray bg-white shadow-sm">
          <div className="border-b border-soft-gray px-5 py-4">
            <h3 className="text-sm font-bold text-dark">Daftar Kurir Aktif</h3>
          </div>
          <div className="divide-y divide-soft-gray max-h-[460px] overflow-y-auto">
            {mockCourierLocations.map((loc) => (
              <div key={loc.courierId} className="flex items-center gap-3 px-5 py-3 hover:bg-very-light-gray transition-colors">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white shrink-0">
                  {loc.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-dark truncate">{loc.name}</p>
                  <p className="text-[10px] text-gray-400">
                    {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                    {loc.currentOrderId && <span className="ml-1 text-primary">• {loc.currentOrderId}</span>}
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
