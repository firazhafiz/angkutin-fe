"use client";
import React from "react";
import { MapPin, Navigation } from "lucide-react";

interface MapViewProps {
  className?: string;
  showUserMarker?: boolean;
  showCourierMarker?: boolean;
  courierPosition?: { top: string; left: string };
}

export default function MapView({
  className = "",
  showUserMarker = true,
  showCourierMarker = false,
  courierPosition = { top: "35%", left: "55%" },
}: MapViewProps) {
  return (
    <div
      className={`relative bg-gray-200 overflow-hidden ${className}`}
      style={{
        backgroundImage:
          "url('https://api.mapbox.com/styles/v1/mapbox/light-v11/static/112.7521,-7.2575,14,0/600x400@2x?access_token=pk.placeholder')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Fallback grid pattern when no Mapbox key */}
      <div className="absolute inset-0 bg-gray-100">
        {/* Road grid */}
        <svg
          className="w-full h-full opacity-30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="roads"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <rect width="60" height="60" fill="#e8e8e8" />
              <line
                x1="30"
                y1="0"
                x2="30"
                y2="60"
                stroke="#d1d5db"
                strokeWidth="2"
              />
              <line
                x1="0"
                y1="30"
                x2="60"
                y2="30"
                stroke="#d1d5db"
                strokeWidth="2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#roads)" />
        </svg>

        {/* Map-like colored blocks */}
        <div className="absolute top-[10%] left-[15%] w-20 h-14 bg-green-100/60 rounded-sm" />
        <div className="absolute top-[50%] left-[60%] w-24 h-16 bg-green-100/60 rounded-sm" />
        <div className="absolute top-[25%] left-[40%] w-32 h-10 bg-blue-50/50 rounded-sm" />
        <div className="absolute bottom-[20%] left-[20%] w-16 h-20 bg-green-100/40 rounded-sm" />

        {/* Street labels */}
        <div className="absolute top-[45%] left-[10%] text-[8px] font-bold text-gray-400 tracking-widest rotate-90 opacity-50">
          JL. SEMOLOWARU
        </div>
        <div className="absolute top-[20%] left-[30%] text-[8px] font-bold text-gray-400 tracking-widest opacity-50">
          JL. ARIEF RAHMAN HAKIM
        </div>
      </div>

      {/* User Marker */}
      {showUserMarker && (
        <div className="absolute bottom-[30%] left-[40%] z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 border-2 border-white">
            <MapPin size={18} className="text-white fill-white/30" />
          </div>
          <div className="w-3 h-3 bg-primary/30 rounded-full -mt-1.5 animate-ping" />
          <span className="text-[8px] font-black bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm mt-1 text-dark">
            Lokasi Anda
          </span>
        </div>
      )}

      {/* Courier Marker */}
      {showCourierMarker && (
        <div
          className="absolute z-10 flex flex-col items-center transition-all duration-2000 ease-in-out"
          style={{ top: courierPosition.top, left: courierPosition.left }}
        >
          <div className="w-10 h-10 rounded-full bg-dark flex items-center justify-center shadow-lg border-2 border-secondary">
            <Navigation
              size={16}
              className="text-secondary fill-secondary/30 rotate-[-30deg]"
            />
          </div>
          <span className="text-[8px] font-black bg-dark text-white px-2 py-0.5 rounded-full shadow-sm mt-1">
            Kurir
          </span>
        </div>
      )}

      {/* Route line placeholder */}
      {showCourierMarker && showUserMarker && (
        <svg
          className="absolute inset-0 z-5 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="55%"
            y1="35%"
            x2="40%"
            y2="70%"
            stroke="#016a70"
            strokeWidth="3"
            strokeDasharray="8,6"
            opacity="0.5"
          />
        </svg>
      )}
    </div>
  );
}
