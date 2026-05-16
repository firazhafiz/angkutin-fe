"use client";
import React, { useState, useEffect } from "react";
import { Box, ChevronLeft, Loader2, Sparkles } from "lucide-react";
import ARScanner, { ScanResult } from "@/components/ar/ARScanner";
import VolumeEstimate from "@/components/ar/VolumeEstimate";
import AddressPicker from "@/components/maps/AddressPicker";
import VehicleDisplay from "./VehicleRecommendation";
import SchedulePicker from "./SchedulePicker";
import { VehicleType, ScheduleType, OrderStatus } from "@/types/enums";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/order.service";
import { addressService } from "@/services/address.service";
import { parseDecimal } from "@/lib/decimal";
import type { Address } from "@/types/models";
import { toast } from "sonner";

/** Lightweight address shape used only within the wizard UI */
interface WizardAddress {
  id: string;
  userId: string;
  label: string;
  district?: string;
  village?: string;
  addressDetail: string;
  isPrimary: boolean;
}

/** Convert BE Address (with Prisma Decimal coords) to the simple shape the picker needs */
function toWizardAddress(a: Address): WizardAddress {
  return {
    id: a.id,
    userId: a.userId,
    label: a.label,
    district: a.district,
    village: a.village,
    addressDetail: a.addressDetail,
    isPrimary: a.isPrimary,
  };
}

