"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import BottomNav from "@/components/dashboard/BottomNav";
import MapboxView from "@/components/maps/MapboxView";
import { parseDecimal } from "@/lib/decimal";
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
  Loader2,
  XCircle,
  Ban,
  AlertTriangle,
  Upload,
  ImageIcon,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { OrderStatus } from "@/types/enums";
import { cn } from "@/lib/cn";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { courierService } from "@/services/courier.service";
import type { Order, WasteType, WeighingSummary } from "@/types/models";
import { ANGKUTIN_WAREHOUSE } from "@/lib/constants";
import OrderDetailView from "./OrderDetailView";

// ─── Scheduled Wait ───
function ScheduledWaitCourier({
  order,
  onDepart,
  onCancel,
  loading,
}: {
  order: Order;
  onDepart: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
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
        <p className="text-xs text-gray-500 mt-1">
          Tunggu hingga jam penjemputan tiba
        </p>
      </div>
      <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 text-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          Jam Penjemputan
        </p>
        <p className="text-3xl font-black text-primary">{scheduledTime}</p>
      </div>
      <div className="p-4 rounded-2xl bg-white border border-gray-100 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black shrink-0">
            {order.user?.name?.charAt(0) || "C"}
          </div>
          <div>
            <p className="text-sm font-bold text-dark">
              {order.user?.name || "Customer"}
            </p>
            <p className="text-[10px] text-gray-400 font-bold">
              {order.user?.phone || "-"}
            </p>
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
            <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">
              Catatan Customer
            </p>
            <p className="text-xs text-dark font-medium italic">
              "{order.note}"
            </p>
          </div>
        )}
      </div>
      <button
        onClick={onDepart}
        disabled={loading}
        className="w-full py-4 rounded-full bg-primary text-white font-black text-sm hover:bg-primary/90 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Memproses...
          </>
        ) : (
          <>
            <Navigation size={16} className="fill-white/30" /> Berangkat
            Sekarang
          </>
        )}
      </button>
    </div>
  );
}

