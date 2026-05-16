"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  X,
  Box,
  Zap,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";
import DeviceCheck from "./DeviceCheck";
import { VehicleType } from "@/types/enums";
import { orderService } from "@/services/order.service";
import Image from "next/image";

export interface ScanResult {
  aiResultId: string;
  volume: number;
  confidence: number;
  vehicle: VehicleType;
}

export default function ARScanner({
  onComplete,
  onCancel,
  manualHint = "",
  onHintChange,
}: {
  onComplete: (result: ScanResult) => void;
  onCancel: () => void;
  manualHint?: string;
  onHintChange?: (val: string) => void;
}) {
  const [deviceReady, setDeviceReady] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize Camera
  useEffect(() => {
    if (!deviceReady) return;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // prioritize back camera
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setError(
          "Gagal mengakses kamera. Pastikan izin kamera sudah diberikan.",
        );
      }
    }

    startCamera();

    return () => {
      // Cleanup stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [deviceReady]);

  // Handle Scanning Progress
  useEffect(() => {
    if (!scanning) return;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 12; // slightly faster scan
      });
    }, 150);

    return () => clearInterval(interval);
  }, [scanning]);

  // Handle Analysis after 100%
  useEffect(() => {
    if (progress < 100 || !scanning) return;

    const callBE = async () => {
      try {
        // DI SINI: Kita mengirim hint manual ke BE
        const result = await orderService.aiAnalyze({
          imageUrl:
            "https://storage.angkutin.com/temp/waste-photo-realtime.jpg", // simulasi URL jepretan
          manualHint: manualHint || "Otomatis terdeteksi oleh AR Scanner",
        });

        const ai = result.data;

        // Sedikit delay agar transisi ke result tidak terlalu kaget
        setTimeout(() => {
          onComplete({
            aiResultId: ai.id,
            volume: ai.volumeEstimation,
            confidence: ai.confidenceScore * 100,
            vehicle: ai.recommendedVehicle as VehicleType,
          });
        }, 800);
      } catch (err: any) {
        console.error("AI Analyze failed:", err);
        setError(
          err.response?.data?.message || "Gagal menganalisis. Coba lagi.",
        );
        setScanning(false);
        setProgress(0);
      }
    };

    callBE();
  }, [progress, scanning, onComplete, manualHint]);

  if (!deviceReady) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <DeviceCheck onReady={() => setDeviceReady(true)} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[580px] bg-dark rounded-2xl overflow-hidden flex flex-col">
      {/* Real Camera View */}
      <div className="absolute inset-0 bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            "w-full h-full object-cover transition-all duration-1000",
            scanning ? "blur-sm scale-110 brightness-50" : "opacity-90",
          )}
        />

        {/* Shutter flash effect */}
        {scanning && progress < 20 && (
          <div className="absolute inset-0 bg-primary/20 animate-pulse z-20 mix-blend-overlay" />
        )}
      </div>

      {/* AR Overlay UI - Header */}
      <div className="relative z-10 p-5 flex justify-between items-center bg-linear-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-md border border-primary/30">
            <Image src="/logo/trash-white.svg" alt="" width={16} height={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Angkutin AI
            </span>
            <span className="text-[8px] font-bold text-white/60 -mt-0.5">
              V2.4 REAL-TIME VISION
            </span>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 backdrop-blur-md transition-all cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Scanner Guidelines */}
        <div
          className={cn(
            "relative w-72 h-72 border-2 border-white/20 rounded-3xl transition-all duration-500 overflow-hidden",
            scanning &&
              "scale-110 border-primary/50 shadow-[0_0_50px_rgba(34,197,94,0.3)]",
          )}
        >
          <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-3xl z-20" />
          <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-3xl z-20" />
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-3xl z-20" />
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-3xl z-20" />

          {/* Scanning Line Animation */}
          {scanning && (
            <div className="absolute left-0 right-0 h-1 bg-white/80 shadow-[0_0_30px_6px_rgba(255,255,255,0.8),0_0_15px_3px_rgba(34,197,94,0.8)] animate-scan z-10" />
          )}

          {/* AI Detection Points (Visual Only) */}
          {scanning && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-primary/80 rounded-full"
                  style={{
                    width: Math.random() * 6 + 2 + 'px',
                    height: Math.random() * 6 + 2 + 'px',
                    top: `${Math.random() * 80 + 10}%`,
                    left: `${Math.random() * 80 + 10}%`,
                    animationName: 'ping',
                    animationDuration: `${Math.random() * 2 + 1}s`,
                    animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
                    animationIterationCount: 'infinite',
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Scanning instruction at bottom */}
        {!scanning && !error && (
          <div className="absolute bottom-2 left-6 right-6 z-20">
            <p className="text-[10px] text-white/50 text-center font-medium">
              Arahkan kamera & tekan tombol di bawah untuk memproses
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="absolute bottom-10 left-6 right-6">
            <div className="bg-red-500/90 backdrop-blur-md text-white text-xs px-5 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl">
              <AlertCircle size={20} className="shrink-0" /> {error}
            </div>
          </div>
        )}
      </div>

      {/* Controls Footer */}
      <div className="relative z-10 p-8 bg-linear-to-t from-black via-black/40 to-transparent flex flex-col items-center">
        {scanning ? (
          <div className="w-full max-w-xs space-y-4">
            <div className="flex justify-between text-[10px] font-black text-white uppercase tracking-[0.2em]">
              <span className="flex items-center gap-2">
                <Loader2 size={12} className="animate-spin text-primary" />
                Processing Vision
              </span>
              <span className="text-primary">{Math.min(progress, 100).toFixed(0)}%</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute top-0 bottom-0 right-0 w-8 bg-linear-to-r from-transparent to-white/50" />
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              if (error) {
                window.location.reload(); // simple retry
                return;
              }
              setError(null);
              setScanning(true);
              setProgress(0);
            }}
            className="group relative w-20 h-20 flex items-center justify-center cursor-pointer"
          >
            {/* Outter Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-white/30 group-hover:border-primary/50 group-active:scale-90 transition-all duration-300" />
            <div className="absolute inset-1.5 rounded-full border-2 border-white/10" />

            {/* Inner Button */}
            <div className="w-14 h-14 bg-white rounded-full group-hover:bg-primary transition-colors flex items-center justify-center shadow-lg group-active:scale-95 transition-all">
              <Camera
                size={24}
                className="text-dark group-hover:text-white transition-colors"
              />
            </div>
          </button>
        )}
      </div>

      {/* Global CSS for scanning animation */}
      <style jsx global>{`
        @keyframes scan {
          0% {
            top: 2px;
          }
          50% {
            top: calc(100% - 4px);
          }
          100% {
            top: 2px;
          }
        }
        .animate-scan {
          animation: scan 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
