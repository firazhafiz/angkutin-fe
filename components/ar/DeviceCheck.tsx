"use client";
import React, { useEffect, useState } from "react";
import { Camera, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export default function DeviceCheck({ onReady }: { onReady: () => void }) {
  const [status, setStatus] = useState<"checking" | "ready" | "error">("checking");

  useEffect(() => {
    // Simulate permission check
    const timer = setTimeout(() => {
      setStatus("ready");
      setTimeout(onReady, 1000);
    }, 1500);
    return () => clearTimeout(timer);
  }, [onReady]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 h-full min-h-[300px]">
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
        status === "checking" && "bg-gray-100 text-gray-500 animate-pulse",
        status === "ready" && "bg-green-100 text-green-500",
        status === "error" && "bg-red-100 text-red-500"
      )}>
        {status === "checking" && <Camera size={28} className="animate-bounce" />}
        {status === "ready" && <CheckCircle2 size={32} />}
        {status === "error" && <AlertCircle size={32} />}
      </div>
      
      <div>
        <h3 className="font-bold text-dark">
          {status === "checking" && "Memeriksa Perangkat..."}
          {status === "ready" && "Kamera Siap!"}
          {status === "error" && "Gagal Akses Kamera"}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {status === "checking" && "Pastikan Anda memberikan izin akses kamera"}
          {status === "ready" && "Memulai AI Scanner"}
          {status === "error" && "Mohon periksa pengaturan browser Anda"}
        </p>
      </div>

      {status === "checking" && (
        <Loader2 size={20} className="text-primary animate-spin mt-4" />
      )}
    </div>
  );
}
