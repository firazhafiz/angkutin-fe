"use client";
import React, { useState, useEffect } from "react";
import { Navigation, Phone, MessageCircle, Clock, MapPin } from "lucide-react";
import MapboxView, { MapboxMarker } from "./MapboxView";
import { cn } from "@/lib/cn";
import { OrderStatus } from "@/types/enums";

interface LiveTrackerProps {
  status: OrderStatus;
  courierName?: string;
  courierPlate?: string;
  courierVehicle?: string;
  address?: string;
  userLat?: number;
  userLng?: number;
  courierLat?: number;
  courierLng?: number;
  etaMinutes?: number;
}

const statusLabels: Partial<Record<OrderStatus, string>> = {
  [OrderStatus.MATCHED]: "Kurir menerima pesanan",
  [OrderStatus.ON_GOING]: "Kurir menuju lokasi Anda",
  [OrderStatus.ARRIVED]: "Kurir telah tiba",
  [OrderStatus.WEIGHING]: "Proses penimbangan",
  [OrderStatus.PICKED_UP]: "Sampah telah diangkut",
  [OrderStatus.DELIVERING]: "Menuju gudang daur ulang",
  [OrderStatus.COMPLETED]: "Pesanan selesai",
};

export default function LiveTracker({
  status,
  courierName = "Kurir",
  courierPlate = "-",
  courierVehicle = "Motor",
  address = "-",
  userLat = -7.2575,
  userLng = 112.7521,
  courierLat,
  courierLng,
  etaMinutes = 8,
}: LiveTrackerProps) {
  const [eta, setEta] = useState(etaMinutes);

  // ETA is now dynamically updated by Mapbox Directions API via onRouteUpdate

  const showMap =
    status === OrderStatus.MATCHED || 
    status === OrderStatus.ON_GOING || 
    status === OrderStatus.DELIVERING ||
    status === OrderStatus.ARRIVED;

  const markers: MapboxMarker[] = [];

  if (showMap) {
    // User / Destination marker
    markers.push({
      id: "destination",
      lat: userLat,
      lng: userLng,
      type: status === OrderStatus.DELIVERING ? "destination" : "user",
    });

    // Courier marker
    markers.push({
      id: "courier",
      lat: courierLat || userLat - 0.005,
      lng: courierLng || userLng - 0.005,
      type: "courier",
      isOnline: true,
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Map Area */}
      <div className="relative h-56 sm:h-64 shrink-0">
        {showMap ? (
          <MapboxView
            className="w-full h-full"
            center={[userLng, userLat]}
            zoom={14}
            markers={markers}
            showRoute={true}
            onRouteUpdate={({ duration }) => {
              setEta(Math.ceil(duration / 60));
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-3",
                status === OrderStatus.COMPLETED
                  ? "bg-secondary/10 text-secondary"
                  : "bg-primary/10 text-primary",
              )}
            >
              {status === OrderStatus.COMPLETED ? (
                <span className="text-2xl">✅</span>
              ) : (
                <Navigation size={28} className="animate-pulse" />
              )}
            </div>
            <p className="text-sm font-regular text-dark">
              {statusLabels[status] || "Memproses..."}
            </p>
          </div>
        )}

        {/* ETA Badge */}
        {showMap && (
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/50 flex items-center gap-2">
            <Clock size={12} className="text-primary" />
            <span className="text-[10px] font-black text-dark uppercase tracking-widest">
              ETA {eta} mnt
            </span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 left-4 bg-dark/80 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">
            {statusLabels[status] || "Live"}
          </span>
        </div>
      </div>

      {/* Courier Info */}
      <div className="p-4 bg-white border-t border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-primary/20">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=courier1"
                alt={courierName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-black text-dark">{courierName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                  {courierPlate}
                </span>
                <span className="text-[10px] font-bold text-primary">
                  {courierVehicle}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
              <Phone size={16} />
            </button>
            <button className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
              <MessageCircle size={16} />
            </button>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
          <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
              {status === OrderStatus.DELIVERING
                ? "Tujuan: Gudang Daur Ulang"
                : "Lokasi Penjemputan"}
            </p>
            <p className="text-xs text-dark font-medium leading-relaxed">
              {status === OrderStatus.DELIVERING
                ? "Gudang Angkutin, Jl. Rungkut Industri No. 5, Surabaya"
                : address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
