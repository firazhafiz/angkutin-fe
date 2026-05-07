"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import WalletCard from "@/components/dashboard/WalletCard";
import StatCard from "@/components/dashboard/StatCard";
import { useQuery } from "@tanstack/react-query";
import { walletService } from "@/services/wallet.service";
import {
  CheckCircle2,
  TrendingUp,
  History as HistoryIcon,
  Navigation,
  BookOpen,
  HelpCircle,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/cn";

export default function CourierDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  // Order states: 'none', 'incoming', 'active'
  const [orderStatus, setOrderStatus] = useState<
    "none" | "incoming" | "active"
  >("incoming");

  const { data: walletData, isLoading: isWalletLoading } = useQuery({
    queryKey: ["walletBalance"],
    queryFn: walletService.getBalance,
  });

  const walletBalance = walletData?.data?.balance || 0;

  return (
    <DashboardLayout role="courier">
      <div className="space-y-6">
        {/* Header Section: Welcome & Online Toggle */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between white rounded-xl ">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-black text-dark">
              Halo, Kurir Angkutin! 👋
            </h2>
            <p className="text-base text-slate-500 font-light">
              Siap untuk menjaga lingkungan hari ini?
            </p>
          </div>

          <div className="flex items-center justify-between md:justify-start gap-4  rounded-xl w-full md:w-auto">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">
                Status Kerja
              </span>
              <span
                className={cn(
                  "text-xs md:text-sm font-bold mt-1.5 transition-colors",
                  isOnline ? "text-primary" : "text-gray-400",
                )}
              >
                {isOnline ? "Online (Siap Kerja)" : "Offline (Istirahat)"}
              </span>
            </div>

            <button
              onClick={() => setIsOnline(!isOnline)}
              className={cn(
                "relative inline-flex h-11 w-20 items-center rounded-full transition-all duration-300 focus:outline-none ring-4 ring-white shadow-inner shrink-0",
                isOnline ? "bg-primary" : "bg-gray-300",
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 transform",
                  isOnline ? "translate-x-10" : "translate-x-1",
                )}
              >
                <Zap
                  size={14}
                  className={cn(
                    "transition-colors",
                    isOnline ? "text-primary fill-primary" : "text-gray-300",
                  )}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Top Section: Wallet & Main Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WalletCard
              balance={walletBalance}
              isLoading={isWalletLoading}
              showOrderButton={false}
              showWithdrawButton={true}
              onWithdraw={() => console.log("Withdraw")}
            />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
            <StatCard
              label="Order Selesai"
              value="156"
              icon={CheckCircle2}
              trend="+12"
              className="w-full"
              iconClassName="bg-green-50 text-green-600"
            />
            <StatCard
              label="Total Pendapatan"
              value="Rp 2.4jt"
              icon={TrendingUp}
              trend="+15%"
              className="w-full"
              iconClassName="bg-primary/10 text-primary"
            />
          </div>
        </div>

        {/* High-Density 3-Column Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {/* Column 1: Order Berjalan / Incoming Order */}
          <div className="bg-primary/5 rounded-xl border border-primary/20 overflow-hidden flex flex-col min-h-[380px]">
            <div className="p-4 border-b border-primary/10 flex items-center justify-between bg-primary/10 shrink-0">
              <div className="flex items-center gap-2 text-primary">
                <Navigation
                  size={16}
                  className={cn(orderStatus !== "none" && "animate-pulse")}
                />
                <h3 className="text-xs font-black uppercase tracking-widest">
                  {orderStatus === "incoming"
                    ? "Order Masuk!"
                    : "Order Berjalan"}
                </h3>
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold px-2 py-1 rounded-full border",
                  orderStatus === "incoming"
                    ? "bg-secondary text-dark border-secondary/20"
                    : "bg-white text-primary border-primary/20",
                )}
              >
                {orderStatus === "incoming" ? "Baru" : "On-Progress"}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              {isOnline ? (
                <>
                  {orderStatus === 'incoming' && (
                    <div className="space-y-4 flex-1 flex flex-col">
                      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-4 mb-5">
                          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0 overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-base font-extrabold text-dark tracking-tight">Firaz Hafiz</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Customer • 0.8 km</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4 mb-6">
                          <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                              <MapPin size={12} className="text-gray-400" />
                            </div>
                            <p className="text-xs font-medium text-slate-600 leading-relaxed">Jl. Kebon Sirih No. 45, Surabaya</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                          <div>
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Estimasi Pendapatan</p>
                            <p className="text-lg font-black text-primary">Rp 15.000</p>
                          </div>
                          <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg uppercase tracking-widest">Tunai</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-auto">
                        <button 
                          onClick={() => setOrderStatus('none')}
                          className="py-4 rounded-2xl bg-white border border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all"
                        >
                          Lewati
                        </button>
                        <button 
                          onClick={() => setOrderStatus('active')}
                          className="py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                        >
                          Terima
                        </button>
                      </div>
                    </div>
                  )}

                  {orderStatus === 'active' && (
                    <div className="space-y-4 flex-1 flex flex-col">
                      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gray-50 overflow-hidden shrink-0">
                              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                            </div>
                            <div>
                              <p className="text-sm font-extrabold text-dark tracking-tight">Firaz Hafiz</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">User Silver</p>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                            <Zap size={14} />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                              <MapPin size={14} className="text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Lokasi Jemput</p>
                              <p className="text-xs font-bold text-dark leading-relaxed">Jl. Kebon Sirih No. 45, Surabaya</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jarak: 0.8 km</span>
                            <button className="text-[10px] font-black text-primary flex items-center gap-1 uppercase tracking-widest">
                              Navigasi <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => setOrderStatus('none')}
                        className="mt-auto w-full py-5 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        Selesaikan Order
                      </button>
                    </div>
                  )}

                  {orderStatus === "none" && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white/50 rounded-2xl border border-dashed border-primary/20">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Zap size={32} className="text-primary/40" />
                      </div>
                      <p className="text-sm font-bold text-dark/60 leading-relaxed">
                        Menunggu order baru masuk...
                      </p>
                      <p className="text-[10px] text-gray-400 mt-2 italic">
                        Pastikan GPS tetap menyala
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white/50 rounded-2xl border border-dashed border-primary/20">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Zap size={24} className="text-primary/40" />
                  </div>
                  <p className="text-sm font-bold text-dark/60">
                    Aktifkan status Online untuk melihat order
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Riwayat Order Terakhir */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-dark">
                <HistoryIcon size={16} />
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                  Riwayat Terakhir
                </h3>
              </div>
              <button className="text-[10px] font-black text-primary uppercase">
                Lihat Semua
              </button>
            </div>

            <div className="divide-y divide-gray-50 overflow-y-auto max-h-[380px]">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div
                  key={i}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-dark">
                      Order #TRX-{1024 + i}
                    </span>
                    <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                      Selesai
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                    <Clock size={12} />
                    <span>06 Mei 2026, 08:{10 + i}</span>
                    <span className="mx-1">•</span>
                    <span className="text-dark font-bold">
                      Rp {15000 + i * 2500}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Bantuan & Tips Hari Ini */}
          <div className="flex flex-col gap-6">
            {/* Tips Card */}
            <div className="bg-dark rounded-3xl p-5 text-white relative overflow-hidden flex-1 group">
              <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:scale-110 transition-transform">
                <BookOpen size={40} />
              </div>
              <div className="relative z-10">
                <span className="inline-block px-2 py-1 rounded-lg bg-white/10 text-[10px] font-black uppercase tracking-widest mb-3">
                  Tips Hari Ini
                </span>
                <h4 className="text-sm font-bold mb-2">
                  Cara packing sampah agar muat lebih banyak
                </h4>
                <p className="text-[10px] text-gray-400 leading-relaxed mb-4">
                  Pastikan sampah plastik sudah dipress agar tidak memakan ruang
                  di tas angkut Anda.
                </p>
                <button className="w-full py-3 rounded-xl bg-white text-dark font-black text-[10px] uppercase tracking-widest hover:bg-secondary transition-all">
                  Pelajari Tips
                </button>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-dark uppercase tracking-tight">
                    Butuh Bantuan?
                  </h4>
                  <p className="text-[10px] text-gray-400">
                    Hubungi tim support kami
                  </p>
                </div>
              </div>
              <button className="w-full py-3 rounded-xl border border-gray-100 text-dark font-bold text-xs hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <ShieldCheck size={14} className="text-primary" />
                Pusat Bantuan
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
