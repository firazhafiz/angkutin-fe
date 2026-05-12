"use client";
import React, { useState, useEffect } from "react";
import { Navigation, Phone, MessageCircle, Clock, MapPin } from "lucide-react";
import MapView from "./MapView";
import { cn } from "@/lib/cn";
import { OrderStatus } from "@/types/enums";

interface LiveTrackerProps {
  status: OrderStatus;
  courierName?: string;
  courierPlate?: string;
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
  courierName = "Ahmad Fauzi",
  courierPlate = "L 1234 AB",
  etaMinutes = 8,
}: LiveTrackerProps) {
  const [eta, setEta] = useState(etaMinutes);

  // Simulate ETA countdown
  useEffect(() => {
    if (status !== OrderStatus.ON_GOING) return;
    const timer = setInterval(() => {
      setEta((e) => (e > 1 ? e - 1 : 1));
    }, 60000); // every minute
    return () => clearInterval(timer);
  }, [status]);

  const showMap =
    status === OrderStatus.ON_GOING || status === OrderStatus.DELIVERING;

  return (
    <div className="flex flex-col h-full">
      {/* Map Area */}
      <div className="relative h-56 sm:h-64 shrink-0">
        {showMap ? (
          <MapView
            className="w-full h-full"
            showUserMarker
            showCourierMarker
            courierPosition={
              status === OrderStatus.DELIVERING
                ? { top: "25%", left: "60%" }
                : { top: "30%", left: "55%" }
            }
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
            <p className="text-sm font-black text-dark">
              {statusLabels[status] || "Memproses..."}
            </p>
          </div>
        )}

        {/* ETA Badge */}
        {showMap && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-xl px-3 py-2 shadow-lg border border-gray-100 flex items-center gap-2">
            <Clock size={14} className="text-primary" />
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                ETA
              </p>
              <p className="text-sm font-black text-dark leading-tight">
                {eta} mnt
              </p>
            </div>
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
                  Motor
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
                : "Manukan Yoso Dalam Blok 7i No 16, Surabaya"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
