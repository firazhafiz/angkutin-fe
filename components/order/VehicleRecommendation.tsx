"use client";
import React from "react";
import { Truck, Car, CheckCircle2, Sparkles, Lock } from "lucide-react";
import { VehicleType } from "@/types/enums";

interface VehicleDisplayProps {
  vehicle: VehicleType;
}

const vehicleData = {
  [VehicleType.MOTOR]: {
    name: "Motor",
    maxWeight: "50 kg",
    maxVol: "0.5 m³",
    desc: "Cocok untuk 1-2 karung kecil",
  },
  [VehicleType.PICKUP]: {
    name: "Pickup",
    maxWeight: "500 kg",
    maxVol: "2.0 m³",
    desc: "Cocok untuk tumpukan sedang",
  },
  [VehicleType.TRUCK]: {
    name: "Truk",
    maxWeight: "2000 kg",
    maxVol: "6.0 m³",
    desc: "Untuk sampah jumlah besar",
  },
};

export default function VehicleDisplay({ vehicle }: VehicleDisplayProps) {
  const v = vehicleData[vehicle];
  const Icon = vehicle === VehicleType.MOTOR ? Car : Truck;

  return (
    <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 relative overflow-hidden">
      {/* Locked Badge */}
      <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
        <Lock size={8} /> Rekomendasi AI
      </div>

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
          <Icon size={28} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-black text-dark text-base">{v.name}</h4>
            <div className="flex items-center gap-1 text-primary">
              <Sparkles size={12} className="fill-primary/20" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Rekomendasi
              </span>
            </div>
          </div>
          <p className="text-[11px] font-medium text-gray-500 mb-2">{v.desc}</p>
          <div className="flex gap-2">
            <span className="text-[9px] font-black uppercase bg-white border border-gray-100 px-2 py-1 rounded-lg text-gray-600 shadow-xs">
              Max {v.maxWeight}
            </span>
            <span className="text-[9px] font-black uppercase bg-white border border-gray-100 px-2 py-1 rounded-lg text-gray-600 shadow-xs">
              Max {v.maxVol}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
