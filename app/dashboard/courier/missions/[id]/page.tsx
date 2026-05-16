"use client";

import React, { useState, useEffect, useCallback } from "react";
import BottomNav from "@/components/dashboard/BottomNav";
import MapboxView from "@/components/maps/MapboxView";
import { parseDecimal } from "@/lib/decimal";
import IncomingAlert from "@/components/courier/IncomingAlert";
import {
  ChevronLeft, Scale, TrendingUp, TrendingDown, Navigation, MapPin,
  Clock, Calendar, Wallet, QrCode, CheckCircle2, Truck, Camera,
  Package, Loader2, XCircle, Ban, AlertTriangle,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { OrderStatus } from "@/types/enums";
import { cn } from "@/lib/cn";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { courierService } from "@/services/courier.service";
import type { Order } from "@/types/models";

const WASTE_OPTIONS = [
  { id: "plastik_pet", label: "Plastik PET" },
  { id: "kardus", label: "Kardus" },
  { id: "logam", label: "Logam" },
  { id: "kertas", label: "Kertas" },
  { id: "kaca", label: "Kaca" },
  { id: "botol_plastik", label: "Botol Plastik" },
  { id: "kaleng", label: "Kaleng" },
  { id: "elektronik", label: "Elektronik" },
];

// ─── Scheduled Wait ───
function ScheduledWaitCourier({
  order, onDepart, onCancel, loading
}: { order: Order; onDepart: () => void; onCancel: () => void; loading: boolean }) {
  const scheduledTime = order.scheduledAt
    ? new Date(order.scheduledAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : "—";
  return (
    <div className="p-4 space-y-4">
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
           <Calendar size={32} className="text-primary" />
        </div>
        <h3 className="text-lg font-black text-dark">Pesanan Terjadwal</h3>
        <p className="text-xs text-gray-500 mt-1">Tunggu hingga jam penjemputan tiba</p>
      </div>
      <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 text-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Jam Penjemputan</p>
        <p className="text-3xl font-black text-primary">{scheduledTime}</p>
      </div>
      <div className="p-4 rounded-2xl bg-white border border-gray-100 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black shrink-0">
            {order.user?.name?.charAt(0) || "C"}
          </div>
          <div>
            <p className="text-sm font-bold text-dark">{order.user?.name || "Customer"}</p>
            <p className="text-[10px] text-gray-400 font-bold">{order.user?.phone || "-"}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 leading-relaxed">
            {order.address?.addressDetail || "-"}
          </p>
        </div>
        {order.note && (
          <div className="mt-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
            <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">Catatan Customer</p>
            <p className="text-xs text-dark font-medium italic">"{order.note}"</p>
          </div>
        )}
      </div>
      <button
        onClick={onDepart}
        disabled={loading}
        className="w-full py-4 rounded-full bg-primary text-white font-black text-sm hover:bg-primary/90 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? <><Loader2 size={16} className="animate-spin" /> Memproses...</> : <><Navigation size={16} className="fill-white/30" /> Berangkat Sekarang</>}
      </button>
    </div>
  );
}

// ─── Navigation View ───
function NavigationView({
  status, order, onAction, onCancel, loading,
}: { status: OrderStatus; order: Order; onAction: () => void; onCancel?: () => void; loading: boolean }) {
  const isDel = status === OrderStatus.DELIVERING;
  const destLat = parseDecimal(order?.address?.latitude) || -7.2575;
  const destLng = parseDecimal(order?.address?.longitude) || 112.7521;
  const courierLat = destLat - 0.005;
  const courierLng = destLng - 0.005;

  const [realEta, setRealEta] = useState(8);

  return (
    <div className="space-y-0">
      <div className="h-56 sm:h-64 relative">
        <MapboxView
          center={isDel ? [112.7521, -7.2575] : [destLng, destLat]}
          zoom={13}
          showRoute={true}
          onRouteUpdate={({ duration }) => setRealEta(Math.ceil(duration / 60))}
          markers={[
            { id: "courier", lat: courierLat, lng: courierLng, type: "courier" },
            { id: "dest", lat: isDel ? -7.2575 : destLat, lng: isDel ? 112.7521 : destLng, type: "user" }
          ]}
        />
        {/* Floating ETA Badge */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/50 flex items-center gap-2">
          <Clock size={12} className="text-primary" />
          <span className="text-[10px] font-black text-dark uppercase tracking-widest">
            ETA {realEta} mnt
          </span>
        </div>
      </div>
      <div className="p-4 bg-white border-t border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black text-dark">
              {isDel ? "Gudang Daur Ulang" : "Lokasi Customer"}
            </p>
            <p className="text-[10px] text-gray-400 font-medium">
              {isDel ? "Gudang Angkutin, Jl. Rungkut Industri No. 5" : order.address?.addressDetail || "-"}
            </p>
          </div>
          {/* Status Badge */}
          {/* Status Badge Removed */}
        </div>

        {order.note && !isDel && (
          <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 flex gap-2">
             <Package size={14} className="text-primary shrink-0 mt-0.5" />
             <div>
                <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">Catatan Penjemputan</p>
                <p className="text-xs text-dark font-medium italic leading-relaxed">"{order.note}"</p>
             </div>
          </div>
        )}

        <button
          onClick={onAction}
          disabled={loading}
          className="w-full py-4 rounded-full bg-primary text-white font-black text-sm hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Memproses...</>
          ) : isDel ? "Sampai di Gudang — Selesaikan Order" : "Sampai di Lokasi Customer"}
        </button>

      </div>
    </div>
  );
}

// ─── Arrived ───
function ArrivedView({ onStartWeigh, onCancel, loading }: { onStartWeigh: () => void; onCancel: () => void; loading: boolean }) {
  return (
    <div className="p-4 space-y-4 text-center py-8">
      <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
        <Scale size={32} className="text-secondary" />
      </div>
      <div>
        <h3 className="text-lg font-black text-dark">Anda Telah Tiba di Lokasi</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">Silakan mulai proses penimbangan sampah customer</p>
      </div>
      <button
        onClick={onStartWeigh}
        disabled={loading}
        className="w-full py-4 rounded-full bg-secondary text-white font-black text-sm hover:bg-secondary/90 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <><Loader2 size={16} className="animate-spin" /> Memproses...</> : "Mulai Proses Timbang"}
      </button>
    </div>
  );
}

// ─── Weighing Form ───
function WeighingForm({ order, onSubmit, loading }: { order: Order; onSubmit: (mutuKg: number, residuKg: number, wasteType: string) => void; loading: boolean }) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["plastik_pet"]);
  const [mutuKg, setMutuKg] = useState("3.2");
  const [residuKg, setResiduKg] = useState("1.5");

  const toggleType = (id: string) => setSelectedTypes((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);

  const mutu = parseFloat(mutuKg) || 0;
  const residu = parseFloat(residuKg) || 0;

  return (
    <div className="p-4 space-y-4">
      <div className="text-center py-3">
        <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
          <Scale size={28} className="text-secondary animate-pulse" />
        </div>
        <h3 className="text-lg font-black text-dark">Proses Penimbangan</h3>
        <p className="text-xs text-gray-500 mt-1">Masukkan berat sampah yang ditimbang</p>
      </div>

      {/* Weight inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-green-600" />
            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Sampah Mutu</span>
          </div>
          <input type="number" step="0.1" value={mutuKg} onChange={(e) => setMutuKg(e.target.value)}
            className="w-full text-2xl font-black text-green-700 bg-transparent outline-hidden" />
          <span className="text-xs font-bold text-green-600">kg</span>
        </div>
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={14} className="text-red-500" />
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Sampah Residu</span>
          </div>
          <input type="number" step="0.1" value={residuKg} onChange={(e) => setResiduKg(e.target.value)}
            className="w-full text-2xl font-black text-red-600 bg-transparent outline-hidden" />
          <span className="text-xs font-bold text-red-500">kg</span>
        </div>
      </div>

      {/* Multi-select waste types */}
      <div className="space-y-2 flex flex-col">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Jenis Sampah Mutu</label>
        <div className="grid grid-cols-2 gap-2">
          {WASTE_OPTIONS.map((w) => {
            const sel = selectedTypes.includes(w.id);
            return (
              <div key={w.id} onClick={() => toggleType(w.id)}
                className={cn("p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all",
                  sel ? "border-primary bg-primary/5" : "border-gray-100 bg-white hover:border-primary/30")}>
                <span className={cn("text-xs font-bold", sel ? "text-primary" : "text-gray-600")}>{w.label}</span>
                {sel && <CheckCircle2 size={14} className="text-primary ml-auto shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => onSubmit(mutu, residu, selectedTypes.join(", "))}
        disabled={loading || mutu <= 0}
        className="w-full py-4 rounded-full bg-dark text-white font-black text-sm hover:bg-primary transition-colors disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
      >
        {loading ? <><Loader2 size={16} className="animate-spin" /> Memproses...</> : "Submit Hasil Timbangan"}
      </button>
    </div>
  );
}

// ─── Pickup ───
function PickupCourierView({ onDepart, loading }: { onDepart: () => void; loading: boolean }) {
  return (
    <div className="p-4 text-center space-y-4 py-8">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <Package size={32} className="text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-black text-dark">Sampah Sudah Dimuat</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">Pastikan semua sampah masuk kendaraan. Lanjutkan ke gudang.</p>
      </div>
      <button onClick={onDepart} disabled={loading}
        className="w-full py-4 rounded-full bg-primary text-white font-black text-sm hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
        {loading ? <><Loader2 size={16} className="animate-spin" /> Memproses...</> : <><Truck size={16} className="fill-white/30" /> Mulai Pengantaran ke Gudang</>}
      </button>
    </div>
  );
}

// ─── Completed ───
function CompletedCourierView({ order, onBack }: { order: Order; onBack: () => void }) {
  return (
    <div className="p-4 text-center space-y-5 py-8">
      <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
        <CheckCircle2 size={40} className="text-secondary" />
      </div>
      <div>
        <h3 className="text-xl font-black text-dark">Order Selesai! 🎉</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">Sampah telah diantar ke gudang. Pendapatan masuk ke wallet Anda.</p>
      </div>
      <div className="p-4 rounded-2xl bg-green-50 border border-green-100 text-center">
        <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">Pendapatan</p>
        <p className="text-2xl font-black text-green-700">
          + Rp {(order.totalCredit ?? 0).toLocaleString("id-ID")}
        </p>
      </div>
      <button onClick={onBack}
        className="w-full py-4 rounded-full bg-primary text-white font-black text-sm hover:bg-primary/90 transition-colors cursor-pointer">
        Kembali ke Dashboard
      </button>
    </div>
  );
}

// ─── Cancelled (by user) ───
function CancelledCourierView({ order, onBack }: { order: Order; onBack: () => void }) {
  return (
    <div className="p-4 text-center space-y-5 py-8">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">
        <Ban size={40} className="text-red-400" />
      </div>
      <div>
        <h3 className="text-xl font-black text-dark">Order Dibatalkan</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
          Customer telah membatalkan pesanan ini. Anda akan diarahkan ke misi lainnya.
        </p>
      </div>
      <div className="p-4 rounded-2xl bg-red-50 border border-red-100 space-y-2">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Alasan Pembatalan</p>
        <p className="text-sm font-black text-red-600">
          "{order.statusHistory?.find(h => h.status === OrderStatus.CANCELLED)?.note || "Dibatalkan oleh pengguna"}"
        </p>
        <p className="text-[10px] text-gray-400">Order #{order.id.slice(0, 8).toUpperCase()}</p>
      </div>
      <button onClick={onBack}
        className="w-full py-4 rounded-full bg-dark text-white font-black text-sm hover:bg-primary transition-colors cursor-pointer">
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
    "Kendaraan bermasalah",
    "Ban bocor",
    "Customer tidak di lokasi",
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
            <h3 className="text-sm font-black text-dark">Batalkan Misi?</h3>
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
            onClick={() => onConfirm(reason || "Kendaraan bermasalah")}
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

// ─── Main Page ───
export default function MissionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const queryClient = useQueryClient();
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch order with polling
  const { data: orderRes, isLoading } = useQuery({
    queryKey: ["courierMission", orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId,
    refetchInterval: 5000,
  });

  const order = orderRes?.data as Order | null;
  const status = order?.status;
  const isScheduled = order?.scheduleType === "SCHEDULED";

  const refetchOrder = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["courierMission", orderId] });
  }, [queryClient, orderId]);

  // Generic action handler
  const handleAction = useCallback(async (action: () => Promise<any>) => {
    setActionLoading(true);
    setError(null);
    try {
      await action();
      refetchOrder();
    } catch (err: any) {
      console.error("Action failed:", err);
      setError(err.response?.data?.message || "Gagal memproses. Coba lagi.");
    } finally {
      setActionLoading(false);
    }
  }, [refetchOrder]);

  const showIncoming = status === OrderStatus.CREATED;
  // Scheduled: MATCHED means waiting for departure. Instant: MATCHED is transient (BE sets ON_GOING on accept)
  const showScheduledWait = isScheduled && status === OrderStatus.MATCHED;
  const showInstantMatched = !isScheduled && status === OrderStatus.MATCHED;
  const showCompleted = status === OrderStatus.COMPLETED;
  const showCancelled = status === OrderStatus.CANCELLED;

  const statusLabel = !status ? "..." :
    showCancelled ? "Dibatalkan" :
    showIncoming ? "Penawaran" :
    showScheduledWait ? "Terjadwal" :
    status === OrderStatus.WEIGHING ? "Timbang" :
    showCompleted ? "Selesai" : "";

  // Courier can cancel only in MATCHED status per current BE constraints
  const canCancel = status === OrderStatus.MATCHED;

  const handleCourierCancel = async (reason: string) => {
    handleAction(async () => {
      await courierService.rejectOrder(orderId, reason);
      setShowCancelModal(false);
      router.push("/dashboard/courier");
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-dark flex items-center justify-center">
        <Loader2 size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-dvh bg-dark flex items-center justify-center">
        <div className="text-center">
          <XCircle size={32} className="text-red-400 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Order tidak ditemukan</p>
          <button onClick={() => router.push("/dashboard/courier")}
            className="mt-4 text-xs font-bold text-primary hover:underline">Kembali</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-dark flex items-stretch justify-center">
      {/* Incoming Alert overlay */}
      {showIncoming && (
        <IncomingAlert
          customerName={order.user?.name || "Customer"}
          address={order.address?.addressDetail || "-"}
          vehicleType={order.courier?.vehicleType || order.aiResults?.[0]?.recommendedVehicle || "Motor"}
          isScheduled={isScheduled}
          scheduledTime={order.scheduledAt ? new Date(order.scheduledAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : undefined}
          onAccept={() => handleAction(() => courierService.acceptOrder(orderId))}
          onDismiss={() => router.push("/dashboard/courier")}
        />
      )}

      <div className="w-full max-w-lg bg-gray-50 relative flex flex-col min-h-dvh">
        {/* Header */}
        {!showIncoming && (
          <div className="bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-30 border-b border-gray-100">
            <button onClick={() => router.push("/dashboard/courier")}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer shrink-0">
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-sm font-black text-dark">Detail Misi</h1>
              <p className="text-[10px] text-gray-400 font-bold">#{orderId.slice(0, 8).toUpperCase()}</p>
            </div>
            {statusLabel ? (
              <div className={cn("px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                showCancelled ? "bg-red-50 text-red-500" :
                showCompleted ? "bg-secondary/10 text-secondary" :
                status === OrderStatus.WEIGHING ? "bg-orange-50 text-orange-500" :
                "bg-primary/10 text-primary")}>
                {statusLabel}
              </div>
            ) : canCancel ? (
              <button
                onClick={() => setShowCancelModal(true)}
                disabled={actionLoading}
                className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline cursor-pointer disabled:opacity-50"
              >
                Batalkan
              </button>
            ) : null}
          </div>
        )}

        {/* Error Banner */}
        {error && !showIncoming && (
          <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-bold flex items-center gap-2">
            <XCircle size={14} /> {error}
          </div>
        )}

        {/* Content */}
        {!showIncoming && (
          <div className="flex-1 flex flex-col pb-20 overflow-y-auto">
            {showScheduledWait && (
              <ScheduledWaitCourier order={order} loading={actionLoading}
                onDepart={() => handleAction(() => courierService.departOrder(orderId))}
                onCancel={() => setShowCancelModal(true)} />
            )}

            {showInstantMatched && (
              <NavigationView status={OrderStatus.ON_GOING} order={order} loading={actionLoading}
                onAction={() => handleAction(() => courierService.arriveAtLocation(orderId))}
                onCancel={() => setShowCancelModal(true)} />
            )}

            {status === OrderStatus.ON_GOING && (
              <NavigationView status={OrderStatus.ON_GOING} order={order} loading={actionLoading}
                onAction={() => handleAction(() => courierService.arriveAtLocation(orderId))}
                onCancel={() => setShowCancelModal(true)} />
            )}

            {status === OrderStatus.ARRIVED && (
              <ArrivedView loading={actionLoading}
                onStartWeigh={() => handleAction(() => courierService.startWeighing(orderId))}
                onCancel={() => setShowCancelModal(true)} />
            )}

            {status === OrderStatus.WEIGHING && (
              <WeighingForm order={order} loading={actionLoading}
                onSubmit={(mutu, residu, wasteType) =>
                  handleAction(() => courierService.submitWeighing(orderId, { mutuKg: mutu, residuKg: residu, wasteType }))} />
            )}

            {(status === OrderStatus.WAITING_PAYMENT || status === OrderStatus.PICKED_UP) && (
              <PickupCourierView loading={actionLoading}
                onDepart={() => handleAction(() => courierService.startDelivery(orderId))} />
            )}

            {status === OrderStatus.DELIVERING && (
              <NavigationView status={OrderStatus.DELIVERING} order={order} loading={actionLoading}
                onAction={() => handleAction(() => courierService.completeOrder(orderId))} />
            )}

            {showCompleted && (
              <CompletedCourierView order={order} onBack={() => router.push("/dashboard/courier")} />
            )}

            {showCancelled && (
              <CancelledCourierView order={order} onBack={() => router.push("/dashboard/courier")} />
            )}
          </div>
        )}

        {!showIncoming && <BottomNav role="courier" />}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <CancelModal
          onConfirm={handleCourierCancel}
          onClose={() => setShowCancelModal(false)}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
