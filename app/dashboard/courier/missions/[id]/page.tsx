"use client";

import React, { useState, useEffect } from "react";
import BottomNav from "@/components/dashboard/BottomNav";
import MapView from "@/components/maps/MapView";
import IncomingAlert from "@/components/courier/IncomingAlert";
import {
  ChevronLeft,
  Scale,
  TrendingUp,
  TrendingDown,
  Navigation,
  MapPin,
  Clock,
  Calendar,
  Wallet,
  QrCode,
  CheckCircle2,
  Truck,
  Camera,
  Package,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@/types/enums";
import { cn } from "@/lib/cn";

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

// Statuses (removed WAITING_PAYMENT — merged into WEIGHING)
const COURIER_STATUSES: OrderStatus[] = [
  OrderStatus.ON_GOING,
  OrderStatus.ARRIVED,
  OrderStatus.WEIGHING,
  OrderStatus.PICKED_UP,
  OrderStatus.DELIVERING,
  OrderStatus.COMPLETED,
];

function AnimatedCounter({
  target,
  suffix = "",
  duration = 2000,
  className,
}: {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 30);
    const t = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(t);
      } else {
        setVal(parseFloat(start.toFixed(1)));
      }
    }, 30);
    return () => clearInterval(t);
  }, [target, duration]);
  return (
    <span className={className}>
      {val.toFixed(1)}
      {suffix}
    </span>
  );
}

// ─── Scheduled Wait ───
function ScheduledWaitCourier({
  scheduledTime,
  onDepart,
}: {
  scheduledTime: string;
  onDepart: () => void;
}) {
  return (
    <div className="p-4 space-y-4">
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Calendar size={32} className="text-primary" />
        </div>
        <h3 className="text-lg font-black text-dark">Pesanan Terjadwal</h3>
        <p className="text-xs text-gray-500 mt-1">
          Tunggu hingga jam penjemputan tiba
        </p>
      </div>
      <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 text-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          Jam Penjemputan
        </p>
        <p className="text-3xl font-black text-primary">{scheduledTime}</p>
        <p className="text-[10px] text-gray-500 mt-1">Hari Ini</p>
      </div>
      <div className="p-4 rounded-2xl bg-white border border-gray-100 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="Customer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-dark">Firaz Hafiz</p>
            <p className="text-[10px] text-gray-400 font-bold">0.8 km</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 leading-relaxed">
            Jl. Kebon Sirih No. 45, Surabaya
          </p>
        </div>
      </div>
      <button
        onClick={onDepart}
        className="w-full py-4 rounded-full bg-primary text-white font-black text-sm hover:bg-primary/90 transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        <Navigation size={16} className="fill-white/30" /> Berangkat Sekarang
      </button>
    </div>
  );
}

// ─── Navigation View ───
function NavigationView({
  status,
  onArrived,
}: {
  status: OrderStatus;
  onArrived: () => void;
}) {
  const isDel = status === OrderStatus.DELIVERING;
  return (
    <div className="space-y-0">
      <MapView
        className="h-56 sm:h-64"
        showUserMarker={!isDel}
        showCourierMarker
        courierPosition={
          isDel ? { top: "30%", left: "55%" } : { top: "35%", left: "55%" }
        }
      />
      <div className="p-4 bg-white border-t border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black text-dark">
              {isDel ? "Gudang Daur Ulang" : "Lokasi Customer"}
            </p>
            <p className="text-[10px] text-gray-400 font-medium">
              {isDel
                ? "Gudang Angkutin, Jl. Rungkut Industri No. 5"
                : "Jl. Kebon Sirih No. 45, Surabaya"}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
            <Clock size={12} className="text-primary" />
            <span className="text-xs font-black text-primary">8 mnt</span>
          </div>
        </div>
        <button
          onClick={onArrived}
          className="w-full py-4 rounded-full bg-primary text-white font-black text-sm hover:bg-primary/90 transition-colors cursor-pointer"
        >
          {isDel
            ? "Sampai di Gudang — Selesaikan Order"
            : "Sampai di Lokasi Customer"}
        </button>
      </div>
    </div>
  );
}

