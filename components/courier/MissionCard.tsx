"use client";
import React from "react";
import {
  MapPin,
  Clock,
  Truck,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { OrderStatus } from "@/types/enums";

const statusConfig: Partial<
  Record<OrderStatus, { label: string; color: string; bg: string }>
> = {
  [OrderStatus.MATCHED]: {
    label: "Diterima",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  [OrderStatus.ON_GOING]: {
    label: "Menuju Lokasi",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  [OrderStatus.ARRIVED]: {
    label: "Tiba",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  [OrderStatus.WEIGHING]: {
    label: "Timbang",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  [OrderStatus.WAITING_PAYMENT]: {
    label: "Bayar",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  [OrderStatus.PICKED_UP]: {
    label: "Diangkut",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  [OrderStatus.DELIVERING]: {
    label: "Antar",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  [OrderStatus.COMPLETED]: {
    label: "Selesai",
    color: "text-green-600",
    bg: "bg-green-50",
  },
};

interface MissionCardProps {
  orderId: string;
  customerName: string;
  address: string;
  status: OrderStatus;
  distance?: string;
  isScheduled?: boolean;
  scheduledTime?: string;
  onClick?: () => void;
}

export default function MissionCard({
  orderId,
  customerName,
  address,
  status,
  distance = "0.8 km",
  isScheduled = false,
  scheduledTime,
  onClick,
}: MissionCardProps) {
  const config = statusConfig[status] || {
    label: "Proses",
    color: "text-gray-600",
    bg: "bg-gray-50",
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {orderId}
          </span>
          {isScheduled && (
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
              <Calendar size={10} className="text-primary" />
              <span className="text-[9px] font-bold text-primary">
                {scheduledTime || "Terjadwal"}
              </span>
            </div>
          )}
        </div>
        <span
          className={cn(
            "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
            config.bg,
            config.color,
          )}
        >
          {config.label}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customerName}`}
            alt={customerName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-dark truncate">{customerName}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <MapPin size={10} className="text-gray-400 shrink-0" />
            <p className="text-[10px] text-gray-400 font-medium truncate">
              {address}
            </p>
          </div>
        </div>
        <ChevronRight
          size={18}
          className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0"
        />
      </div>

      {distance && (
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold">
            <Truck size={12} />
            <span>Motor</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold">
            <Clock size={12} />
            <span>{distance}</span>
          </div>
        </div>
      )}
    </div>
  );
}