// ─── Navigation View ───
function NavigationView({
  status,
  order,
  onAction,
  onCancel,
  loading,
  hideButton = false,
  onCourierArrived,
}: {
  status: OrderStatus;
  order: Order;
  onAction: () => void;
  onCancel?: () => void;
  loading: boolean;
  hideButton?: boolean;
  onCourierArrived?: () => void;
}) {
  const isDel = status === OrderStatus.DELIVERING;
  const userLat = parseDecimal(order?.address?.latitude) || -7.2575;
  const userLng = parseDecimal(order?.address?.longitude) || 112.7521;

  // For DELIVERING: route from user address -> warehouse
  // For ON_GOING: route from offset (courier) -> user address
  const courierLat = isDel ? userLat : userLat - 0.005;
  const courierLng = isDel ? userLng : userLng - 0.005;
  const destLat = isDel ? ANGKUTIN_WAREHOUSE.lat : userLat;
  const destLng = isDel ? ANGKUTIN_WAREHOUSE.lng : userLng;

  const [realEta, setRealEta] = useState(8);

  return (
    <div className="space-y-0">
      <div className="h-56 sm:h-64 relative">
        <MapboxView
          center={[destLng, destLat]}
          zoom={13}
          showRoute={true}
          animateCourier={true}
          animationSpeed={800}
          onRouteUpdate={({ duration }) => setRealEta(Math.ceil(duration / 60))}
          onCourierArrived={onCourierArrived}
          markers={[
            {
              id: "courier",
              lat: courierLat,
              lng: courierLng,
              type: "courier",
            },
            {
              id: "dest",
              lat: destLat,
              lng: destLng,
              type: isDel ? "destination" : "user",
              label: isDel ? ANGKUTIN_WAREHOUSE.label : undefined,
            },
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
              {isDel
                ? ANGKUTIN_WAREHOUSE.address
                : order.address?.addressDetail || "-"}
            </p>
          </div>
        </div>

        {order.note && !isDel && (
          <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 flex gap-2">
            <Package size={14} className="text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">
                Catatan Penjemputan
              </p>
              <p className="text-xs text-dark font-medium italic leading-relaxed">
                "{order.note}"
              </p>
            </div>
          </div>
        )}

        {!hideButton && (
          <button
            onClick={onAction}
            disabled={loading}
            className="w-full py-4 rounded-full bg-primary text-white font-black text-sm hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Memproses...
              </>
            ) : (
              "Sampai di Lokasi Customer"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Arrived ───
function ArrivedView({
  onStartWeigh,
  onCancel,
  loading,
}: {
  onStartWeigh: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
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
        disabled={loading}
        className="w-full py-4 rounded-full bg-secondary text-white font-black text-sm hover:bg-secondary/90 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Memproses...
          </>
        ) : (
          "Mulai Proses Timbang"
        )}
      </button>
    </div>
  );
}

// ─── Weighing Form (Data-driven from BE) ───
function WeighingForm({
  order,
  onSubmit,
  loading,
}: {
  order: Order;
  onSubmit: (wasteTypeId: string, photo?: File) => void;
  loading: boolean;
}) {
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse weighing data from statusHistory (start-weighing note is JSON)
  const weighingEntry = order.statusHistory?.find(
    (h) => h.status === OrderStatus.WEIGHING && h.note?.startsWith("{"),
  );
  let mutuWeight = 0,
    residualWeight = 0;
  if (weighingEntry?.note) {
    try {
      const parsed = JSON.parse(weighingEntry.note);
      mutuWeight = parsed.mutuWeight || 0;
      residualWeight = parsed.residualWeight || 0;
    } catch {}
  }

  // Fetch waste types from API
  const { data: wasteTypesRes } = useQuery({
    queryKey: ["wasteTypes"],
    queryFn: () => orderService.getWasteTypes(),
  });
  const allWasteTypes: WasteType[] = wasteTypesRes?.data || [];
  const mutuTypes = allWasteTypes.filter((w) => w.category === "MUTU");
  const residuType = allWasteTypes.find((w) => w.category === "RESIDU");

  // Price preview
  const selectedMutuType = mutuTypes.find((w) => w.id === selectedTypeId);
  const creditPreview = selectedMutuType
    ? mutuWeight * selectedMutuType.unitPrice
    : 0;
  const debitPreview = residuType ? residualWeight * residuType.unitPrice : 0;
  const netPreview = creditPreview - debitPreview;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="text-center py-3">
        <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
          <Scale size={28} className="text-secondary animate-pulse" />
        </div>
        <h3 className="text-lg font-black text-dark">Proses Penimbangan</h3>
        <p className="text-xs text-gray-500 mt-1">
          Data berat dari sistem timbangan otomatis
        </p>
      </div>

      {/* Weight display (read-only from BE) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-md bg-white border border-dark/40">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-green-600" />
            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
              Sampah Mutu
            </span>
          </div>
          <p className="text-2xl font-black text-green-700">{mutuWeight}</p>
          <span className="text-xs font-bold text-green-600">kg</span>
        </div>
        <div className="p-4 rounded-md bg-white border border-dark/40">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={14} className="text-red-500" />
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
              Sampah Residu
            </span>
          </div>
          <p className="text-2xl font-black text-red-600">{residualWeight}</p>
          <span className="text-xs font-bold text-red-500">kg</span>
        </div>
      </div>

      {/* Single-select waste type from API */}
      <div className="space-y-2 flex flex-col">
        <label className="text-xs font-semibold text-gray-400">
          Jenis Sampah Mutu
        </label>
        <div className="grid grid-cols-2 gap-2">
          {mutuTypes.map((w) => {
            const sel = selectedTypeId === w.id;
            return (
              <div
                key={w.id}
                onClick={() => setSelectedTypeId(w.id)}
                className={cn(
                  "p-3 rounded-full border flex items-center gap-2.5 cursor-pointer transition-all",
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
                  {w.name}
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

      {/* Photo upload */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Foto Bukti Sampah
        </label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handlePhotoChange}
          className="hidden"
        />
        {photoPreview ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-100">
            <img
              src={photoPreview}
              alt="Preview"
              className="w-full h-40 object-cover"
            />
            <button
              onClick={() => {
                setPhoto(null);
                setPhotoPreview("");
              }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-dark/60 text-white flex items-center justify-center"
            >
              <XCircle size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-6 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center gap-2 hover:border-primary/40 transition-colors cursor-pointer"
          >
            <Camera size={24} className="text-gray-300" />
            <span className="text-xs font-bold text-gray-400">
              Ambil / Upload Foto
            </span>
          </button>
        )}
      </div>

      {/* Price Preview */}
      {selectedTypeId && (
        <div className="p-4 rounded-2xl bg-white border border-gray-100 space-y-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Preview Kalkulasi
          </p>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">
              Kredit Mutu ({mutuWeight}kg × Rp{" "}
              {selectedMutuType?.unitPrice?.toLocaleString("id-ID")})
            </span>
            <span className="font-bold text-green-600">
              + Rp {creditPreview.toLocaleString("id-ID")}
            </span>
          </div>
          {residuType && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">
                Debit Residu ({residualWeight}kg × Rp{" "}
                {residuType.unitPrice.toLocaleString("id-ID")})
              </span>
              <span className="font-bold text-red-500">
                - Rp {debitPreview.toLocaleString("id-ID")}
              </span>
            </div>
          )}
          <div className="pt-2 border-t border-gray-100 flex justify-between">
            <span className="text-xs font-black text-dark">Net Total</span>
            <span
              className={cn(
                "text-sm font-black",
                netPreview >= 0 ? "text-green-600" : "text-red-500",
              )}
            >
              {netPreview >= 0 ? "+" : ""} Rp{" "}
              {Math.abs(netPreview).toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      )}

      <button
        onClick={() => onSubmit(selectedTypeId, photo || undefined)}
        disabled={loading || !selectedTypeId}
        className="w-full py-4 rounded-full bg-dark text-white font-black text-sm hover:bg-primary transition-colors disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Memproses...
          </>
        ) : (
          "Submit Hasil Timbangan"
        )}
      </button>
    </div>
  );
}

// ─── Weighing Summary (Courier view — after submit, waiting for user) ───
function CourierWeighingSummaryView({ orderId }: { orderId: string }) {
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
        <p className="text-xs text-gray-400">Memuat ringkasan...</p>
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
          Menunggu konfirmasi dari customer
        </p>
      </div>

      <div className="bg-white border border-gray-300 rounded-2xl overflow-hidden ">
        <div className="p-4 grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
          <div className="pr-4">
            <p className="text-xs font-bold text-green-600  mb-1">Total Mutu</p>
            <p className="text-2xl font-black text-dark">
              {s.totalMutuWeight} kg
            </p>
            <p className="text-xs text-green-600 font-bold">
              {s.formattedCredit}
            </p>
          </div>
          <div className="pl-4">
            <p className="text-xs font-bold text-red-500  mb-1">Total Residu</p>
            <p className="text-2xl font-black text-dark">
              {s.totalResidualWeight} kg
            </p>
            <p className="text-xs text-red-500 font-bold">{s.formattedDebit}</p>
          </div>
        </div>
        <div
          className={cn(
            "p-4 flex items-center justify-between",
            s.netTotal >= 0 ? "bg-green-50" : "bg-red-50",
          )}
        >
          <p className="text-sm font-black text-dark ">Net Total</p>
          <p
            className={cn(
              "text-lg font-black",
              s.netTotal >= 0 ? "text-green-600" : "text-red-600",
            )}
          >
            {s.formattedNetTotal}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 py-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
          Menunggu konfirmasi user...
        </span>
      </div>
    </div>
  );
}

// ─── Waiting Payment (Courier view) ───
function WaitingPaymentCourierView({ orderId }: { orderId: string }) {
  const { data: summaryRes } = useQuery({
    queryKey: ["weighingSummary", orderId],
    queryFn: () => orderService.getWeighingSummary(orderId),
  });
  const summary: WeighingSummary | null = summaryRes?.data || null;
  const s = summary?.summary;

  return (
    <div className="p-4 space-y-4">
      <div className="text-center py-3">
        <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-3">
          <Wallet size={28} className="text-orange-500" />
        </div>
        <h3 className="text-lg font-black text-dark">Menunggu Pembayaran</h3>
        <p className="text-xs text-gray-500 mt-1">
          Customer sedang melakukan pembayaran
        </p>
      </div>
      {s && (
        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 text-center">
          <p className="text-xs font-bold text-orange-500 tracking-wide mb-1">
            Nominal Charge
          </p>
          <p className="text-2xl font-black text-orange-600">
            {s.formattedUserPays}
          </p>
        </div>
      )}
      <div className="flex items-center justify-center gap-2 py-2">
        <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
          Menunggu pembayaran...
        </span>
      </div>
    </div>
  );
}

// ─── Delivery Complete Form (photo + complete CTA) ───
function DeliveryCompleteForm({
  orderId,
  onComplete,
  loading,
  disabledUpload = false,
}: {
  orderId: string;
  onComplete: (photo?: File) => void;
  loading: boolean;
  disabledUpload?: boolean;
}) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-4 space-y-4">
      <div className="text-center py-3">
        <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 size={28} className="text-secondary" />
        </div>
        <h3 className="text-lg font-black text-dark">Tiba di Gudang</h3>
        <p className="text-xs text-gray-500 mt-1">
          Upload bukti pengiriman untuk menyelesaikan order
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-regular pb-2 text-gray-400">
          Foto Bukti Pengiriman
        </label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setPhoto(f);
              setPhotoPreview(URL.createObjectURL(f));
            }
          }}
          className="hidden"
        />
        {photoPreview ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-100">
            <img
              src={photoPreview}
              alt="Bukti"
              className="w-full h-40 object-cover"
            />
            <button
              onClick={() => {
                setPhoto(null);
                setPhotoPreview("");
              }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-dark/60 text-white flex items-center justify-center"
            >
              <XCircle size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabledUpload}
            className={cn(
              "w-full p-6 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center gap-2 transition-colors",
              disabledUpload
                ? "opacity-50 cursor-not-allowed bg-gray-50"
                : "hover:border-secondary/40 cursor-pointer",
            )}
          >
            <Camera size={24} className="text-gray-300" />
            <span className="text-xs font-bold text-gray-400 text-center px-4">
              {disabledUpload
                ? "Harap tunggu kurir tiba di gudang..."
                : "Ambil Foto Bukti"}
            </span>
          </button>
        )}
      </div>

      <button
        onClick={() => onComplete(photo || undefined)}
        disabled={loading || !photo}
        className="w-full py-4 rounded-full bg-secondary text-white font-black text-sm hover:bg-secondary/90 transition-colors disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Memproses...
          </>
        ) : (
          <>
            <CheckCircle2 size={16} /> Selesaikan Order
          </>
        )}
      </button>
    </div>
  );
}