// ─── Arrived ───
function ArrivedView({ onStartWeigh }: { onStartWeigh: () => void }) {
  return (
    <div className="p-4 space-y-4 text-center py-8">
      <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
        <Scale size={32} className="text-secondary" />
      </div>
      <div>
        <h3 className="text-lg font-black text-dark">
          Anda Telah Tiba di Lokasi
        </h3>
        <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
          Silakan mulai proses penimbangan sampah customer
        </p>
      </div>
      <button
        onClick={onStartWeigh}
        className="w-full py-4 rounded-full bg-secondary text-white font-black text-sm hover:bg-secondary/90 transition-colors cursor-pointer"
      >
        Mulai Proses Timbang
      </button>
    </div>
  );
}

// ─── Weighing Form (with integrated payment if residu > mutu) ───
function WeighingForm({ onSubmit }: { onSubmit: () => void }) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["plastik_pet"]);
  const [photoTaken, setPhotoTaken] = useState(false);
  const mutuKg = 3.2;
  const residuKg = 4.8; // residu > mutu to demo payment
  const needsPayment = residuKg > mutuKg;
  const charge = needsPayment ? Math.round((residuKg - mutuKg) * 3250) : 0;
  const [payMethod, setPayMethod] = useState<"wallet" | "qris" | null>(null);
  const [methodSaved, setMethodSaved] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const toggleType = (id: string) => {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const handleSaveMethod = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setMethodSaved(true);
      if (payMethod === "qris") setShowQR(true);
    }, 1500);
  };

  const handleSubmit = () => {
    if (needsPayment && !methodSaved) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSubmit();
    }, 2000);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="text-center py-3">
        <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
          <Scale size={28} className="text-secondary animate-pulse" />
        </div>
        <h3 className="text-lg font-black text-dark">Proses Penimbangan</h3>
        <p className="text-xs text-gray-500 mt-1">
          Data berat dari timbangan IoT (simulasi)
        </p>
      </div>

      {/* Weight cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-green-600" />
            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
              Sampah Mutu
            </span>
          </div>
          <AnimatedCounter
            target={mutuKg}
            suffix=" kg"
            className="text-2xl font-black text-green-700"
          />
        </div>
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={14} className="text-red-500" />
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
              Sampah Residu
            </span>
          </div>
          <AnimatedCounter
            target={residuKg}
            suffix=" kg"
            className="text-2xl font-black text-red-600"
          />
        </div>
      </div>

      {/* Financial Breakdown for Courier */}
      <div className="p-4 rounded-2xl bg-white border border-gray-100 space-y-2">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Estimasi Transaksi</p>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-gray-500 font-medium">Pendapatan Mutu</span>
          <span className="text-xs font-black text-green-600">+ Rp {(mutuKg * 4500).toLocaleString("id-ID")}</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-gray-500 font-medium">Biaya Residu</span>
          <span className="text-xs font-black text-red-500">- Rp {(residuKg * 3250).toLocaleString("id-ID")}</span>
        </div>
        <div className="pt-2 border-t border-dashed border-gray-100 flex items-center justify-between">
          <span className="text-[10px] font-black text-dark uppercase">Total {needsPayment ? "Tagihan" : "Kredit"}</span>
          <span className={cn("text-sm font-black", needsPayment ? "text-red-600" : "text-primary")}>
            Rp {Math.abs(needsPayment ? charge : (mutuKg * 4500 - residuKg * 3250)).toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {/* Multi-select waste types */}
      <div className="space-y-2 flex flex-col">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Jenis Sampah Mutu
        </label>
        <div className="grid grid-cols-2 gap-2">
          {WASTE_OPTIONS.map((w) => {
            const sel = selectedTypes.includes(w.id);
            return (
              <div
                key={w.id}
                onClick={() => toggleType(w.id)}
                className={cn(
                  "p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all",
                  sel
                    ? "border-primary bg-primary/5"
                    : "border-gray-100 bg-white hover:border-primary/30",
                )}
              >
                <span
                  className={cn(
                    "text-xs font-bold",
                    sel ? "text-primary" : "text-gray-600",
                  )}
                >
                  {w.label}
                </span>
                {sel && (
                  <CheckCircle2
                    size={14}
                    className="text-primary ml-auto shrink-0"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Photo */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Foto Bukti Residu (Opsional)
        </label>
        <button
          onClick={() => setPhotoTaken(true)}
          className={cn(
            "w-full p-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 cursor-pointer transition-all",
            photoTaken
              ? "border-green-300 bg-green-50 text-green-600"
              : "border-gray-200 bg-gray-50 text-gray-400 hover:border-primary/30",
          )}
        >
          {photoTaken ? (
            <>
              <CheckCircle2 size={20} />
              <span className="text-xs font-bold">Foto Tersimpan</span>
            </>
          ) : (
            <>
              <Camera size={20} />
              <span className="text-xs font-bold">Ambil Foto</span>
            </>
          )}
        </button>
      </div>

      {/* Payment section (inline if residu > mutu) */}
      {needsPayment && (
        <div className="space-y-3 p-4 rounded-2xl bg-red-50/50 border border-red-100">
          <div className="text-center">
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
              Residu Lebih Besar — Tagihan User
            </p>
            <p className="text-xl font-black text-red-600 mt-1">
              Rp {charge.toLocaleString("id-ID")}
            </p>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Pilih Metode Pembayaran
          </p>
          <div className="space-y-2">
            <div
              onClick={() => !methodSaved && setPayMethod("wallet")}
              className={cn(
                "p-3 rounded-xl border flex items-center gap-3 transition-all",
                methodSaved ? "opacity-60 cursor-default" : "cursor-pointer",
                payMethod === "wallet"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 bg-white hover:border-primary/30",
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  payMethod === "wallet"
                    ? "bg-primary text-white"
                    : "bg-gray-50 text-gray-400",
                )}
              >
                <Wallet size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-dark">Saldo Wallet</p>
                <p className="text-[9px] text-gray-400">Auto-deduct</p>
              </div>
              {payMethod === "wallet" && (
                <CheckCircle2 size={16} className="text-primary" />
              )}
            </div>
            <div
              onClick={() => !methodSaved && setPayMethod("qris")}
              className={cn(
                "p-3 rounded-xl border flex items-center gap-3 transition-all",
                methodSaved ? "opacity-60 cursor-default" : "cursor-pointer",
                payMethod === "qris"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 bg-white hover:border-primary/30",
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  payMethod === "qris"
                    ? "bg-primary text-white"
                    : "bg-gray-50 text-gray-400",
                )}
              >
                <QrCode size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-dark">QRIS</p>
                <p className="text-[9px] text-gray-400">QR untuk user scan</p>
              </div>
              {payMethod === "qris" && (
                <CheckCircle2 size={16} className="text-primary" />
              )}
            </div>
          </div>

          {payMethod && !methodSaved && (
            <button
              onClick={handleSaveMethod}
              disabled={processing}
              className="w-full py-3 rounded-full bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {processing ? "Memproses..." : "Simpan Metode"}
            </button>
          )}

          {methodSaved && showQR && (
            <div className="p-4 bg-white border border-gray-100 rounded-xl flex flex-col items-center space-y-2">
              <div className="w-32 h-32 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                <QrCode size={64} className="text-dark/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[10px] font-black text-dark/40 uppercase rotate-12">
                    Mock QRIS
                  </p>
                </div>
              </div>
              <p className="text-[9px] font-bold text-gray-400">
                Tunjukkan QR ke Customer
              </p>
            </div>
          )}

          {methodSaved && payMethod === "wallet" && (
            <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600" />
              <p className="text-[10px] font-bold text-green-700">
                Saldo Berhasil Dipotong Otomatis
              </p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={processing || (needsPayment && !methodSaved)}
        className="w-full py-4 rounded-full bg-dark text-white font-black text-sm hover:bg-primary transition-colors disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
            Memproses...
          </>
        ) : (
          <>Submit Hasil Timbangan</>
        )}
      </button>
    </div>
  );
}

// ─── Pickup ───
function PickupCourierView({ onDepart }: { onDepart: () => void }) {
  return (
    <div className="p-4 text-center space-y-4 py-8">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <Package size={32} className="text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-black text-dark">Sampah Sudah Dimuat</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
          Pastikan semua sampah masuk kendaraan. Lanjutkan ke gudang.
        </p>
      </div>
      <button
        onClick={onDepart}
        className="w-full py-4 rounded-full bg-primary text-white font-black text-sm hover:bg-primary/90 transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        <Truck size={16} className="fill-white/30" /> Mulai Pengantaran ke
        Gudang
      </button>
    </div>
  );
}

// ─── Completed ───
function CompletedCourierView({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-4 text-center space-y-5 py-8">
      <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
        <CheckCircle2 size={40} className="text-secondary" />
      </div>
      <div>
        <h3 className="text-xl font-black text-dark">Order Selesai! 🎉</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
          Sampah telah diantar ke gudang. Pendapatan masuk ke wallet Anda.
        </p>
      </div>
      <div className="p-4 rounded-2xl bg-green-50 border border-green-100 text-center">
        <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">
          Pendapatan
        </p>
        <p className="text-2xl font-black text-green-700">+ Rp 15.000</p>
      </div>
      <button
        onClick={onBack}
        className="w-full py-4 rounded-full bg-primary text-white font-black text-sm hover:bg-primary/90 transition-colors cursor-pointer"
      >
        Kembali ke Dashboard
      </button>
    </div>
  );
}

// ─── Main Page ───
export default function MissionDetailPage() {
  const router = useRouter();
  const [statusIdx, setStatusIdx] = useState(-1); // -1 = incoming alert
  const [isScheduled, setIsScheduled] = useState(false);

  const currentStatus = statusIdx >= 0 ? COURIER_STATUSES[statusIdx] : null;
  const nextStatus = () => {
    if (statusIdx < COURIER_STATUSES.length - 1) setStatusIdx(statusIdx + 1);
  };

  const showIncoming = statusIdx === -1;
  const showScheduledWait =
    isScheduled && currentStatus === OrderStatus.ON_GOING && statusIdx === 0;

  const statusLabel = !currentStatus
    ? "Penawaran"
    : showScheduledWait
      ? "Terjadwal"
      : currentStatus === OrderStatus.WEIGHING
        ? "Timbang"
        : currentStatus === OrderStatus.COMPLETED
          ? "Selesai"
          : "Aktif";

  return (
    <div className="min-h-dvh bg-dark flex items-stretch justify-center">
      {/* Incoming Alert overlay */}
      {showIncoming && (
        <IncomingAlert
          customerName="Firaz Hafiz"
          address="Jl. Kebon Sirih No. 45, Surabaya"
          distance="0.8 km"
          estimatedEarning="+ Rp 15.000"
          vehicleType="Motor"
          isScheduled={isScheduled}
          scheduledTime={isScheduled ? "14:00" : undefined}
          onAccept={() => setStatusIdx(0)}
          onReject={() => router.push("/dashboard/courier")}
        />
      )}

      <div className="w-full max-w-lg bg-gray-50 relative flex flex-col min-h-dvh">
        {/* Header */}
        {!showIncoming && (
          <div className="bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-30 border-b border-gray-100">
            <button
              onClick={() => router.push("/dashboard/courier")}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-sm font-black text-dark">Detail Misi</h1>
              <p className="text-[10px] text-gray-400 font-bold">#AGT-55291</p>
            </div>
            <div
              className={cn(
                "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                currentStatus === OrderStatus.COMPLETED
                  ? "bg-secondary/10 text-secondary"
                  : currentStatus === OrderStatus.WEIGHING
                    ? "bg-orange-50 text-orange-500"
                    : "bg-primary/10 text-primary",
              )}
            >
              {statusLabel}
            </div>
          </div>
        )}

        {/* Content */}
        {!showIncoming && (
          <div className="flex-1 flex flex-col pb-20 overflow-y-auto">
            {showScheduledWait && (
              <ScheduledWaitCourier
                scheduledTime="14:00"
                onDepart={nextStatus}
              />
            )}

            {!showScheduledWait && currentStatus === OrderStatus.ON_GOING && (
              <NavigationView
                status={OrderStatus.ON_GOING}
                onArrived={nextStatus}
              />
            )}

            {currentStatus === OrderStatus.ARRIVED && (
              <ArrivedView onStartWeigh={nextStatus} />
            )}

            {currentStatus === OrderStatus.WEIGHING && (
              <WeighingForm onSubmit={nextStatus} />
            )}

            {currentStatus === OrderStatus.PICKED_UP && (
              <PickupCourierView onDepart={nextStatus} />
            )}

            {currentStatus === OrderStatus.DELIVERING && (
              <NavigationView
                status={OrderStatus.DELIVERING}
                onArrived={nextStatus}
              />
            )}

            {currentStatus === OrderStatus.COMPLETED && (
              <CompletedCourierView
                onBack={() => router.push("/dashboard/courier")}
              />
            )}

            {/* Demo toggle */}
            <div className="px-4 mt-4">
              <button
                onClick={() => setIsScheduled(!isScheduled)}
                className={cn(
                  "w-full py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer border",
                  isScheduled
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-gray-50 text-gray-400 border-gray-200",
                )}
              >
                {isScheduled ? "📅 Mode: Terjadwal" : "⚡ Mode: Instan"} (Tap
                toggle)
              </button>
            </div>
          </div>
        )}

        {!showIncoming && <BottomNav role="courier" />}
      </div>
    </div>
  );
}
