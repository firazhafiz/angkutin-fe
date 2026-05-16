"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Truck, Volume2, Calendar, Loader2, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface IncomingAlertProps {
  customerName: string;
  address: string;
  vehicleType: string;
  isScheduled?: boolean;
  scheduledTime?: string;
  note?: string;
  timeoutSeconds?: number;
  onAccept: () => Promise<void> | void;
  onDismiss: () => void;
}

export default function IncomingAlert({
  customerName,
  address,
  vehicleType,
  isScheduled,
  scheduledTime,
  note,
  timeoutSeconds = 30,
  onAccept,
  onDismiss,
}: IncomingAlertProps) {
  const [secondsLeft, setSecondsLeft] = useState(timeoutSeconds);
  const [isAccepting, setIsAccepting] = useState(false);
  const progress = (secondsLeft / timeoutSeconds) * 100;

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-dismiss on timeout
  useEffect(() => {
    if (secondsLeft === 0 && !isAccepting) {
      onDismiss();
    }
  }, [secondsLeft, onDismiss, isAccepting]);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await onAccept();
    } catch (err) {
      console.error("Accept failed:", err);
      setIsAccepting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 bg-dark/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-in fade-in zoom-in-95 duration-300 relative">
        {/* Close Button (Skip) */}
        <button
          onClick={onDismiss}
          className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Sound icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center animate-pulse">
            <Volume2 size={24} className="text-secondary" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <span
              className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${isScheduled ? "bg-secondary/20 text-secondary border-secondary/30" : "bg-primary/20 text-primary border-primary/30"}`}
            >
              {isScheduled ? "Terjadwal" : "Instan"}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mb-1">
            Ada Orderan Baru! 🎉
          </h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            Klik terima sebelum diambil kurir lain
          </p>
        </div>

        {/* Countdown ring */}
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
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
                  "text-lg font-black tabular-nums",
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
                Customer
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-gray-300 leading-relaxed">{address}</p>
          </div>

          {/* Details row */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg">
                <Truck size={12} className="text-primary" />
                <span className="text-[10px] font-bold text-white">
                  {vehicleType}
                </span>
              </div>
            </div>

            {note && (
              <div className="w-full bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Catatan
                </p>
                <p className="text-xs text-white italic">"{note}"</p>
              </div>
            )}

            {isScheduled && scheduledTime && (
              <div className="flex items-start gap-4 p-4 rounded-3xl bg-secondary/5 border border-secondary/10">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Calendar size={20} className="text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Jam Penjemputan
                  </p>
                  <p className="text-sm font-black text-secondary">
                    {scheduledTime}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full">
          <button
            onClick={handleAccept}
            disabled={isAccepting}
            className="w-full py-5 rounded-full bg-primary text-white font-black text-sm hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isAccepting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Terima Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
