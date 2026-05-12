"use client";

import React, { useState, useEffect } from "react";
import LiveTracker from "@/components/maps/LiveTracker";
import OrderTimeline from "@/components/order/OrderTimeline";
import BottomNav from "@/components/dashboard/BottomNav";
import {
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Scale,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Package,
  Clock,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@/types/enums";
import { cn } from "@/lib/cn";

// Demo: cycle through statuses to showcase UI
const DEMO_STATUSES: OrderStatus[] = [
  OrderStatus.MATCHED,
  OrderStatus.ON_GOING,
  OrderStatus.ARRIVED,
  OrderStatus.WEIGHING,
  OrderStatus.WAITING_PAYMENT,
  OrderStatus.PICKED_UP,
  OrderStatus.DELIVERING,
  OrderStatus.COMPLETED,
];

// ─── Animated Counter ───
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
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(timer);
      } else {
        setVal(parseFloat(start.toFixed(1)));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [target, duration]);
  return (
    <span className={className}>
      {val.toFixed(1)}
      {suffix}
    </span>
  );
}

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

// ─── Weighing Summary (User: after courier submits, shows results + payment if any) ───
function WeighingSummaryView({ onNext }: { onNext: () => void }) {
  const mutuKg = 3.2;
  const residuKg = 4.8;
  const needsPayment = residuKg > mutuKg;
  const charge = needsPayment ? Math.round((residuKg - mutuKg) * 3250) : 0;
  const credit = !needsPayment ? Math.round((mutuKg - residuKg) * 4500) : 0;

  const [phase, setPhase] = useState<"summary" | "paying" | "done">("summary");

  useEffect(() => {
    if (phase !== "paying") return;
    const t = setTimeout(() => setPhase("done"), 2500);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(onNext, 1500);
    return () => clearTimeout(t);
  }, [phase, onNext]);

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

      {/* Main Results Table */}
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

        {/* Detailed Breakdown */}
        <div className="p-4 space-y-3">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Jenis Sampah Mutu
            </p>
            <div className="flex flex-wrap gap-2">
              {["Plastik PET", "Kardus", "Logam"].map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-600"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-dashed border-gray-100">
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-gray-500">
                Estimasi Pendapatan (Mutu)
              </span>
              <span className="text-xs font-bold text-green-600">
                + Rp {(mutuKg * 4500).toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-gray-500">
                Biaya Pengolahan (Residu)
              </span>
              <span className="text-xs font-bold text-red-500">
                - Rp {(residuKg * 3250).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Final Status Bar */}
        <div
          className={cn(
            "p-4 flex items-center justify-between",
            needsPayment ? "bg-red-50" : "bg-primary/5",
          )}
        >
          <div className="flex flex-col space-y-1">
            <p className="text-xs font-black text-dark uppercase">
              {needsPayment ? "Total Tagihan" : "Saldo Masuk"}
            </p>
            {needsPayment && (
              <span className="text-[10px] font-regular text-red-500">
                Lunas via Wallet
              </span>
            )}
          </div>
          <p
            className={cn(
              "text-lg font-black",
              needsPayment ? "text-red-600" : "text-primary",
            )}
          >
            Rp {(needsPayment ? charge : credit).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Payment Processing UI */}
      {needsPayment && phase === "paying" && (
        <div className="p-5 rounded-2xl bg-white border border-gray-100 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <div>
            <p className="text-sm font-black text-dark">Memproses Pembayaran</p>
            <p className="text-[10px] text-gray-500 mt-1">
              Menggunakan Saldo Wallet (Auto-deduct)
            </p>
          </div>
        </div>
      )}

      {needsPayment && phase === "done" && (
        <div className="p-5 rounded-2xl bg-green-50 border border-green-100 text-center space-y-2">
          <CheckCircle2 size={32} className="text-green-500 mx-auto" />
          <p className="text-sm font-black text-green-700">
            Pembayaran Berhasil!
          </p>
          <p className="text-[10px] text-green-600">
            Sampah segera diangkut kurir
          </p>
        </div>
      )}

      {/* Action Button */}
      {phase === "summary" && (
        <button
          onClick={onNext}
          className="w-full py-4 rounded-full bg-dark text-white font-black text-sm uppercase tracking-widest hover:bg-primary transition-all cursor-pointer"
        >
          Lanjutkan
        </button>
      )}

      <div className="flex items-center justify-center gap-2 pt-2">
        <CheckCircle2 size={14} className="text-secondary" />
        <span className="text-[10px] font-bold text-gray-400">
          Data telah divalidasi oleh sistem
        </span>
      </div>
    </div>
  );
}

// ─── Scheduled Wait View (MATCHED but waiting for scheduled time) ───
function ScheduledWaitView({
  scheduledTime = "14:00",
}: {
  scheduledTime?: string;
}) {
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
        <p className="text-[10px] text-gray-500 mt-1">Hari Ini</p>
      </div>

      {/* Courier info card */}
      <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-primary/20 shrink-0">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=courier1"
            alt="Courier"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-black text-dark">Ahmad Fauzi</p>
          <p className="text-[10px] text-gray-400 font-bold">
            L 1234 AB • Motor
          </p>
        </div>
        <CheckCircle2 size={20} className="text-primary" />
      </div>

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
function CompletedView({ onSummary }: { onSummary: () => void }) {
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
      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        <div className="p-3 rounded-xl bg-green-50 border border-green-100">
          <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest">
            Mutu
          </p>
          <p className="text-base font-black text-green-700">3.2 kg</p>
        </div>
        <div className="p-3 rounded-xl bg-red-50 border border-red-100">
          <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest">
            Residu
          </p>
          <p className="text-base font-black text-red-600">1.5 kg</p>
        </div>
      </div>
      <button
        onClick={onSummary}
        className="w-full py-4 rounded-full bg-primary text-white font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors cursor-pointer"
      >
        Lihat Ringkasan Pesanan
      </button>
    </div>
  );
}

// ─── Main Tracking Page ───
export default function TrackingPage() {
  const router = useRouter();
  const [statusIdx, setStatusIdx] = useState(0);
  const [showTimeline, setShowTimeline] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false); // Toggle for demo
  const currentStatus = DEMO_STATUSES[statusIdx];

  const nextStatus = () => {
    if (statusIdx < DEMO_STATUSES.length - 1) {
      setStatusIdx(statusIdx + 1);
    }
  };

  // Scheduled + MATCHED = show waiting card, not map
  const showScheduledWait =
    isScheduled && currentStatus === OrderStatus.MATCHED;

  // Determine which UI to render based on current status
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
              {showWeighing
                ? "Penimbangan"
                : showPayment
                  ? "Pembayaran"
                  : showCompleted
                    ? "Pesanan Selesai"
                    : "Tracking Pesanan"}
            </h1>
            <p className="text-[10px] text-gray-400 font-bold">#AGT-55291</p>
          </div>
          <div
            className={cn(
              "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
              showCompleted
                ? "bg-secondary/10 text-secondary"
                : showWeighing
                  ? "bg-orange-50 text-orange-500"
                  : showPayment
                    ? "bg-red-50 text-red-500"
                    : "bg-primary/10 text-primary",
            )}
          >
            {showCompleted
              ? "Selesai"
              : showWeighing
                ? "Timbang"
                : showPayment
                  ? "Bayar"
                  : "Aktif"}
          </div>
        </div>

        {/* Content — status-aware rendering */}
        <div className="flex-1 flex flex-col pb-20 overflow-y-auto">
          {showScheduledWait && <ScheduledWaitView scheduledTime="14:00" />}

          {showLiveTracker && (
            <LiveTracker
              status={currentStatus}
              courierName="Ahmad Fauzi"
              courierPlate="L 1234 AB"
              etaMinutes={8}
            />
          )}

          {showWeighing && <WeighingView />}

          {showPayment && <WeighingSummaryView onNext={nextStatus} />}

          {showPickup && <PickupView />}

          {showCompleted && (
            <CompletedView
              onSummary={() =>
                router.push("/dashboard/user/history/mock-order-123")
              }
            />
          )}

          {/* Timeline Toggle */}
          <div className="px-4 pt-3">
            <button
              onClick={() => setShowTimeline(!showTimeline)}
              className="w-full flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs font-black text-dark">
                Detail Timeline
              </span>
              {showTimeline ? (
                <ChevronUp size={16} className="text-gray-400" />
              ) : (
                <ChevronDown size={16} className="text-gray-400" />
              )}
            </button>

            {showTimeline && (
              <div className="mt-3 p-4 bg-white border border-gray-100 rounded-xl">
                <OrderTimeline currentStatus={currentStatus} />
              </div>
            )}
          </div>

          {/* Demo Controls */}
          <div className="px-4 mt-4 space-y-2">
            {/* Scheduled toggle */}
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

            {!showCompleted && !showPayment && (
              <button
                onClick={nextStatus}
                className="w-full py-3.5 rounded-full bg-dark text-white font-black text-xs uppercase tracking-widest hover:bg-primary transition-colors cursor-pointer"
              >
                Demo: Lanjut ke Status Berikutnya →
              </button>
            )}
          </div>
        </div>

        <BottomNav role="user" />
      </div>
    </div>
  );
}
