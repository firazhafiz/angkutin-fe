"use client";

import React, { useState, useEffect } from "react";
import { Radar, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface FleetMapProps {
  onMatch?: () => void;
  onTimeout?: () => void;
  onCancel?: () => void;
  matchAfterSeconds?: number;
  externalMatched?: boolean;
  startTime?: string; // ISO string from order.createdAt
}

export default function FleetMap({
  onCancel,
  matchAfterSeconds = 180,
  externalMatched = false,
  startTime,
}: FleetMapProps) {
  const [now, setNow] = useState(new Date());
  const matched = externalMatched;

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate elapsed and remaining time based on startTime
  const totalCycle = matchAfterSeconds; // default 180s
  const start = startTime ? new Date(startTime) : now;
  const elapsedTotal = Math.floor((now.getTime() - start.getTime()) / 1000);
  
  // Looping logic: elapsed % totalCycle gives where we are in current cycle
  const elapsedInCycle = elapsedTotal > 0 ? (elapsedTotal % totalCycle) : 0;
  const remaining = Math.max(0, totalCycle - elapsedInCycle);
  
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  const hasLooped = elapsedTotal >= totalCycle;

  return (
    <div className="w-full flex flex-col items-center gap-8 py-10">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Radar Rings */}
        <div className="absolute inset-0 border border-primary/5 rounded-full" />
        <div className="absolute inset-4 border border-primary/10 rounded-full" />
        <div className="absolute inset-12 border border-primary/20 rounded-full" />
        
        {/* Pulsing Core */}
        <div className="relative z-10 w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40">
          <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
          <div className="absolute inset-0 bg-primary rounded-full animate-pulse opacity-40" />
          <Radar size={32} className="text-white" />
        </div>

        {/* Radar Sweep */}
        <div className="absolute inset-0 rounded-full bg-linear-to-tr from-primary/10 to-transparent animate-spin duration-[4s]" />

        {/* Mock courier dots */}
        {!matched && (
          <>
            <div className="absolute top-[15%] right-[20%] w-2.5 h-2.5 bg-secondary rounded-full animate-pulse shadow-sm shadow-secondary/50" style={{ animationDelay: "0.3s" }} />
            <div className="absolute bottom-[25%] left-[15%] w-2 h-2 bg-secondary/60 rounded-full animate-pulse shadow-sm" style={{ animationDelay: "1s" }} />
            <div className="absolute top-[45%] right-[10%] w-2 h-2 bg-secondary/40 rounded-full animate-pulse" style={{ animationDelay: "1.5s" }} />
          </>
        )}
      </div>

      {/* Status Text */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-black text-dark">
          {hasLooped ? "Terus Mencari Kurir Terbaik..." : "Mencari Kurir Terdekat..."}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
          {hasLooped 
            ? "Kami terus mengusahakan mencari kurir terbaik untuk Anda. Mohon tunggu sebentar lagi."
            : "Sedang mencari kurir terdekat di area Surabaya. Proses ini biasanya memakan waktu kurang dari 1 menit."}
        </p>
      </div>

      {/* Timer & Cancel Always Visible during Search */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100">
          <Clock size={14} className="text-primary" />
          <span className="text-sm font-black text-dark tabular-nums">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
          <span className="text-[10px] text-gray-400 font-bold">tersisa</span>
        </div>
        
        {/* Cancel */}
        <button
          onClick={onCancel}
          className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5 cursor-pointer mt-2"
        >
          <X size={14} /> Batalkan Pencarian
        </button>
      </div>
    </div>
  );
}
