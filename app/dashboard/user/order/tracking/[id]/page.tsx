"use client";

import React, { useState, useEffect, useCallback } from "react";
import LiveTracker from "@/components/maps/LiveTracker";
import OrderTimeline from "@/components/order/OrderTimeline";
import BottomNav from "@/components/dashboard/BottomNav";
import { parseDecimal } from "@/lib/decimal";
import {
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Scale,
  CheckCircle2,
  Package,
  Clock,
  Calendar,
  Loader2,
  XCircle,
  Ban,
  AlertTriangle,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { OrderStatus } from "@/types/enums";
import { cn } from "@/lib/cn";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import type { Order } from "@/types/models";

// ─── Weighing View (User: Read-Only, waiting) ───
function WeighingView() {
  return (
    <div className="p-4 space-y-4">
      <div className="text-center py-4">
        <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
          <Scale size={28} className="text-secondary animate-pulse" />
        </div>
        <h3 className="text-lg font-black text-dark">Proses Penimbangan</h3>
        <p className="text-xs text-gray-500 mt-1">
          Kurir sedang menimbang sampah Anda
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 py-6">
        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
        <span className="text-[10px] font-black text-secondary uppercase tracking-widest">
          Menunggu kurir menyelesaikan timbangan...
        </span>
      </div>
    </div>
  );
}

// ─── Weighing Summary (User: after courier submits) ───
function WeighingSummaryView({ order }: { order: Order }) {
  const wasteItems = order.wasteItems || [];
  const mutuItems = wasteItems.filter((w) => w.category === "mutu");
  const residuItems = wasteItems.filter((w) => w.category === "residu");
  const mutuKg = mutuItems.reduce((s, w) => s + (w.weightKg || 0), 0);
  const residuKg = residuItems.reduce((s, w) => s + (w.weightKg || 0), 0);
  const needsPayment = (order.totalDebit ?? 0) > 0;

  return (
    <div className="p-4 space-y-4">
      <div className="text-center py-3">
        <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
          <Scale size={28} className="text-secondary" />
        </div>
        <h3 className="text-lg font-black text-dark">Hasil Penimbangan</h3>
        <p className="text-xs text-gray-500 mt-1">
          Ringkasan sampah yang telah ditimbang kurir
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
          <div className="pr-4">
            <p className="text-[9px] font-black text-green-600 uppercase tracking-widest mb-1">
              Total Mutu
            </p>
            <p className="text-2xl font-black text-dark">
              {mutuKg.toFixed(1)} kg
            </p>
          </div>
          <div className="pl-4">
            <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">
              Total Residu
            </p>
            <p className="text-2xl font-black text-dark">
              {residuKg.toFixed(1)} kg
            </p>
          </div>
        </div>

        {wasteItems.length > 0 && (
          <div className="p-4 space-y-3">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Jenis Sampah
              </p>
              <div className="flex flex-wrap gap-2">
                {wasteItems.map((w, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-600"
                  >
                    {w.type || w.category}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-dashed border-gray-100">
              {order.totalCredit > 0 && (
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-gray-500">Kredit (Mutu)</span>
                  <span className="text-xs font-bold text-green-600">
                    + Rp {order.totalCredit.toLocaleString("id-ID")}
                  </span>
                </div>
              )}
              {(order.totalDebit ?? 0) > 0 && (
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-gray-500">Debit (Residu)</span>
                  <span className="text-xs font-bold text-red-500">
                    - Rp {(order.totalDebit ?? 0).toLocaleString("id-ID")}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div
          className={cn(
            "p-4 flex items-center justify-between",
            needsPayment ? "bg-red-50" : "bg-primary/5",
          )}
        >
          <p className="text-xs font-black text-dark uppercase">
            {needsPayment ? "Total Tagihan" : "Saldo Masuk"}
          </p>
          <p
            className={cn(
              "text-lg font-black",
              needsPayment ? "text-red-600" : "text-primary",
            )}
          >
            Rp{" "}
            {Math.abs(order.netTotal ?? order.totalCredit ?? 0).toLocaleString(
              "id-ID",
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 pt-2">
        <CheckCircle2 size={14} className="text-secondary" />
        <span className="text-[10px] font-bold text-gray-400">
          Data telah divalidasi oleh sistem
        </span>
      </div>
    </div>
  );
}

// ─── Scheduled Wait View ───
function ScheduledWaitView({ order }: { order: Order }) {
  const scheduledTime = order.scheduledAt
    ? new Date(order.scheduledAt).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <div className="p-4 space-y-4">
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Calendar size={32} className="text-primary" />
        </div>
        <h3 className="text-lg font-black text-dark">Pesanan Terjadwal</h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          Kurir akan berangkat sesuai jadwal yang ditentukan
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 text-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          Jadwal Penjemputan
        </p>
        <p className="text-3xl font-black text-primary">{scheduledTime}</p>
      </div>

      {order.courier && (
        <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-lg shrink-0">
            {order.courier.user?.name?.charAt(0) || "K"}
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-dark">
              {order.courier.user?.name || "Kurir"}
            </p>
            <p className="text-[10px] text-gray-400 font-bold">
              {order.courier.vehiclePlate} • {order.courier.vehicleType}
            </p>
          </div>
          <CheckCircle2 size={20} className="text-primary" />
        </div>
      )}

      <div className="flex items-center justify-center gap-2 py-2">
        <Clock size={14} className="text-primary" />
        <span className="text-[10px] font-bold text-gray-500">
          Kurir akan otomatis berangkat saat jam tiba
        </span>
      </div>
    </div>
  );
}

// ─── Pickup Confirmation (User view) ───
function PickupView() {
  return (
    <div className="p-4 text-center space-y-4 py-8">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <Package size={32} className="text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-black text-dark">Sampah Telah Diangkut</h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-xs mx-auto">
          Kurir sedang memuat sampah ke kendaraan. Proses pengantaran ke gudang
          daur ulang akan segera dimulai.
        </p>
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
          Menunggu kurir berangkat...
        </span>
      </div>
    </div>
  );
}

// ─── Completed View ───
function CompletedView({
  order,
  onSummary,
}: {
  order: Order;
  onSummary: () => void;
}) {
  const wasteItems = order.wasteItems || [];
  const mutuKg = wasteItems
    .filter((w) => w.category === "mutu")
    .reduce((s, w) => s + (w.weightKg || 0), 0);
  const residuKg = wasteItems
    .filter((w) => w.category === "residu")
    .reduce((s, w) => s + (w.weightKg || 0), 0);

  return (
    <div className="p-4 text-center space-y-5 py-8">
      <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
        <CheckCircle2 size={40} className="text-secondary" />
      </div>
      <div>
        <h3 className="text-xl font-black text-dark">Pesanan Selesai! 🎉</h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-xs mx-auto">
          Sampah Anda telah diantar ke gudang daur ulang. Terima kasih sudah
          berkontribusi untuk lingkungan yang lebih bersih!
        </p>
      </div>
      {wasteItems.length > 0 && (
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
          <div className="p-3 rounded-xl bg-green-50 border border-green-100">
            <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest">
              Mutu
            </p>
            <p className="text-base font-black text-green-700">
              {mutuKg.toFixed(1)} kg
            </p>
          </div>
          <div className="p-3 rounded-xl bg-red-50 border border-red-100">
            <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest">
              Residu
            </p>
            <p className="text-base font-black text-red-600">
              {residuKg.toFixed(1)} kg
            </p>
          </div>
        </div>
      )}
      <button
        onClick={onSummary}
        className="w-full py-4 rounded-full bg-primary text-white font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors cursor-pointer"
      >
        Lihat Ringkasan Pesanan
      </button>
    </div>
  );
}

// ─── Cancelled View ───
function CancelledView({
  order,
  onBack,
}: {
  order: Order;
  onBack: () => void;
}) {
  return (
    <div className="p-4 text-center space-y-5 py-8">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">
        <Ban size={40} className="text-red-400" />
      </div>
      <div>
        <h3 className="text-xl font-black text-dark">Pesanan Dibatalkan</h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-xs mx-auto">
          Pesanan ini telah dibatalkan. Tidak ada biaya yang dikenakan.
        </p>
      </div>
      <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-center">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">
          Status
        </p>
        <p className="text-sm font-black text-red-600">Dibatalkan</p>
      </div>
      <button
        onClick={onBack}
        className="w-full py-4 rounded-full bg-dark text-white font-black text-xs uppercase tracking-widest hover:bg-primary transition-colors cursor-pointer"
      >
        Kembali ke Dashboard
      </button>
    </div>
  );
}

// ─── Cancel Confirmation Modal ───
function CancelModal({
  onConfirm,
  onClose,
  loading,
}: {
  onConfirm: (reason: string) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [reason, setReason] = useState("");
  const reasons = [
    "Berubah pikiran",
    "Salah alamat",
    "Kurir terlalu lama",
    "Lainnya",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center p-4 sm:items-center">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-black text-dark">Batalkan Pesanan?</h3>
            <p className="text-[10px] text-gray-400">
              Aksi ini tidak bisa dibatalkan
            </p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Alasan Pembatalan
          </p>
          <div className="grid grid-cols-2 gap-2">
            {reasons.map((r) => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className={cn(
                  "p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                  reason === r
                    ? "border-red-300 bg-red-50 text-red-600"
                    : "border-gray-100 text-gray-500 hover:border-red-200",
                )}
              >
                {r}
              </button>
            ))}
          </div>
          {reason === "Lainnya" && (
            <textarea
              value={reason === "Lainnya" ? "" : reason}
              onChange={(e) => setReason(e.target.value || "Lainnya")}
              placeholder="Tulis alasan..."
              className="w-full border border-gray-200 rounded-xl p-3 text-xs resize-none h-16 focus:outline-hidden focus:border-red-300"
            />
          )}
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 rounded-full border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Kembali
          </button>
          <button
            onClick={() => onConfirm(reason || "Berubah pikiran")}
            disabled={loading || !reason}
            className="flex-1 py-3 rounded-full bg-red-500 text-white text-sm font-black hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Membatalkan...
              </>
            ) : (
              "Ya, Batalkan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Tracking Page ───
export default function TrackingPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const queryClient = useQueryClient();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Poll order status from BE every 5 seconds
  const { data: orderResponse, isLoading } = useQuery({
    queryKey: ["trackingOrder", orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId,
    refetchInterval: 5000, // poll every 5s for real-time updates
  });

  const order = orderResponse?.data as Order | null;
  const currentStatus = order?.status || OrderStatus.MATCHED;

  const isScheduled = order?.scheduleType === "SCHEDULED";
  const showScheduledWait =
    isScheduled && currentStatus === OrderStatus.MATCHED;

  const showLiveTracker =
    !showScheduledWait &&
    (currentStatus === OrderStatus.MATCHED ||
      currentStatus === OrderStatus.ON_GOING ||
      currentStatus === OrderStatus.ARRIVED ||
      currentStatus === OrderStatus.DELIVERING);

  const showWeighing = currentStatus === OrderStatus.WEIGHING;
  const showPayment = currentStatus === OrderStatus.WAITING_PAYMENT;
  const showPickup = currentStatus === OrderStatus.PICKED_UP;
  const showCompleted = currentStatus === OrderStatus.COMPLETED;
  const showCancelled = currentStatus === OrderStatus.CANCELLED;

  // Cancel allowed before weighing
  const canCancel = [
    OrderStatus.CREATED,
    OrderStatus.MATCHED,
    OrderStatus.ON_GOING,
    OrderStatus.ARRIVED,
  ].includes(currentStatus);

  const handleCancel = async (reason: string) => {
    setCancelLoading(true);
    try {
      await orderService.cancelOrder(orderId, reason);
      queryClient.invalidateQueries({ queryKey: ["trackingOrder", orderId] });
      setShowCancelModal(false);
    } catch (err: any) {
      console.error("Cancel failed:", err);
    } finally {
      setCancelLoading(false);
    }
  };

  const courierName = order?.courier?.user?.name || "Kurir";
  const courierPlate = order?.courier?.vehiclePlate || "-";
  const courierVehicle = order?.courier?.vehicleType || "Motor";
  const addressText =
    order?.address?.addressDetail ||
    [order?.address?.village, order?.address?.district]
      .filter(Boolean)
      .join(", ") ||
    "-";

  const userLat = parseDecimal(order?.address?.latitude) || -7.2575;
  const userLng = parseDecimal(order?.address?.longitude) || 112.7521;
  // TODO: Courier live lat/lng would come from a tracking API, using mock/offset for now
  const courierLat = userLat - 0.005;
  const courierLng = userLng - 0.005;

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={32}
            className="text-primary animate-spin mx-auto mb-3"
          />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-dvh bg-dark flex items-center justify-center">
        <div className="text-center">
          <XCircle size={32} className="text-red-400 mx-auto mb-3" />
          <p className="text-sm text-gray-400 font-medium">
            Pesanan tidak ditemukan
          </p>
          <button
            onClick={() => router.push("/dashboard/user")}
            className="mt-4 text-xs font-bold text-primary hover:underline"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-dark flex items-stretch justify-center">
      <div className="w-full max-w-lg bg-gray-50 relative flex flex-col min-h-dvh">
        {/* Header */}
        <div className="bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-30 border-b border-gray-100">
          <button
            onClick={() => router.push("/dashboard/user")}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-black text-dark">
              {showCancelled
                ? "Pesanan Dibatalkan"
                : showWeighing
                  ? "Penimbangan"
                  : showPayment
                    ? "Pembayaran"
                    : showCompleted
                      ? "Pesanan Selesai"
                      : "Tracking Pesanan"}
            </h1>
            <p className="text-[10px] text-gray-400 font-bold">
              #{orderId.slice(0, 8).toUpperCase()}
            </p>
          </div>
          {showCancelled || showCompleted || showWeighing || showPayment ? (
            <div
              className={cn(
                "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                showCancelled
                  ? "bg-red-50 text-red-500"
                  : showCompleted
                    ? "bg-secondary/10 text-secondary"
                    : showWeighing
                      ? "bg-orange-50 text-orange-500"
                      : "bg-red-50 text-red-500",
              )}
            >
              {showCancelled
                ? "Dibatalkan"
                : showCompleted
                  ? "Selesai"
                  : showWeighing
                    ? "Timbang"
                    : "Bayar"}
            </div>
          ) : canCancel ? (
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={cancelLoading}
              className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline cursor-pointer disabled:opacity-50"
            >
              Batalkan
            </button>
          ) : null}
        </div>

        {/* Content — status-aware rendering */}
        <div className="flex-1 flex flex-col pb-20 overflow-y-auto">
          {showScheduledWait && <ScheduledWaitView order={order} />}

          {showLiveTracker && (
            <LiveTracker
              status={currentStatus}
              courierName={courierName}
              courierPlate={courierPlate}
              courierVehicle={courierVehicle}
              address={addressText}
              userLat={userLat}
              userLng={userLng}
              courierLat={courierLat}
              courierLng={courierLng}
              etaMinutes={8}
            />
          )}

          {showWeighing && <WeighingView />}

          {showPayment && <WeighingSummaryView order={order} />}

          {showPickup && <PickupView />}

          {showCompleted && (
            <CompletedView
              order={order}
              onSummary={() =>
                router.push(`/dashboard/user/history/${orderId}`)
              }
            />
          )}

          {showCancelled && (
            <CancelledView
              order={order}
              onBack={() => router.push("/dashboard/user")}
            />
          )}

          {/* Cancel Button Removed from bottom */}

          {/* Timeline — Always Visible */}
          <div className="px-4 pt-3">
            <div className="p-4 bg-white border border-gray-100 rounded-xl">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                Timeline Pesanan
              </p>
              <OrderTimeline
                currentStatus={currentStatus}
                timestamps={{
                  [OrderStatus.CREATED]: new Date(order.createdAt)
                    .toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    .replace(":", "."),
                  ...(order.statusHistory?.reduce(
                    (acc, entry) => ({
                      ...acc,
                      [entry.status]: new Date(entry.createdAt)
                        .toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        .replace(":", "."),
                    }),
                    {},
                  ) || {}),
                }}
                cancelled={showCancelled}
              />
            </div>
          </div>
        </div>

        <BottomNav role="user" />
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <CancelModal
          onConfirm={handleCancel}
          onClose={() => setShowCancelModal(false)}
          loading={cancelLoading}
        />
      )}
    </div>
  );
}
