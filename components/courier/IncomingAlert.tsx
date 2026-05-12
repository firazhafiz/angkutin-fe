"use client";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  X,
  Truck,
  Calendar,
  Navigation,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface IncomingAlertProps {
  customerName: string;
  address: string;
  distance: string;
  estimatedEarning: string;
  vehicleType: string;
  isScheduled?: boolean;
  scheduledTime?: string;
  timeoutSeconds?: number;
  onAccept: () => void;
  onReject: () => void;
}

export default function IncomingAlert({
  customerName,
  address,
  distance,
  estimatedEarning,
  vehicleType,
  isScheduled = false,
  scheduledTime,
  timeoutSeconds = 30,
  onAccept,
  onReject,
}: IncomingAlertProps) {
  const [secondsLeft, setSecondsLeft] = useState(timeoutSeconds);
  const progress = (secondsLeft / timeoutSeconds) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer);
          onReject(); // Auto-reject on timeout
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onReject]);

  return (
    <div className="fixed inset-0 z-100 bg-dark/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Sound icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center animate-pulse">
            <Volume2 size={24} className="text-secondary" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-black text-white mb-1">
            Ada Orderan Baru! 🎉
          </h2>
          <p className="text-xs text-gray-400">
            {isScheduled ? "Pesanan Terjadwal" : "Pesanan Instan"}
          </p>
        </div>

        {/* Countdown ring */}
        <div className="flex justify-center">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke={secondsLeft <= 10 ? "#ef4444" : "#059669"}
                strokeWidth="2.5"
                strokeDasharray={`${progress} 100`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={cn(
                  "text-xl font-black tabular-nums",
                  secondsLeft <= 10 ? "text-red-400" : "text-white",
                )}
              >
                {secondsLeft}
              </span>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 space-y-4 border border-white/5">
          {/* Customer */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/10 overflow-hidden shrink-0">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customerName}`}
                alt={customerName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-white">{customerName}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Customer • {distance}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-gray-300 leading-relaxed">{address}</p>
          </div>

          {/* Details row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg">
              <Truck size={12} className="text-primary" />
              <span className="text-[10px] font-bold text-white">
                {vehicleType}
              </span>
            </div>
            {isScheduled && scheduledTime && (
              <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg">
                <Calendar size={12} className="text-primary" />
                <span className="text-[10px] font-bold text-white">
                  Jadwal: {scheduledTime}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-secondary/20 px-2.5 py-1.5 rounded-lg ml-auto">
              <span className="text-[10px] font-black text-secondary">
                {estimatedEarning}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-5 gap-3">
          <button
            onClick={onReject}
            className="col-span-2 py-4 rounded-full border border-white/20 text-white font-black text-sm hover:bg-white/10 transition-colors cursor-pointer"
          >
            Lewati
          </button>
          <button
            onClick={onAccept}
            className="col-span-3 py-4 rounded-full bg-secondary text-white font-black text-sm hover:bg-secondary/90 transition-colors cursor-pointer shadow-lg shadow-secondary/30 flex items-center justify-center gap-2"
          >
            <Navigation size={16} className="fill-white/30" />
            Terima Order
          </button>
        </div>
      </div>
    </div>
  );
}
