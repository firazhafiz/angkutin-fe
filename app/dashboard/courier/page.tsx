"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import WalletCard from "@/components/dashboard/WalletCard";
import StatCard from "@/components/dashboard/StatCard";
import { CheckCircle, Star, Navigation, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";

export default function CourierDashboard() {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <DashboardLayout role="courier">
      <div className="space-y-8">
        {/* Header with Online/Offline Toggle */}
        <div className="bg-white p-6 md:p-8 rounded-4xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-dark">Dashboard Kurir</h1>
            <p className="text-gray-500 mt-1">Status kamu saat ini: <span className={cn("font-bold", isOnline ? "text-primary" : "text-red-500")}>{isOnline ? "Online (Siap Kerja)" : "Offline"}</span></p>
          </div>
          
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={cn(
              "relative inline-flex h-12 w-28 items-center rounded-full transition-colors focus:outline-none ring-offset-2 focus:ring-2 focus:ring-primary",
              isOnline ? "bg-primary" : "bg-gray-200"
            )}
          >
            <span className="sr-only">Toggle Online Status</span>
            <span
              className={cn(
                "inline-block h-10 w-10 transform rounded-full bg-white transition-transform shadow-md",
                isOnline ? "translate-x-16" : "translate-x-1"
              )}
            />
            <span className={cn(
              "absolute text-[10px] font-black uppercase tracking-widest transition-all",
              isOnline ? "left-4 text-white" : "right-4 text-gray-500"
            )}>
              {isOnline ? "ON" : "OFF"}
            </span>
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WalletCard 
              balance={450000} 
              showOrderButton={false} 
              onWithdraw={() => console.log("Withdraw")}
            />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <StatCard 
              label="Order Selesai"
              value="128"
              icon={CheckCircle}
              trend="+12"
              iconClassName="bg-green-50 text-green-600"
            />
            <StatCard 
              label="Rating Performa"
              value="4.9 / 5.0"
              icon={Star}
              iconClassName="bg-yellow-50 text-yellow-600"
            />
          </div>
        </div>

        {/* Mission Center */}
        <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                <Navigation size={20} />
              </div>
              <h3 className="text-xl font-bold text-dark">Misi Aktif</h3>
            </div>
            <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-wider">Sedang Berjalan</span>
          </div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <MapPin size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-lg text-dark">Penjemputan Sampah Mutu</p>
                  <p className="text-sm text-gray-500">Jl. Merdeka No. 123, Bandung</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs font-bold text-dark px-2 py-1 bg-white rounded-md border border-gray-200">📦 Motor</span>
                    <span className="text-xs font-bold text-dark px-2 py-1 bg-white rounded-md border border-gray-200">📍 1.2 km</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                 <button className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-white border border-gray-200 text-dark font-bold hover:bg-gray-100 transition-colors">Detail</button>
                 <button className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all">Navigasi</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
