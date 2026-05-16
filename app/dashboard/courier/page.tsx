"use client";

import React, { useState, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import WalletCard from "@/components/dashboard/WalletCard";
import StatCard from "@/components/dashboard/StatCard";
import IncomingAlert from "@/components/courier/IncomingAlert";
import MissionCard from "@/components/courier/MissionCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletService } from "@/services/wallet.service";
import { courierService } from "@/services/courier.service";
import MapboxView from "@/components/maps/MapboxView";
import {
  CheckCircle2,
  TrendingUp,
  History as HistoryIcon,
  Navigation,
  BookOpen,
  MapPin,
  Clock,
  ArrowRight,
  Zap,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { OrderStatus } from "@/types/enums";
import type { Order } from "@/types/models";

// Active order statuses (already accepted)
const ACTIVE_STATUSES: OrderStatus[] = [
  OrderStatus.MATCHED,
  OrderStatus.ON_GOING,
  OrderStatus.ARRIVED,
  OrderStatus.WEIGHING,
  OrderStatus.WAITING_PAYMENT,
  OrderStatus.PICKED_UP,
  OrderStatus.DELIVERING,
];

const STATUS_LABELS: Record<string, string> = {
  [OrderStatus.MATCHED]: "Menunggu Berangkat",
  [OrderStatus.ON_GOING]: "Menuju Lokasi",
  [OrderStatus.ARRIVED]: "Tiba di Lokasi",
  [OrderStatus.WEIGHING]: "Penimbangan",
  [OrderStatus.WAITING_PAYMENT]: "Menunggu Bayar",
  [OrderStatus.PICKED_UP]: "Diangkut",
  [OrderStatus.DELIVERING]: "Mengantar",
};

export default function CourierDashboard() {
  const queryClient = useQueryClient();
  const [dismissedOfferIds, setDismissedOfferIds] = useState<string[]>([]);
  const [acceptedOfferIds, setAcceptedOfferIds] = useState<string[]>([]);

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

  // Fetch courier's active/assigned orders
  const { data: ordersData } = useQuery({
    queryKey: ["courierOrders"],
    queryFn: () => courierService.getMyOrders(),
    refetchInterval: 3000,
    enabled: isOnline,
  });

  // Fetch available orders for broadcast matching
  const { data: availableOrdersData } = useQuery({
    queryKey: ["availableOrders"],
    queryFn: () => courierService.getAvailableOrders(),
    refetchInterval: 3000,
    enabled: isOnline,
  });

  const walletBalance = walletData?.data?.balance || 0;

  // Find active order from BE
  const allOrders: Order[] = ordersData?.data || [];
  
  // Incoming order: from available broadcast (status CREATED)
  const incomingOrder = useMemo(
    () => {
      const available = availableOrdersData?.data || [];
      return available.find((o: Order) => !dismissedOfferIds.includes(o.id));
    },
    [availableOrdersData, dismissedOfferIds]
  );

  const activeOrder = useMemo(
    () => allOrders.find((o: Order) => ACTIVE_STATUSES.includes(o.status)),
    [allOrders],
  );

  const hasActiveOrder = !!activeOrder;
  const completedOrders = allOrders.filter(
    (o: Order) => o.status === OrderStatus.COMPLETED,
  );
  // History: completed + cancelled, sorted newest first
  const historyOrders = allOrders
    .filter((o: Order) => o.status === OrderStatus.COMPLETED || o.status === OrderStatus.CANCELLED)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <DashboardLayout role="courier">
      {/* IncomingAlert Overlay */}
      {incomingOrder && (
        <IncomingAlert
          customerName={incomingOrder.user?.name || "Customer"}
          address={incomingOrder.address?.addressDetail || "-"}
          vehicleType={incomingOrder.courier?.vehicleType || incomingOrder.aiResults?.[0]?.recommendedVehicle || "Motor"}
          isScheduled={incomingOrder.scheduleType === "SCHEDULED"}
          scheduledTime={incomingOrder.scheduledAt ? new Date(incomingOrder.scheduledAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : undefined}
          note={incomingOrder.note || undefined}
          onAccept={async () => {
            if (!incomingOrder) return;
            const orderId = incomingOrder.id;
            try {
              await courierService.acceptOrder(orderId);
              queryClient.invalidateQueries({ queryKey: ["courierOrders"] });
              queryClient.invalidateQueries({ queryKey: ["availableOrders"] });
              window.location.href = `/dashboard/courier/missions/${orderId}`;
            } catch (err) {
              console.error("Accept failed:", err);
            }
          }}
          onDismiss={() => {
            if (!incomingOrder) return;
            setDismissedOfferIds((prev) => [...prev, incomingOrder.id]);
          }}
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
                (statusMutation.isPending || isProfileLoading) &&
                  "opacity-50 cursor-not-allowed",
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 transform",
                  isOnline ? "translate-x-10" : "translate-x-1",
                )}
              >
                {statusMutation.isPending || isProfileLoading ? (
                  <Loader2 size={14} className="animate-spin text-gray-400" />
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
        {activeOrder && (
          <div className="md:hidden">
            <MissionCard
              orderId={`#${activeOrder.id.slice(0, 8).toUpperCase()}`}
              customerName={activeOrder.user?.name || "User"}
              address={
                activeOrder.address?.addressDetail ||
                [activeOrder.address?.village, activeOrder.address?.district]
                  .filter(Boolean)
                  .join(", ") ||
                "-"
              }
              status={activeOrder.status}
              distance="-"
              onClick={() =>
                (window.location.href = `/dashboard/courier/missions/${activeOrder.id}`)
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
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg shrink-0">
                              {activeOrder?.user?.name?.charAt(0) || "U"}
                            </div>
                            <div>
                              <p className="text-base font-extrabold text-dark tracking-tight">
                                {activeOrder?.user?.name || "User"}
                              </p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                {STATUS_LABELS[activeOrder?.status || ""] ||
                                  "Aktif"}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <MapPin
                                size={20}
                                className="text-primary mt-0.5"
                              />
                              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                {activeOrder?.address?.addressDetail ||
                                  [
                                    activeOrder?.address?.village,
                                    activeOrder?.address?.district,
                                  ]
                                    .filter(Boolean)
                                    .join(", ") ||
                                  "-"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Map Preview */}
                        <div className="h-48 w-full rounded-xl overflow-hidden border border-primary/10 shadow-inner">
                          <MapboxView
                            className="w-full h-full"
                            center={[
                              activeOrder?.address?.longitude ? Number(activeOrder.address.longitude) : 112.7521,
                              activeOrder?.address?.latitude ? Number(activeOrder.address.latitude) : -7.2575
                            ]}
                            zoom={13}
                            interactive={false}
                            markers={[
                              {
                                id: "destination",
                                lat: activeOrder?.address?.latitude ? Number(activeOrder.address.latitude) : -7.2575,
                                lng: activeOrder?.address?.longitude ? Number(activeOrder.address.longitude) : 112.7521,
                                type: "user"
                              }
                            ]}
                          />
                        </div>

                        <button
                          onClick={() =>
                            (window.location.href = `/dashboard/courier/missions/${activeOrder?.id}`)
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
            <WalletCard
              balance={walletBalance}
              isLoading={isWalletLoading}
              showOrderButton={false}
              showWithdrawButton={true}
              onWithdraw={() =>
                (window.location.href = "/dashboard/courier/wallet")
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <StatCard
                    label="Order Selesai"
                    value={String(completedOrders.length)}
                    icon={CheckCircle2}
                    trend={
                      completedOrders.length > 0
                        ? `+${Math.min(completedOrders.length, 12)}`
                        : "0"
                    }
                    iconClassName="bg-green-50 text-green-600"
                  />
                  <StatCard
                    label="Total Order"
                    value={String(allOrders.length)}
                    icon={TrendingUp}
                    iconClassName="bg-primary/10 text-primary"
                  />
                </div>

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

              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col h-full max-h-[400px]">
                <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
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
                <div className="divide-y divide-gray-50 overflow-y-auto flex-1 scrollbar-hide">
                  {historyOrders.length > 0 ? (
                    historyOrders.map((order) => {
                      const isCancelled = order.status === OrderStatus.CANCELLED;
                      return (
                        <div
                          key={order.id}
                          className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                          onClick={() => (window.location.href = `/dashboard/courier/missions/${order.id}`)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-black text-dark">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full",
                              isCancelled ? "text-red-500 bg-red-50" : "text-green-500 bg-green-50"
                            )}>
                              {isCancelled ? "Dibatalkan" : "Selesai"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                            <Clock size={12} />
                            <span>{new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                            <span className="mx-1">•</span>
                            <span className="text-dark font-bold">{order.user?.name || "Customer"}</span>
                          </div>
                          {order.address && (
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                              <MapPin size={10} className="shrink-0" />
                              <span className="truncate">{order.address.addressDetail}</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-[10px] font-bold text-gray-400">Belum ada riwayat</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
