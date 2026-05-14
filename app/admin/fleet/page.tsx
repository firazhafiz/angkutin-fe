'use client';

import React from 'react';
import { MapPin, Truck, Bike, WifiOff, Loader2 } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import { cn } from '@/lib/cn';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';

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
  const { data: fleetData, isLoading } = useQuery({
    queryKey: ['admin', 'fleet', 'locations'],
    queryFn: () => adminService.getFleetLocations(),
    refetchInterval: 10000, // Poll every 10 seconds
  });

  const locations = fleetData?.data || [];
  const onlineCouriers = locations.filter((c) => c.isOnline).length;
  const offlineCouriers = locations.filter((c) => !c.isOnline).length;

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
          value={isLoading ? '...' : onlineCouriers}
          icon={Bike}
          iconColor="bg-gradient-to-br from-primary to-secondary"
        />
        <StatsCard
          label="Kurir Offline"
          value={isLoading ? '...' : offlineCouriers}
          icon={WifiOff}
          iconColor="bg-gradient-to-br from-gray-400 to-gray-500"
        />
        <StatsCard
          label="Total Kurir"
          value={isLoading ? '...' : locations.length}
          icon={Truck}
          iconColor="bg-gradient-to-br from-dark to-foreground"
        />
      </div>

      {/* Map Placeholder + Courier list */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Map Area */}
        <div className="lg:col-span-2 rounded-2xl border border-soft-gray bg-white shadow-sm overflow-hidden">
          <div className="border-b border-soft-gray px-5 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-dark">Peta Armada</h3>
              <p className="text-xs text-gray-400">Data diperbarui setiap 10 detik</p>
            </div>
            {isLoading && <Loader2 size={16} className="animate-spin text-primary" />}
          </div>
          
          {/* Map placeholder */}
          <div className="flex h-[420px] flex-col items-center justify-center bg-gradient-to-br from-primary-light/30 to-primary/5 p-8 relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-light text-primary mb-4 shadow-inner">
              <MapPin size={36} />
            </div>
            <h4 className="text-sm font-bold text-dark mb-1 text-center">Peta Akan Tampil Di Sini</h4>
            <p className="text-xs text-gray-400 text-center max-w-xs mb-6">
              Gunakan react-leaflet atau Google Maps untuk memvisualisasikan posisi kurir di atas peta.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 max-w-md overflow-y-auto">
              {locations.map((loc) => (
                <div key={loc.courierId} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm border border-soft-gray">
                  <span className={cn('h-2 w-2 rounded-full',
                    loc.isOnline ? 'bg-primary animate-pulse' : 'bg-gray-400'
                  )} />
                  <span className="text-[10px] font-bold text-dark">{loc.name}</span>
                </div>
              ))}
              {locations.length === 0 && !isLoading && (
                <p className="text-[10px] text-gray-400 italic">Tidak ada data kurir</p>
              )}
            </div>
          </div>
        </div>

        {/* Courier List */}
        <div className="rounded-2xl border border-soft-gray bg-white shadow-sm flex flex-col h-full overflow-hidden">
          <div className="border-b border-soft-gray px-5 py-4 shrink-0">
            <h3 className="text-sm font-bold text-dark">Daftar Kurir Aktif</h3>
          </div>
          <div className="divide-y divide-soft-gray overflow-y-auto flex-1">
            {isLoading && Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse px-5 py-4 space-y-2">
                <div className="h-4 w-1/2 bg-gray-100 rounded" />
                <div className="h-3 w-3/4 bg-gray-50 rounded" />
              </div>
            ))}
            
            {locations.map((loc) => (
              <div key={loc.courierId} className="flex items-center gap-3 px-5 py-3 hover:bg-very-light-gray transition-colors">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white shrink-0 shadow-sm">
                  {loc.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-dark truncate">{loc.name}</p>
                    {loc.currentOrderId && (
                      <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {loc.currentLat ? `${loc.currentLat.toFixed(4)}, ${loc.currentLng?.toFixed(4)}` : 'Lokasi tidak tersedia'}
                    {loc.currentOrderId && <span className="ml-1.5 text-primary bg-primary/10 px-1 rounded font-bold uppercase">• {loc.currentOrderId}</span>}
                  </p>
                </div>
                <span className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 border uppercase tracking-tight',
                  loc.isOnline 
                    ? 'bg-[#d1fae5] text-secondary border-[#a7f3d0]' 
                    : 'bg-soft-gray text-gray-500 border-gray-200'
                )}>
                  {loc.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            ))}
            
            {locations.length === 0 && !isLoading && (
              <div className="p-8 text-center">
                <p className="text-xs text-gray-400 italic">Data kurir tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

