"use client";

import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import WalletCard from "@/components/dashboard/WalletCard";
import StatCard from "@/components/dashboard/StatCard";
import { useQuery } from "@tanstack/react-query";
import { walletService } from "@/services/wallet.service";
import { orderService } from "@/services/order.service";
import MapboxView, { MapboxMarker } from "@/components/maps/MapboxView";
import { OrderStatus } from "@/types/enums";
import type { Order } from "@/types/models";
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
  Loader2,
  Package,
} from "lucide-react";

// Status yang menandakan order sedang aktif (belum selesai/batal)
const ACTIVE_STATUSES: OrderStatus[] = [
  OrderStatus.CREATED,
  OrderStatus.MATCHED,
  OrderStatus.ON_GOING,
  OrderStatus.ARRIVED,
  OrderStatus.WEIGHING,
  OrderStatus.WAITING_PAYMENT,
  OrderStatus.PICKED_UP,
  OrderStatus.DELIVERING,
];

const STATUS_LABELS: Record<string, string> = {
  [OrderStatus.CREATED]: "Mencari Kurir",
  [OrderStatus.MATCHED]: "Kurir Ditemukan",
  [OrderStatus.ON_GOING]: "Menuju Lokasi",
  [OrderStatus.ARRIVED]: "Kurir Tiba",
  [OrderStatus.WEIGHING]: "Penimbangan",
  [OrderStatus.WAITING_PAYMENT]: "Menunggu Bayar",
  [OrderStatus.PICKED_UP]: "Diangkut",
  [OrderStatus.DELIVERING]: "Diantar ke Gudang",
};

