"use client";
import React, { useState, useEffect } from "react";
import { Radar, X, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";

interface FleetMapProps {
  onMatch: () => void;
  onTimeout: () => void;
  onCancel: () => void;
  timeoutSeconds?: number;
  matchAfterSeconds?: number;
}

export default function FleetMap({
  onMatch,
  onTimeout,
  onCancel,
  timeoutSeconds = 180,
  matchAfterSeconds = 8,
}: FleetMapProps) {
  const [secondsLeft, setSecondsLeft] = useState(timeoutSeconds);
  const [matched, setMatched] = useState(false);

  // Countdown
  useEffect(() => {
    if (matched) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [matched, onTimeout]);

  // Auto-match simulation
  useEffect(() => {
    const matchTimer = setTimeout(() => {
      setMatched(true);
      setTimeout(onMatch, 1500); // Brief delay to show "found" state
    }, matchAfterSeconds * 1000);
    return () => clearTimeout(matchTimer);
  }, [matchAfterSeconds, onMatch]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 space-y-8 min-h-[420px]">
      {/* Radar Animation */}
      <div className="relative w-52 h-52">
        {/* Concentric circles */}
        {[1, 2, 3, 4].map((ring) => (
          <div
            key={ring}
            className={cn(
              "absolute rounded-full border-2 border-primary/15",
              "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            )}
            style={{
              width: `${ring * 25}%`,
              height: `${ring * 25}%`,
            }}
          />
        ))}

        {/* Pulsing rings */}
        {!matched && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" style={{ animationDuration: "2s" }} />
            <div className="absolute inset-4 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
            <div className="absolute inset-8 rounded-full border-2 border-primary/10 animate-ping" style={{ animationDuration: "3s", animationDelay: "1s" }} />
          </>
        )}

        {/* Radar sweep */}
        {!matched && (
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{ animation: "spin 3s linear infinite" }}
          >
            <div
              className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, rgba(1,106,112,0.3) 60deg, transparent 60deg)",
              }}
            />
          </div>
        )}

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-500",
              matched
                ? "bg-secondary scale-110 shadow-secondary/40"
                : "bg-primary shadow-primary/40",
            )}
          >
            <Radar
              size={24}
              className={cn(
                "text-white",
                !matched && "animate-pulse",
              )}
            />
          </div>
        </div>

        {/* Mock courier dots */}
        {!matched && (
          <>
            <div className="absolute top-[15%] right-[20%] w-2.5 h-2.5 bg-secondary rounded-full animate-pulse shadow-sm shadow-secondary/50" style={{ animationDelay: "0.3s" }} />
            <div className="absolute bottom-[25%] left-[15%] w-2 h-2 bg-secondary/60 rounded-full animate-pulse shadow-sm" style={{ animationDelay: "1s" }} />
            <div className="absolute top-[45%] right-[10%] w-2 h-2 bg-secondary/40 rounded-full animate-pulse" style={{ animationDelay: "1.5s" }} />
          </>
        )}

        {/* Match found indicator */}
        {matched && (
          <div className="absolute top-[20%] right-[15%] z-20">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-lg shadow-secondary/50 animate-bounce border-2 border-white">
              <span className="text-white text-xs font-black">✓</span>
            </div>
          </div>
        )}
      </div>

      {/* Status Text */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-black text-dark">
          {matched ? "Kurir Ditemukan! 🎉" : "Mencari Kurir Terdekat..."}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
          {matched
            ? "Menghubungkan Anda dengan kurir. Mohon tunggu sebentar."
            : "Sedang mencari kurir terdekat di area Surabaya. Proses ini biasanya memakan waktu kurang dari 1 menit."}
        </p>
      </div>

      {/* Timer */}
      {!matched && (
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100">
          <Clock size={14} className="text-primary" />
          <span className="text-sm font-black text-dark tabular-nums">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
          <span className="text-[10px] text-gray-400 font-bold">tersisa</span>
        </div>
      )}

      {/* Cancel */}
      {!matched && (
        <button
          onClick={onCancel}
          className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <X size={14} /> Batalkan Pencarian
        </button>
      )}
    </div>
  );
}
