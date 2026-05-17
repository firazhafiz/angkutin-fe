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
  Wallet,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { OrderStatus } from "@/types/enums";
import { cn } from "@/lib/cn";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import type { Order, WeighingSummary } from "@/types/models";

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

// ─── Weighing Summary (User: from BE API, with Confirm CTA) ───
function WeighingSummaryView({
  orderId,
  onConfirm,
  loading,
}: {
  orderId: string;
  onConfirm: () => void;
  loading: boolean;
}) {
  const { data: summaryRes } = useQuery({
    queryKey: ["weighingSummary", orderId],
    queryFn: () => orderService.getWeighingSummary(orderId),
    refetchInterval: 5000,
  });
  const summary: WeighingSummary | null = summaryRes?.data || null;

  if (!summary) {
    return (
      <div className="p-4 text-center py-8">
        <Loader2 size={24} className="text-primary animate-spin mx-auto mb-3" />
        <p className="text-xs text-gray-400">Memuat ringkasan timbangan...</p>
      </div>
    );
  }

  const s = summary.summary;
  return (
    <div className="p-4 space-y-4">
      <div className="text-center py-3">
        <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
          <Scale size={28} className="text-secondary" />
        </div>
        <h3 className="text-lg font-black text-dark">Hasil Penimbangan</h3>
        <p className="text-xs text-gray-500 mt-1">
          Periksa dan konfirmasi hasil timbangan
        </p>
      </div>

      <div className="bg-white border border-gray-300 rounded-2xl overflow-hidden ">
        <div className="p-4 grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
          <div className="pr-4">
            <p className="text-xs font-bold text-green-600 mb-1">Total Mutu</p>
            <p className="text-2xl font-black text-dark">
              {s.totalMutuWeight} kg
            </p>
            <p className="text-xs text-green-600 font-bold">
              {s.formattedCredit}
            </p>
          </div>
          <div className="pl-4">
            <p className="text-xs font-bold text-red-500 mb-1">Total Residu</p>
            <p className="text-2xl font-black text-dark">
              {s.totalResidualWeight} kg
            </p>
            <p className="text-xs text-red-500 font-bold">{s.formattedDebit}</p>
          </div>
        </div>

        {/* Item details */}
        {summary.mutuItems.length > 0 && (
          <div className="p-4 space-y-2 border-b border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Detail Mutu
            </p>
            {summary.mutuItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-gray-600 font-medium">
                  {item.wasteTypeName} ({item.weight} kg)
                </span>
                <span className="font-bold text-green-600">
                  + Rp {item.subtotal.toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>
        )}

        {summary.residuals.length > 0 && (
          <div className="p-4 space-y-2 border-b border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Detail Residu
            </p>
            {summary.residuals.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-gray-600 font-medium">
                  Residu ({item.weight} kg)
                </span>
                <span className="font-bold text-red-500">
                  - Rp {item.subtotal.toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>
        )}

        <div
          className={cn(
            "p-4 flex items-center justify-between",
            s.netTotal >= 0 ? "bg-green-50" : "bg-red-50",
          )}
        >
          <p className="text-xs font-black text-dark uppercase">Net Total</p>
          <p
            className={cn(
              "text-lg font-black",
              s.netTotal >= 0 ? "text-green-600" : "text-red-500",
            )}
          >
            {s.formattedNetTotal}
          </p>
        </div>

        {/* Highlight what user gets/pays */}
        <div className="p-4 bg-gray-50">
          {s.userReceives > 0 && (
            <p className="text-xs text-green-600 font-bold text-center">
              💰 Anda menerima {s.formattedUserReceives} ke saldo
            </p>
          )}
          {s.userPays > 0 && (
            <p className="text-xs text-red-500 font-bold text-center">
              ⚠️ Anda perlu membayar {s.formattedUserPays}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onConfirm}
        disabled={loading}
        className="w-full py-4 rounded-full bg-primary text-white font-black text-sm hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Memproses...
          </>
        ) : (
          <>
            <CheckCircle2 size={16} /> Konfirmasi Timbangan
          </>
        )}
      </button>
    </div>
  );
}

// ─── Payment View (User: WALLET payment) ───
function PaymentView({
  orderId,
  onPay,
  loading,
}: {
  orderId: string;
  onPay: (method: "WALLET" | "E_WALLET") => void;
  loading: boolean;
}) {
  const { data: summaryRes } = useQuery({
    queryKey: ["weighingSummary", orderId],
    queryFn: () => orderService.getWeighingSummary(orderId),
  });
  const summary: WeighingSummary | null = summaryRes?.data || null;
  const s = summary?.summary;

  return (
    <div className="p-4 space-y-4">
      <div className="text-center py-3">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
          <Wallet size={28} className="text-red-500" />
        </div>
        <h3 className="text-lg font-black text-dark">Pembayaran Diperlukan</h3>
        <p className="text-xs text-gray-500 mt-1">
          Biaya residu lebih tinggi dari kredit mutu
        </p>
      </div>

      {s && (
        <div className="p-5 rounded-2xl bg-red-50 border border-red-100 text-center">
          <p className="text-xs font-bold text-red-400 tracking-wide mb-1">
            Nominal Charge
          </p>
          <p className="text-3xl font-black text-red-600">
            {s.formattedUserPays}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Metode Pembayaran
        </p>

        {/* WALLET option */}
        <button
          onClick={() => onPay("WALLET")}
          disabled={loading}
          className="w-full p-4 rounded-xl border-2 border-primary bg-primary/5 flex items-center gap-3 cursor-pointer hover:bg-primary/10 transition-colors disabled:opacity-50"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet size={20} className="text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-black text-dark">Saldo Angkutin</p>
            <p className="text-[10px] text-gray-400 font-bold">
              Bayar dari saldo wallet Anda
            </p>
          </div>
          {loading ? (
            <Loader2 size={16} className="animate-spin text-primary" />
          ) : (
            <CheckCircle2 size={16} className="text-primary" />
          )}
        </button>

        {/* E_WALLET option — disabled for now */}
        <div className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center gap-3 opacity-50">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Wallet size={20} className="text-gray-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-gray-500">E-Wallet (Xendit)</p>
            <p className="text-[10px] text-gray-400 font-bold">Segera hadir</p>
          </div>
        </div>
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
  const pointsEarned = order.pointTransactions?.reduce((sum, tx) => sum + tx.points, 0) || 0;

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

      {pointsEarned > 0 && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between mx-auto text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-800">Point Loyalty Diterima</p>
              <p className="text-[10px] text-emerald-600 leading-tight mt-0.5">Berhasil ditambahkan ke akun Anda</p>
            </div>
          </div>
          <p className="text-lg font-black text-emerald-600 shrink-0 ml-2">
            +{pointsEarned} pts
          </p>
        </div>
      )}

      <button
        onClick={onSummary}
        className="w-full py-4 rounded-full bg-primary text-white font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors cursor-pointer mt-4"
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
  const [confirmLoading, setConfirmLoading] = useState(false);

  const refetchOrder = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["trackingOrder", orderId] });
  }, [queryClient, orderId]);

  const handleConfirm = async () => {
    setConfirmLoading(true);
    try {
      await orderService.confirmWeighing(orderId);
      refetchOrder();
    } catch (err: any) {
      console.error("Confirm failed:", err);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handlePay = async (method: "WALLET" | "E_WALLET") => {
    setConfirmLoading(true);
    try {
      await orderService.payOrder(orderId, method);
      refetchOrder();
    } catch (err: any) {
      console.error("Payment failed:", err);
    } finally {
      setConfirmLoading(false);
    }
  };

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

          {showWeighing &&
            (() => {
              // Sub-state: check if weighing data is available
              const hasWeighingData =
                order.wasteItems && order.wasteItems.length > 0;
              if (hasWeighingData) {
                return (
                  <WeighingSummaryView
                    orderId={orderId}
                    onConfirm={() => handleConfirm()}
                    loading={confirmLoading}
                  />
                );
              }
              return <WeighingView />;
            })()}

          {showPayment && (
            <PaymentView
              orderId={orderId}
              onPay={(method) => handlePay(method)}
              loading={confirmLoading}
            />
          )}

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