export default function UserDashboard() {
  const { data: walletData, isLoading: isWalletLoading } = useQuery({
    queryKey: ["walletBalance"],
    queryFn: walletService.getBalance,
  });

  const { data: txData, isLoading: isTxLoading } = useQuery({
    queryKey: ["walletTransactions"],
    queryFn: walletService.getTransactions,
  });

  // Fetch orders to find active order
  const { data: ordersData } = useQuery({
    queryKey: ["userOrders"],
    queryFn: () => orderService.getOrders(),
  });

  const walletBalance = walletData?.data?.balance || 0;

  // Find active order (first non-completed/cancelled)
  const allOrders: Order[] = ordersData?.data || [];
  const activeOrder = allOrders.find((o) =>
    ACTIVE_STATUSES.includes(o.status),
  );

  // Filter history orders (Completed/Cancelled)
  const historyOrders = allOrders
    .filter((o) => o.status === OrderStatus.COMPLETED || o.status === OrderStatus.CANCELLED)
    .map(o => ({
      id: o.id,
      type: "ORDER",
      status: o.status,
      title: o.status === OrderStatus.COMPLETED ? "Angkut Sampah" : "Pesanan Dibatalkan",
      amount: o.totalCredit || 0,
      createdAt: o.createdAt,
      isIncome: o.status === OrderStatus.COMPLETED
    }));
  
  // Filter and limit transactions for the dashboard
  const transactionItems = (txData?.data || [])
    .filter((tx) => ["SUCCESS"].includes(tx.status))
    .map(tx => {
      const isWithdrawal = tx.referenceType === "WITHDRAWAL";
      return {
        id: tx.id,
        type: "TRANSACTION",
        status: tx.status,
        title: isWithdrawal ? "Tarik Saldo" : (tx.description || tx.referenceType).split(" - ")[0],
        amount: tx.amount,
        createdAt: tx.createdAt,
        isIncome: tx.type === "CREDIT"
      };
    });

  // Merge and sort all history items
  const combinedHistory = [...historyOrders, ...transactionItems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const formatDateShort = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

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

        {/* Mobile Only: Active Order Card (above stats) */}
        {activeOrder && (
        <div className="md:hidden">
          <div className="bg-primary/5 rounded-2xl border border-primary/20 overflow-hidden shadow-sm">
            <div className="p-3 border-b border-primary/10 flex items-center justify-between bg-primary/10">
              <div className="flex items-center gap-2 text-primary">
                <Navigation size={14} className="animate-pulse" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">
                  Pesanan Berjalan
                </h3>
              </div>
              <span className="text-[9px] font-bold bg-white text-primary px-2 py-0.5 rounded-full border border-primary/20">
                {STATUS_LABELS[activeOrder.status] || activeOrder.status}
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-lg border-2 border-white shrink-0">
                  {activeOrder.courier?.user?.name?.charAt(0) || "K"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-dark leading-none">
                    {activeOrder.status === OrderStatus.MATCHED && activeOrder.scheduleType === "SCHEDULED" 
                      ? "Menunggu jam jemput" 
                      : (activeOrder.courier?.user?.name || "Mencari kurir...")}
                  </p>
                  <p className="text-[10px] font-bold text-primary mt-1 uppercase tracking-wider">
                    {activeOrder.id.slice(0, 8).toUpperCase()} 
                    {activeOrder.courier?.vehicleType ? ` • ${activeOrder.courier.vehicleType}` : ""}
                    {activeOrder.scheduleType === "SCHEDULED" && activeOrder.status === OrderStatus.MATCHED && activeOrder.scheduledAt && ` • Jam ${new Date(activeOrder.scheduledAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const isSearchStep = activeOrder.status === OrderStatus.CREATED || activeOrder.status === OrderStatus.MATCHED;
                    window.location.href = isSearchStep 
                      ? `/dashboard/user/order/search?orderId=${activeOrder.id}`
                      : `/dashboard/user/order/tracking/${activeOrder.id}`;
                  }}
                  className="px-4 py-2 rounded-full bg-primary text-white text-[10px] font-black hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
                >
                  {activeOrder.status === OrderStatus.CREATED || activeOrder.status === OrderStatus.MATCHED ? "Cek Radar" : "Lacak"}
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Top Section: Wallet & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WalletCard
              balance={walletBalance}
              isLoading={isWalletLoading}
              onOrder={() => (window.location.href = "/dashboard/user/order")}
              onWithdraw={() => (window.location.href = "/dashboard/user/wallet")}
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
          {/* Column 1: Pesanan Berjalan with Map Preview (Desktop only — mobile version is above) */}
          {activeOrder ? (
          <div className="hidden md:flex bg-primary/5 rounded-2xl border border-primary/20 overflow-hidden shadow-sm flex-col">
            <div className="p-4 border-b border-primary/10 flex items-center justify-between bg-primary/10 shrink-0">
              <div className="flex items-center gap-2 text-primary">
                <Navigation size={16} className="animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-widest">
                  Pesanan Berjalan
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-white text-primary px-2 py-1 rounded-full border border-primary/20">
                {STATUS_LABELS[activeOrder.status] || activeOrder.status}
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xl border-2 border-white shrink-0">
                  {activeOrder.courier?.user?.name?.charAt(0) || "K"}
                </div>
                <div>
                  <p className="text-md font-bold text-dark leading-none">
                    {activeOrder.status === OrderStatus.MATCHED && activeOrder.scheduleType === "SCHEDULED" 
                      ? "Menunggu jam jemput" 
                      : (activeOrder.courier?.user?.name || "Mencari kurir...")}
                  </p>
                  <p className="text-xs font-bold text-primary mt-2 uppercase tracking-wider">
                    {activeOrder.id.slice(0, 8).toUpperCase()} 
                    {activeOrder.courier?.vehicleType ? ` • ${activeOrder.courier.vehicleType}` : ""}
                    {activeOrder.scheduleType === "SCHEDULED" && activeOrder.status === OrderStatus.MATCHED && activeOrder.scheduledAt && ` • Jam ${new Date(activeOrder.scheduledAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`}
                  </p>
                </div>
              </div>

              {/* Map Preview */}
              <div className="h-48 w-full rounded-xl overflow-hidden border border-primary/10 shadow-inner">
                <MapboxView
                  className="w-full h-full"
                  center={[
                    activeOrder.address?.longitude ? Number(activeOrder.address.longitude) : 112.7521,
                    activeOrder.address?.latitude ? Number(activeOrder.address.latitude) : -7.2575
                  ]}
                  zoom={13}
                  interactive={false}
                  markers={[
                    {
                      id: "user",
                      lat: activeOrder.address?.latitude ? Number(activeOrder.address.latitude) : -7.2575,
                      lng: activeOrder.address?.longitude ? Number(activeOrder.address.longitude) : 112.7521,
                      type: "user"
                    }
                  ]}
                />
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => (window.location.href = `/dashboard/user/history/${activeOrder.id}`)}
                  className="flex-[0.4] px-3 py-2.5 rounded-full bg-white border border-primary/20 text-primary text-xs font-bold hover:bg-primary/5 transition-all"
                >
                  Detail
                </button>
                <button
                  onClick={() => {
                    const isSearchStep = activeOrder.status === OrderStatus.CREATED || activeOrder.status === OrderStatus.MATCHED;
                    window.location.href = isSearchStep 
                      ? `/dashboard/user/order/search?orderId=${activeOrder.id}`
                      : `/dashboard/user/order/tracking/${activeOrder.id}`;
                  }}
                  className="flex-1 px-3 py-2.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all active:scale-95 shadow-sm"
                >
                  {activeOrder.status === OrderStatus.CREATED || activeOrder.status === OrderStatus.MATCHED ? "Cek Radar" : "Lacak Kurir"}
                </button>
              </div>
            </div>
          </div>
          ) : (
          <div className="hidden md:flex bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex-col items-center justify-center p-8">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-3">
              <Package size={24} />
            </div>
            <p className="text-sm font-bold text-gray-400">Tidak ada pesanan aktif</p>
            <button
              onClick={() => (window.location.href = "/dashboard/user/order")}
              className="mt-3 px-5 py-2 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all active:scale-95"
            >
              Buat Pesanan Baru
            </button>
          </div>
          )}

          {/* Column 2: Riwayat */}
          <div className="lg:col-span-1 space-y-6">
            {/* Riwayat Aktivitas (Top 3 for space) */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full max-h-[500px]">
              <div className="pt-4 px-4 pb-2 border-b border-gray-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gray-50 rounded-lg">
                    <History size={16} className="text-dark" />
                  </div>
                  <h3 className="text-xs font-black text-dark uppercase tracking-widest">
                    Riwayat
                  </h3>
                </div>
                <button
                  onClick={() => (window.location.href = "/dashboard/user/wallet")}
                  className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                >
                  Semua <ChevronRight size={12} />
                </button>
              </div>

              <div className="divide-y divide-gray-50 flex-1 overflow-auto">
                {isTxLoading || isWalletLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                ) : combinedHistory.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Belum ada riwayat
                    </p>
                  </div>
                ) : (
                  combinedHistory.map((item) => {
                    const isOrder = item.type === "ORDER";
                    const isCancelled = item.status === OrderStatus.CANCELLED;

                    return (
                      <div
                        key={item.id}
                        className="p-4 hover:bg-gray-50/50 transition-colors flex items-center justify-between cursor-pointer"
                        onClick={() => {
                          if (isOrder) {
                            window.location.href = `/dashboard/user/history/${item.id}`;
                          } else {
                            window.location.href = "/dashboard/user/wallet";
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center text-[8px] font-black",
                              item.isIncome
                                ? "bg-primary/10 text-primary"
                                : isCancelled 
                                  ? "bg-red-50 text-red-400"
                                  : "bg-red-50 text-red-600",
                            )}
                          >
                            {isOrder ? (isCancelled ? "X" : "ORD") : (item.isIncome ? "IN" : "OUT")}
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-dark">
                              {item.title}
                            </p>
                            <p className="text-[9px] text-gray-400 font-medium">
                              {formatDateShort(item.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={cn(
                              "text-[11px] font-bold",
                              item.isIncome ? "text-green-600" : (isCancelled ? "text-gray-400" : "text-dark"),
                            )}
                          >
                            {isCancelled ? "" : (item.isIncome ? "+" : "-")} Rp{" "}
                            {item.amount.toLocaleString("id-ID")}
                          </p>
                          {isOrder && !isCancelled && (
                            <p className="text-[8px] font-bold text-primary mt-0.5">
                              #{item.id.slice(0, 6).toUpperCase()}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
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