export default function OrderWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address State — fetched from BE
  const [addresses, setAddresses] = useState<WizardAddress[]>([]);
  const [address, setAddress] = useState<WizardAddress | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Form State
  const [vehicle, setVehicle] = useState<VehicleType>(VehicleType.MOTOR);
  const [scheduleType, setScheduleType] = useState<ScheduleType>(
    ScheduleType.INSTANT,
  );
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [notes, setNotes] = useState("");

  // Fetch addresses from BE when wizard loads
  useEffect(() => {
    const fetchAddresses = async () => {
      setLoadingAddresses(true);
      try {
        const result = await addressService.getAddresses();
        const list = (result.data || []).map(toWizardAddress);
        setAddresses(list);
        // Auto-select primary or first address
        const primary = list.find((a) => a.isPrimary) || list[0] || null;
        setAddress(primary);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
        toast.error("Gagal memuat alamat. Silakan coba lagi.");
      } finally {
        setLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleScanComplete = (result: ScanResult) => {
    setScanResult(result);
    setVehicle(result.vehicle); // Auto-lock to AI result
    setStep(2);
  };

  const handleRetakeScan = () => {
    setScanResult(null);
    setStep(1);
  };

  const handleConfirmScan = () => {
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!address) {
      toast.error("Pilih alamat penjemputan terlebih dahulu.");
      return;
    }
    if (!scanResult?.aiResultId) {
      toast.error("Hasil scan AI tidak ditemukan. Silakan scan ulang.");
      return;
    }
    if (scheduleType === ScheduleType.SCHEDULED && !scheduledTime) {
      toast.error("Pilih waktu penjemputan untuk jadwal terjadwal.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Build scheduledAt ISO string if SCHEDULED
      let scheduledAt: string | null = null;
      if (scheduleType === ScheduleType.SCHEDULED && scheduledTime) {
        const today = new Date();
        const [h, m] = scheduledTime.split(":").map(Number);
        today.setHours(h, m, 0, 0);
        scheduledAt = today.toISOString();
      }

      const result = await orderService.createOrder({
        addressId: address.id,
        scheduleType,
        scheduledAt,
        note: notes || undefined,
        aiResultId: scanResult.aiResultId,
      });

      const order = result.data;
      toast.success("Pesanan berhasil dibuat!");

      // Navigate to search/tracking page
      if (
        order.status === OrderStatus.CREATED ||
        order.status === OrderStatus.MATCHED
      ) {
        // Search (radar) page — wait for courier to accept (ON_GOING)
        router.push(`/dashboard/user/order/search?orderId=${order.id}`);
      } else if (order.status === OrderStatus.CANCELLED) {
        // Auto-cancelled (no courier)
        toast.error(
          "Tidak ada kurir tersedia di sekitar Anda. Coba lagi nanti.",
        );
        router.push("/dashboard/user");
      } else {
        // ON_GOING or beyond — go to tracking
        router.push(`/dashboard/user/order/tracking/${order.id}`);
      }
    } catch (err: any) {
      console.error("Create order failed:", err);
      const msg =
        err.response?.data?.message || "Gagal membuat pesanan. Coba lagi.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push("/dashboard/user");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Inline Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-30 border-b border-gray-100">
        <button
          onClick={goBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-sm font-black text-dark">Buat Pesanan</h1>
          <p className="text-[10px] text-gray-400 font-bold">
            Step {step} dari 3
          </p>
        </div>
        {/* Step Indicator */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= s ? "bg-primary w-6" : "bg-gray-200 w-1.5"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pb-40 overflow-y-auto">
        {step === 1 && (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-black text-dark mb-1">
                Scan Tumpukan Sampah
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                AI Angkutin mengestimasi volume dan merekomendasikan armada.
              </p>
            </div>
            <ARScanner
              onComplete={handleScanComplete}
              onCancel={() => router.push("/dashboard/user")}
              manualHint={notes}
              onHintChange={setNotes}
            />
            {/* Manual Hint Input moved here (below scanner) */}
            <div className="mt-4 p-5 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles size={16} className="fill-primary/20" />
                <h3 className="text-xs font-black uppercase tracking-widest">
                  Tambahkan Detail (Opsional)
                </h3>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Ada tumpukan kayu di bawah kardus..."
                className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm text-dark focus:outline-none focus:border-primary transition-colors resize-none h-24"
              />
              <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
                Informasi tambahan membantu AI memberikan estimasi yang lebih
                akurat.
              </p>
            </div>
          </div>
        )}

        {step === 2 && scanResult && (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-black text-dark mb-1">
                Hasil Estimasi AI
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Periksa hasil estimasi. Scan ulang jika kurang pas.
              </p>
            </div>
            <VolumeEstimate
              volume={scanResult.volume}
              confidence={scanResult.confidence}
              recommendedVehicle={scanResult.vehicle}
              onRetake={handleRetakeScan}
              onConfirm={handleConfirmScan}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 pb-4">
            <div className="mb-4">
              <h2 className="text-xl font-black text-dark mb-1">
                Detail Pesanan
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Lengkapi detail untuk mencari kurir terdekat.
              </p>
            </div>

            {/* 1. Address */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-wide text-gray-600 ">
                Lokasi Penjemputan
              </h3>
              {loadingAddresses ? (
                <div className="p-4 rounded-2xl border border-gray-100 bg-white flex items-center justify-center gap-2 text-gray-400">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-xs font-bold">Memuat alamat...</span>
                </div>
              ) : addresses.length > 0 && address ? (
                <AddressPicker
                  addresses={addresses}
                  selected={address}
                  onSelect={setAddress}
                />
              ) : (
                <div className="p-4 rounded-2xl border border-red-100 bg-red-50 text-center">
                  <p className="text-xs font-bold text-red-500">
                    Belum ada alamat tersimpan.
                  </p>
                  <p className="text-[10px] text-red-400 mt-1">
                    Tambahkan alamat di menu Profil → Alamat.
                  </p>
                </div>
              )}
            </div>

            {/* 2. Vehicle (Auto-locked by AI) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-wide text-gray-600 ml-1">
                Armada (Ditentukan AI)
              </h3>
              <VehicleDisplay vehicle={vehicle} />
            </div>

            {/* 3. Schedule */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-wide text-gray-600 ml-1">
                Waktu Penjemputan
              </h3>
              <SchedulePicker
                value={scheduleType}
                onChange={setScheduleType}
                time={scheduledTime}
                onTimeChange={setScheduledTime}
              />
            </div>

            {/* 4. Notes */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-wide text-gray-600 ml-1">
                Catatan (Opsional)
              </h3>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Tolong bawa karung tambahan, pagar hijau..."
                className="w-full p-4 rounded-2xl border border-gray-200 bg-white text-sm text-dark focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Floating CTA for Step 3 */}
      {step === 3 && (
        <div className="sticky bottom-16 p-4 z-20">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !address}
            className="w-full py-4 rounded-full bg-dark text-white font-black text-xs uppercase tracking-widest hover:bg-primary transition-colors shadow-xl shadow-gray-300/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Memproses...
              </>
            ) : (
              <>
                Cari Kurir Sekarang <Box size={16} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
