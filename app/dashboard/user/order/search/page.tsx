"use client";

import React from "react";
import FleetMap from "@/components/maps/FleetMap";
import BottomNav from "@/components/dashboard/BottomNav";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const router = useRouter();

  const handleMatch = () => {
    router.push("/dashboard/user/order/tracking/mock-order-123");
  };

  const handleTimeout = () => {
    // In a real app, show error state. For now, go back.
    router.push("/dashboard/user");
  };

  const handleCancel = () => {
    router.push("/dashboard/user");
  };

  return (
    <div className="min-h-dvh bg-dark flex items-stretch justify-center">
      <div className="w-full max-w-lg bg-gray-50 relative flex flex-col min-h-dvh">
        {/* Header */}
        <div className="bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-30 border-b border-gray-100">
          <button
            onClick={handleCancel}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-black text-dark">
              Mencari Kurir
            </h1>
            <p className="text-[10px] text-gray-400 font-bold">
              Pesanan #AGT-55291
            </p>
          </div>
        </div>

        {/* Radar Content */}
        <div className="flex-1 flex items-center justify-center bg-white">
          <FleetMap
            onMatch={handleMatch}
            onTimeout={handleTimeout}
            onCancel={handleCancel}
            matchAfterSeconds={6}
          />
        </div>

        <BottomNav role="user" />
      </div>
    </div>
  );
}
