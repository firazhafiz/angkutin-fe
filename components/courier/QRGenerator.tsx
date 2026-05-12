"use client";
import React from "react";
import { Zap } from "lucide-react";

interface QRGeneratorProps {
  orderId: string;
  size?: number;
}

export default function QRGenerator({
  orderId,
  size = 200,
}: QRGeneratorProps) {
  // Mock QR code pattern from orderId — will be replaced by qrcode.react in Batch 8
  const hash = orderId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const grid = Array.from({ length: 25 }, (_, i) => (hash * (i + 7)) % 3 !== 0);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="bg-dark rounded-2xl p-5 flex items-center justify-center relative overflow-hidden"
        style={{ width: size, height: size }}
      >
        {/* QR grid */}
        <div className="grid grid-cols-5 gap-1.5 w-[70%] h-[70%]">
          {grid.map((filled, i) => (
            <div
              key={i}
              className={filled ? "bg-white rounded-sm" : "bg-white/10 rounded-sm"}
            />
          ))}
        </div>

        {/* Center logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-2xl">
            <Zap size={20} className="text-dark" />
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs font-black text-dark uppercase tracking-widest">
          {orderId}
        </p>
        <p className="text-[10px] text-gray-400 font-medium mt-1">
          Scan by Admin Gudang
        </p>
      </div>
    </div>
  );
}
