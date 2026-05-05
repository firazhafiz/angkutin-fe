"use client";

import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import WalletCard from "@/components/dashboard/WalletCard";
import StatCard from "@/components/dashboard/StatCard";
import {
  Trash2,
  TrendingUp,
  History,
  Navigation,
  BookOpen,
  Headphones,
  Calendar,
  ChevronRight,
  HelpCircle,
  MapPin,
} from "lucide-react";

export default function UserDashboard() {
  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        {/* Header Section: Spans Full Width */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg md:text-xl font-extrabold text-dark">
              Ringkasan Akun
            </h2>
            <h3 className="text-base max-w-4xl text-slate-500 font-light">
              Overview dari aktivitas anda di Angkutin
            </h3>
          </div>
          <div className="flex w-fit items-center gap-2 text-xs md:text-xs font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 ">
            <span>+12.5kg CO2 Reduced</span>
          </div>
        </div>

        {/* Top Section: Wallet & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WalletCard
              balance={150000}
              onOrder={() => console.log("Start Order")}
              onWithdraw={() => console.log("Withdraw")}
            />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
            <StatCard
              label="Total Sampah"
              value="42.5 kg"
              icon={Trash2}
              trend="+5.2kg"
              className="w-full"
              iconClassName="bg-secondary/20 text-dark"
            />
            <StatCard
              label="Point Loyalty"
              value="1,250 pts"
              icon={TrendingUp}
              trend="+35%"
              className="w-full"
              iconClassName="bg-primary/10 text-primary"
            />
          </div>
        </div>

        {/* Bottom Section: High-Density 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {/* Column 1: Pesanan Berjalan with Map Preview */}
          <div className="bg-primary/5 rounded-2xl border border-primary/20 overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-primary/10 flex items-center justify-between bg-primary/10 shrink-0">
              <div className="flex items-center gap-2 text-primary">
                <Navigation size={16} className="animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-widest">
                  Pesanan Berjalan
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-white text-primary px-2 py-1 rounded-full border border-primary/20">
                Menuju Lokasi
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden shrink-0">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Asep"
                    alt="Courier"
                    className="w-full h-full object-cover bg-primary/10"
                  />
                </div>
                <div>
                  <p className="text-md font-bold text-dark leading-none">
                    Asep Sunandar
                  </p>
                  <p className="text-xs font-bold text-primary mt-2 uppercase tracking-wider">
                    AGT-99212
                  </p>
                </div>
              </div>

              {/* Map Preview Placeholder */}
              <div className="relative h-48 w-full rounded-xl overflow-hidden border border-primary/10 bg-gray-200 shadow-inner">
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/106.8271, -6.1751,14,0/400x300?access_token=pk.eyJ1IjoiaWxoYW0iLCJhIjoiY2xwZ2p6eDlyMGJkejJpcGR6bnR6bnR6YyJ9.0')] bg-cover bg-center opacity-80"></div>
                <div className="absolute inset-0 bg-linear-to-t from-primary/20 to-transparent"></div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center animate-ping absolute"></div>
                  <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center relative shadow-lg border-2 border-white">
                    <MapPin size={14} />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button className="flex-[0.4] px-3 py-2.5 rounded-full bg-white border border-primary/20 text-primary text-xs font-bold hover:bg-primary/5 transition-all">
                  Detail
                </button>
                <button className="flex-1 px-3 py-2.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all active:scale-95 shadow-sm">
                  Lacak Real-time
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Riwayat Aktivitas (Top 5 Items) */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="pt-4 px-4 pb-2 border-b border-gray-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-50 rounded-lg">
                  <History size={16} className="text-dark" />
                </div>
                <h3 className="text-xs font-black text-dark uppercase tracking-widest">
                  Riwayat Aktivitas
                </h3>
              </div>
              <button className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
                Semua <ChevronRight size={12} />
              </button>
            </div>

            <div className="divide-y divide-gray-50 flex-1 overflow-auto">
              {[
                {
                  id: 1,
                  type: "Antar Sampah",
                  date: "24 April",
                  amount: "+ Rp 25.000",
                  weight: "5.2kg",
                  status: "Berhasil",
                },
                {
                  id: 2,
                  type: "Antar Sampah",
                  date: "21 April",
                  amount: "- Rp 12.000",
                  weight: "3.1kg",
                  status: "Berhasil",
                },
                {
                  id: 3,
                  type: "Tarik Saldo",
                  date: "18 April",
                  amount: "- Rp 50.000",
                  weight: null,
                  status: "Proses",
                },
                {
                  id: 4,
                  type: "Antar Sampah",
                  date: "15 April",
                  amount: "+ Rp 18.500",
                  weight: "4.0kg",
                  status: "Berhasil",
                },
                {
                  id: 5,
                  type: "Antar Sampah",
                  date: "12 April",
                  amount: "+ Rp 21.000",
                  weight: "4.8kg",
                  status: "Berhasil",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-gray-50/50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black transition-transform group-hover:scale-110",
                        item.amount.startsWith("+")
                          ? "bg-primary-light/40 text-green-600 border border-green-100"
                          : "bg-red-50 text-red-600 border border-red-100",
                      )}
                    >
                      {item.amount.startsWith("+") ? "IN" : "OUT"}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-dark mb-0.5">
                        {item.type}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                        <Calendar size={10} />
                        <span>{item.date}</span>
                        {item.weight && <span>• {item.weight}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "text-xs font-bold mb-0.5",
                        item.amount.startsWith("+")
                          ? "text-green-600"
                          : "text-dark",
                      )}
                    >
                      {item.amount}
                    </p>
                    <p
                      className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md inline-block",
                        item.status === "Berhasil"
                          ? "bg-green-50 text-green-600"
                          : "bg-orange-50 text-orange-600",
                      )}
                    >
                      {item.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Tips & Bantuan (Double Widget) */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
            <div className="bg-primary-light p-5 md:p-6 rounded-2xl text-white relative overflow-hidden  flex flex-col justify-between group h-full lg:h-auto min-h-[180px]">
              <div className="relative z-10">
                <div className="w-8 h-8 bg-dark rounded-lg flex items-center justify-center mb-3 group-hover:rotate-12 transition-transform">
                  <TrendingUp size={18} />
                </div>
                <h4 className="text-dark font-extrabold text-xs md:text-sm mb-1 uppercase tracking-widest">
                  Tips Hari Ini
                </h4>
                <p className="text-[11px] text-dark md:text-xsleading-relaxed">
                  Pisahkan sampah organik & anorganik untuk dapatkan **bonus 15%
                  poin** minggu ini!
                </p>
              </div>
              <button className="relative z-10 mt-4 w-full text-xs font-bold bg-white text-primary py-2.5 rounded-md cursor-pointer transition-all active:scale-95">
                Pelajari Detail
              </button>
              <div className="absolute -right-6 -bottom-6 opacity-10 transform rotate-12 scale-150">
                <Trash2 size={120} />
              </div>
            </div>

            <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-full lg:h-auto min-h-[180px]">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-primary/5 rounded-lg">
                    <HelpCircle size={16} className="text-primary" />
                  </div>
                  <h4 className="font-bold text-dark text-xs md:text-sm uppercase tracking-widest opacity-80">
                    Bantuan
                  </h4>
                </div>
                <p className="text-[11px] text-gray-400 mb-4 leading-snug">
                  Punya kendala dengan kurir atau aplikasi? Tim kami siap sedia.
                </p>
              </div>
              <div className="space-y-2">
                <button className="w-full text-left p-2.5 rounded-md bg-gray-50 text-[11px] font-bold text-dark hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-between group border border-transparent hover:border-primary/10">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-primary" />
                    Pusat Panduan
                  </div>
                  <ChevronRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                  />
                </button>
                <button className="w-full text-left p-2.5 rounded-md bg-gray-50 text-[11px] font-bold text-dark hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-between group border border-transparent hover:border-primary/10">
                  <div className="flex items-center gap-2">
                    <Headphones size={14} className="text-primary" />
                    Customer Service
                  </div>
                  <ChevronRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