// ─── Pickup ───
function PickupCourierView({
  onDepart,
  loading,
}: {
  onDepart: () => void;
  loading: boolean;
}) {
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
        disabled={loading}
        className="w-full py-4 rounded-full bg-primary text-white font-black text-sm hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Memproses...
          </>
        ) : (
          <>
            <Truck size={16} className="fill-white/30" /> Mulai Pengantaran ke
            Gudang
          </>
        )}
      </button>
    </div>
  );
}

// ─── Completed ───
function CompletedCourierView({
  order,
  onBack,
}: {
  order: Order;
  onBack: () => void;
}) {
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
        <p className="text-2xl font-black text-green-700">
          + Rp {(order.totalCredit ?? 0).toLocaleString("id-ID")}
        </p>
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

// ─── Cancelled (by user) ───
function CancelledCourierView({
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
        <h3 className="text-xl font-black text-dark">Order Dibatalkan</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
          Customer telah membatalkan pesanan ini. Anda akan diarahkan ke misi
          lainnya.
        </p>
      </div>
      <div className="p-4 rounded-2xl bg-red-50 border border-red-100 space-y-2">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
          Alasan Pembatalan
        </p>
        <p className="text-sm font-black text-red-600">
          "
          {order.statusHistory?.find((h) => h.status === OrderStatus.CANCELLED)
            ?.note || "Dibatalkan oleh pengguna"}
          "
        </p>
        <p className="text-[10px] text-gray-400">
          Order #{order.id.slice(0, 8).toUpperCase()}
        </p>
      </div>
      <button
        onClick={onBack}
        className="w-full py-4 rounded-full bg-dark text-white font-black text-sm hover:bg-primary transition-colors cursor-pointer"
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
  const [hasArrivedAtWarehouse, setHasArrivedAtWarehouse] = useState(false);

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
  const handleAction = useCallback(
    async (action: () => Promise<any>) => {
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
    },
    [refetchOrder],
  );

  const showIncoming = status === OrderStatus.CREATED;
  // Scheduled: MATCHED means waiting for departure. Instant: MATCHED is transient (BE sets ON_GOING on accept)
  const showScheduledWait = isScheduled && status === OrderStatus.MATCHED;
  const showInstantMatched = !isScheduled && status === OrderStatus.MATCHED;
  const showCompleted = status === OrderStatus.COMPLETED;
  const showCancelled = status === OrderStatus.CANCELLED;

  const statusLabel = !status
    ? "..."
    : showCancelled
      ? "Dibatalkan"
      : showIncoming
        ? "Penawaran"
        : showScheduledWait
          ? "Terjadwal"
          : status === OrderStatus.WEIGHING
            ? "Timbang"
            : showCompleted
              ? "Selesai"
              : "";

  // Courier can cancel only in MATCHED status per current BE constraints
  const canCancel = status === OrderStatus.MATCHED;

  const handleCourierCancel = async (reason: string) => {
    handleAction(async () => {
      await courierService.rejectOrder(orderId, reason);
      setShowCancelModal(false);
      router.push("/dashboard/courier");
    });
  };

  useEffect(() => {
    if (showCompleted || showCancelled) {
      router.replace(`/dashboard/courier/history/${orderId}`);
    }
  }, [showCompleted, showCancelled, router, orderId]);

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
          <button
            onClick={() => router.push("/dashboard/courier")}
            className="mt-4 text-xs font-bold text-primary hover:underline"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (showCompleted || showCancelled) {
    return null;
  }

  return (
    <div className="min-h-dvh bg-dark flex items-stretch justify-center">
      {/* Incoming Alert overlay */}
      {showIncoming && (
        <IncomingAlert
          customerName={order.user?.name || "Customer"}
          address={order.address?.addressDetail || "-"}
          vehicleType={
            order.courier?.vehicleType ||
            order.aiResults?.[0]?.recommendedVehicle ||
            "Motor"
          }
          isScheduled={isScheduled}
          scheduledTime={
            order.scheduledAt
              ? new Date(order.scheduledAt).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : undefined
          }
          onAccept={() =>
            handleAction(() => courierService.acceptOrder(orderId))
          }
          onDismiss={() => router.push("/dashboard/courier")}
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
              <p className="text-[10px] text-gray-400 font-bold">
                #{orderId.slice(0, 8).toUpperCase()}
              </p>
            </div>
            {statusLabel ? (
              <div
                className={cn(
                  "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                  showCancelled
                    ? "bg-red-50 text-red-500"
                    : showCompleted
                      ? "bg-secondary/10 text-secondary"
                      : status === OrderStatus.WEIGHING
                        ? "bg-orange-50 text-orange-500"
                        : "bg-primary/10 text-primary",
                )}
              >
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
              <ScheduledWaitCourier
                order={order}
                loading={actionLoading}
                onDepart={() =>
                  handleAction(() => courierService.departOrder(orderId))
                }
                onCancel={() => setShowCancelModal(true)}
              />
            )}

            {showInstantMatched && (
              <NavigationView
                status={OrderStatus.ON_GOING}
                order={order}
                loading={actionLoading}
                onAction={() =>
                  handleAction(() => courierService.arriveAtLocation(orderId))
                }
                onCancel={() => setShowCancelModal(true)}
              />
            )}

            {status === OrderStatus.ON_GOING && (
              <NavigationView
                status={OrderStatus.ON_GOING}
                order={order}
                loading={actionLoading}
                onAction={() =>
                  handleAction(() => courierService.arriveAtLocation(orderId))
                }
                onCancel={() => setShowCancelModal(true)}
              />
            )}

            {status === OrderStatus.ARRIVED && (
              <ArrivedView
                loading={actionLoading}
                onStartWeigh={() =>
                  handleAction(() => courierService.startWeighing(orderId))
                }
                onCancel={() => setShowCancelModal(true)}
              />
            )}

            {status === OrderStatus.WEIGHING &&
              (() => {
                // Check if weighing was already submitted (has wasteItems or submitted note)
                const hasSubmitted =
                  (order.wasteItems && order.wasteItems.length > 0) ||
                  order.statusHistory?.some(
                    (h) =>
                      h.status === OrderStatus.WEIGHING &&
                      h.note?.includes("mensubmit"),
                  );
                if (hasSubmitted) {
                  return <CourierWeighingSummaryView orderId={orderId} />;
                }
                return (
                  <WeighingForm
                    order={order}
                    loading={actionLoading}
                    onSubmit={(wasteTypeId, photo) =>
                      handleAction(() =>
                        courierService.submitWeighing(
                          orderId,
                          wasteTypeId,
                          photo,
                        ),
                      )
                    }
                  />
                );
              })()}

            {status === OrderStatus.WAITING_PAYMENT && (
              <WaitingPaymentCourierView orderId={orderId} />
            )}

            {status === OrderStatus.PICKED_UP && (
              <PickupCourierView
                loading={actionLoading}
                onDepart={() =>
                  handleAction(() => courierService.startDelivery(orderId))
                }
              />
            )}

            {status === OrderStatus.DELIVERING && (
              <div>
                <NavigationView
                  status={OrderStatus.DELIVERING}
                  order={order}
                  loading={actionLoading}
                  onAction={() => {}}
                  hideButton={true}
                  onCourierArrived={() => setHasArrivedAtWarehouse(true)}
                />
                <DeliveryCompleteForm
                  orderId={orderId}
                  loading={actionLoading}
                  disabledUpload={!hasArrivedAtWarehouse}
                  onComplete={(photo) =>
                    handleAction(() =>
                      courierService.completeOrder(orderId, photo),
                    )
                  }
                />
              </div>
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
