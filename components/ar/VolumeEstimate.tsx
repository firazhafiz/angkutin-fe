"use client";
import React from "react";
import { Box, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { VehicleType } from "@/types/enums";

interface VolumeEstimateProps {
  volume: number;
  confidence: number;
  recommendedVehicle: VehicleType;
  onRetake: () => void;
  onConfirm: () => void;
}

export default function VolumeEstimate({
  volume,
  confidence,
  recommendedVehicle,
  onRetake,
  onConfirm,
}: VolumeEstimateProps) {
  const getVehicleLabel = (v: VehicleType) => {
    switch (v) {
      case VehicleType.MOTOR:
        return "Motor (Max 50kg)";
      case VehicleType.PICKUP:
        return "Pickup (Max 500kg)";
      case VehicleType.TRUCK:
        return "Truk (Max 2000kg)";
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles size={18} className="fill-primary/20" />
          <h3 className="text-sm font-black uppercase tracking-widest">
            Hasil Scan AI
          </h3>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
          <CheckCircle2 size={12} /> Selesai
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Estimasi Volume
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-dark">
              {volume.toFixed(1)}
            </span>
            <span className="text-sm font-bold text-gray-500">m³</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Akurasi AI
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-dark">{confidence.toFixed(1)}</span>
            <span className="text-sm font-bold text-gray-500">%</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-xl shadow-sm text-primary">
            <Box size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-dark mb-0.5">
              Rekomendasi Kendaraan
            </p>
            <p className="text-sm font-black text-primary">
              {getVehicleLabel(recommendedVehicle)}
            </p>
            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
              Berdasarkan volume yang dipindai, kendaraan ini paling efisien
              untuk pesanan Anda.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onRetake}
          className="flex-1 py-3.5 rounded-full border border-gray-200 text-dark font-black text-xs uppercase tracking-widest hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw size={14} /> Scan Ulang
        </button>
        <button
          onClick={onConfirm}
          className="flex-[1.5] py-3.5 rounded-full bg-primary text-white font-black text-xs uppercase tracking-widest hover:bg-primary-dark transition-colors cursor-pointer"
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
}
