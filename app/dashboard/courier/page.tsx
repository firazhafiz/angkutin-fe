"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import WalletCard from "@/components/dashboard/WalletCard";
import StatCard from "@/components/dashboard/StatCard";
import IncomingAlert from "@/components/courier/IncomingAlert";
import MissionCard from "@/components/courier/MissionCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletService } from "@/services/wallet.service";
import { courierService } from "@/services/courier.service";
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
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { OrderStatus } from "@/types/enums";

export default function CourierDashboard() {
  const queryClient = useQueryClient();
  const [showIncoming, setShowIncoming] = useState(false);
  const [hasActiveOrder, setHasActiveOrder] = useState(true);

  // Fetch Courier Profile
  const { data: courierProfileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["courierProfile"],
    queryFn: courierService.getProfile,
  });

  const courierProfile = courierProfileData?.data;
  const isOnline = courierProfile?.isOnline ?? false;

  // Mutate Online Status
  const statusMutation = useMutation({
    mutationFn: (newStatus: boolean) => courierService.updateStatus(newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courierProfile"] });
    },
  });

  const handleToggleStatus = () => {
    statusMutation.mutate(!isOnline);
  };

  const { data: walletData, isLoading: isWalletLoading } = useQuery({
    queryKey: ["walletBalance"],
    queryFn: walletService.getBalance,
  });

  const { data: txData, isLoading: isTxLoading } = useQuery({
    queryKey: ["walletTransactions"],
    queryFn: walletService.getTransactions,
  });

  const walletBalance = walletData?.data?.balance || 0;

  // Filter and limit transactions for the dashboard
  const transactions = (txData?.data || [])
    .filter((tx) => ["SUCCESS"].includes(tx.status))
    .slice(0, 5);

  const formatDateShort = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout role="courier">
      {/* IncomingAlert Overlay */}
      {showIncoming && (
        <IncomingAlert
          customerName="Firaz Hafiz"
          address="Jl. Kebon Sirih No. 45, Surabaya"
          distance="0.8 km"
          estimatedEarning="+ Rp 15.000"
          vehicleType="Motor"
          onAccept={() => {
            setShowIncoming(false);
            setHasActiveOrder(true);
            window.location.href = "/dashboard/courier/missions/mock-order-123";
          }}
          onReject={() => setShowIncoming(false)}
        />
      )}

      <div className="space-y-6">
        {/* Header Section: Welcome & Online Toggle */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-black text-dark">
              Halo, Kurir Angkutin! 👋
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Siap untuk menjaga lingkungan hari ini?
            </p>
          </div>

          <div className="flex items-center justify-between md:justify-start gap-4 rounded-xl w-full md:w-auto">
            <div className="flex flex-col">
              <span className="text-xs font-light text-gray-400 leading-none">
                Status Kerja
              </span>
              <span
                className={cn(
                  "text-sm font-bold mt-1.5 transition-colors",
                  isOnline ? "text-primary" : "text-gray-400",
                )}
              >
                {isOnline ? "Online (Siap Kerja)" : "Offline (Istirahat)"}
              </span>
            </div>

            <button
              disabled={statusMutation.isPending || isProfileLoading}
              onClick={handleToggleStatus}
              className={cn(
                "relative inline-flex h-11 w-20 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner shrink-0",
                isOnline ? "bg-primary" : "bg-gray-300",
                (statusMutation.isPending || isProfileLoading) && "opacity-50 cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 transform",
                  isOnline ? "translate-x-10" : "translate-x-1",
                )}
              >
                {statusMutation.isPending || isProfileLoading ? (
                  <Loader2
                    size={14}
                    className="animate-spin text-gray-400"
                  />
                ) : (
                  <Zap
                    size={14}
                    className={cn(
                      "transition-colors",
                      isOnline ? "text-primary fill-primary" : "text-gray-300",
                    )}
                  />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile: Active Order Card (above everything) */}
        {hasActiveOrder && (
          <div className="md:hidden">
            <MissionCard
              orderId="#AGT-55291"
              customerName="Firaz Hafiz"
              address="Jl. Kebon Sirih No. 45, Surabaya"
              status={OrderStatus.ON_GOING}
              distance="0.8 km"
              onClick={() =>
                (window.location.href =
                  "/dashboard/courier/missions/mock-order-123")
              }
            />
          </div>
        )}

        {/* Main Dashboard Grid — 1 col mobile, 3 col desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Col 1: Order Status Card — desktop only full card */}
          <div className="hidden md:block lg:col-span-1">
            <div className="bg-white rounded-2xl overflow-hidden border border-primary/40 flex flex-col ">
              <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-primary/5 shrink-0">
                <div className="flex items-center gap-2 text-primary">
                  <Navigation
                    size={18}
                    className={cn(hasActiveOrder && "animate-pulse")}
                  />
                  <h3 className="text-sm font-bold  tracking-wide">
                    {hasActiveOrder ? "Order Aktif" : "Status Order"}
                  </h3>
                </div>
                {hasActiveOrder && (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full border bg-white text-primary border-primary/20">
                    Sedang Berjalan
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col">
                {isOnline ? (
                  <>
                    {hasActiveOrder ? (
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-4 pb-4">
                            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0 overflow-hidden">
                              <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                alt="User"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-base font-extrabold text-dark tracking-tight">
                                Firaz Hafiz
                              </p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                Customer • 0.8 km
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4 ">
                            <div className="flex items-start gap-3">
                              <MapPin
                                size={20}
                                className="text-primary mt-0.5"
                              />
                              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                Jl. Kebon Sirih No. 45, Surabaya
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Map preview */}
                        <div className="relative h-48 w-full rounded-xl overflow-hidden border border-primary/10 bg-gray-200 shadow-inner">
                          <div className="absolute inset-0 bg-gray-100">
                            <div className="absolute inset-0 bg-linear-to-t from-primary/20 to-transparent" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center animate-ping absolute" />
                              <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center relative shadow-lg border-2 border-white">
                                <MapPin size={14} />
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            (window.location.href =
                              "/dashboard/courier/missions/mock-order-123")
                          }
                          className="w-full py-4 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all active:scale-95"
                        >
                          Buka Detail Misi
                        </button>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                        <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center">
                          <Zap size={32} className="text-primary/20" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-dark">
                            Menunggu Order...
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            GPS Anda terdeteksi di Surabaya
                          </p>
                        </div>
                        <button
                          onClick={() => setShowIncoming(true)}
                          className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors cursor-pointer"
                        >
                          Demo: Simulasi Order Masuk
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                      <Zap size={24} className="text-gray-200" />
                    </div>
                    <p className="text-xs font-bold text-gray-400">
                      Aktifkan status Online untuk mulai bertugas
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile: Waiting / Offline state (when no active order on mobile) */}
          {!hasActiveOrder && (
            <div className="md:hidden bg-white rounded-2xl border border-gray-100 p-6 text-center space-y-3">
              {isOnline ? (
                <>
                  <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mx-auto">
                    <Zap size={24} className="text-primary/30" />
                  </div>
                  <p className="text-sm font-black text-dark">
                    Menunggu Order...
                  </p>
                  <p className="text-[10px] text-gray-400">
                    GPS Anda terdeteksi di Surabaya
                  </p>
                  <button
                    onClick={() => setShowIncoming(true)}
                    className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    Demo: Simulasi Order Masuk
                  </button>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto">
                    <Zap size={24} className="text-gray-200" />
                  </div>
                  <p className="text-xs font-bold text-gray-400">
                    Aktifkan status Online untuk mulai bertugas
                  </p>
                </>
              )}
            </div>
          )}

          {/* Col 2–3: Wallet + Stats + History + Tips */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet — full width of the right area */}
            <WalletCard
              balance={walletBalance}
              isLoading={isWalletLoading}
              showOrderButton={false}
              showWithdrawButton={true}
              onWithdraw={() => (window.location.href = "/dashboard/courier/wallet")}
            />

            {/* Bottom Sub-Grid: Stats+Tips | Accounts | History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Stats cards + Tips */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <StatCard
                    label="Order Selesai"
                    value="156"
                    icon={CheckCircle2}
                    trend="+12"
                    iconClassName="bg-green-50 text-green-600"
                  />
                  <StatCard
                    label="Total Pendapatan"
                    value="Rp 2.4jt"
                    icon={TrendingUp}
                    trend="+15%"
                    iconClassName="bg-primary/10 text-primary"
                  />
                </div>

                {/* Daily Tips */}
                <div className="bg-dark rounded-xl p-6 md:pb-14 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                    <BookOpen size={60} />
                  </div>
                  <div className="flex flex-col">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-secondary mb-3 inline-block">
                        Tips Hari Ini
                      </span>
                      <h4 className="text-lg font-bold mb-2">
                        Meningkatkan Kecepatan Angkut
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed mb-6">
                        Gunakan jalur alternatif saat jam sibuk di area Surabaya
                        Pusat untuk efisiensi waktu.
                      </p>
                    </div>
                    <button className="flex items-center gap-2 text-xs font-black text-secondary uppercase tracking-widest">
                      Baca Selengkapnya <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: History */}
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col h-full max-h-[400px]">
                <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HistoryIcon size={18} className="text-dark" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Riwayat Terakhir
                    </h3>
                  </div>
                  <button
                    onClick={() => (window.location.href = "/dashboard/courier/wallet")}
                    className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
                  >
                    Detail
                  </button>
                </div>
                <div className="divide-y divide-gray-50 overflow-y-auto">
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
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
