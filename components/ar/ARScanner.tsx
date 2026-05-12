"use client";
import React, { useState, useEffect } from "react";
import { Camera, X, Box, Zap } from "lucide-react";
import { cn } from "@/lib/cn";
import DeviceCheck from "./DeviceCheck";
import { VehicleType } from "@/types/enums";

export interface ScanResult {
  volume: number;
  confidence: number;
  vehicle: VehicleType;
}

export default function ARScanner({
  onComplete,
  onCancel,
}: {
  onComplete: (result: ScanResult) => void;
  onCancel: () => void;
}) {
  const [deviceReady, setDeviceReady] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulating the scan progress
  useEffect(() => {
    if (!scanning) return;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete({
              volume: 0.8,
              confidence: 87,
              vehicle: VehicleType.MOTOR,
            });
          }, 500);
          return 100;
        }
        return p + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [scanning, onComplete]);

  if (!deviceReady) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <DeviceCheck onReady={() => setDeviceReady(true)} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] bg-dark rounded-2xl overflow-hidden flex flex-col">
      {/* Mock Camera View */}
      <div className="absolute inset-0 bg-gray-900">
        <img
          src="/images/waste.jpg"
          alt="Camera view"
          className={cn(
            "w-full h-full object-cover opacity-60",
            scanning && "blur-sm transition-all duration-1000",
          )}
        />
      </div>

      {/* AR Overlay UI */}
      <div className="relative z-10 p-4 flex justify-between items-center bg-linear-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-2 text-white">
          <Zap size={16} className="text-primary fill-primary" />
          <span className="text-xs font-black uppercase tracking-widest">
            Angkutin AI
          </span>
        </div>
        <button
          onClick={onCancel}
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 backdrop-blur-md transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {/* Scanner Guidelines */}
        <div className="absolute inset-8 border-2 border-white/30 rounded-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl -mt-0.5 -ml-0.5" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl -mt-0.5 -mr-0.5" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl -mb-0.5 -ml-0.5" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl -mb-0.5 -mr-0.5" />

          {/* Scanning Line Animation */}
          {scanning && (
            <div className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_4px_rgba(34,197,94,0.8)] animate-scan" />
          )}
        </div>

        {/* Helper Text */}
        {!scanning && (
          <div className="absolute bottom-10 left-0 right-0 flex justify-center">
            <div className="bg-black/50 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full font-bold flex items-center gap-2">
              <Box size={14} /> Arahkan kamera ke tumpukan sampah
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="relative z-10 p-6 bg-linear-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center">
        {scanning ? (
          <div className="w-full max-w-xs space-y-3">
            <div className="flex justify-between text-xs font-black text-white uppercase tracking-widest">
              <span>Menganalisis...</span>
              <span className="text-primary">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setScanning(true)}
            className="w-16 h-16 rounded-full border-4 border-white/50 flex items-center justify-center p-1 cursor-pointer"
          >
            <div className="w-full h-full bg-white rounded-full active:scale-90 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}
