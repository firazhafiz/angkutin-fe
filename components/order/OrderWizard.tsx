"use client";
import React, { useState } from "react";
import { ArrowLeft, Box, ChevronLeft } from "lucide-react";
import ARScanner, { ScanResult } from "@/components/ar/ARScanner";
import VolumeEstimate from "@/components/ar/VolumeEstimate";
import AddressPicker from "@/components/maps/AddressPicker";
import VehicleDisplay from "./VehicleRecommendation";
import SchedulePicker from "./SchedulePicker";
import { VehicleType, ScheduleType } from "@/types/enums";
import { UserAddress } from "@/services/user.service";
import { useRouter } from "next/navigation";

// Mock addresses (will be replaced by fetching in Batch 8)
const MOCK_ADDRESSES: UserAddress[] = [
  {
    id: "addr-1",
    userId: "user-1",
    label: "Home",
    district: "Tandes",
    village: "Manukan Kulon",
    addressDetail: "Manukan Yoso Dalam Blok 7i No 16",
    isPrimary: true,
  },
  {
    id: "addr-2",
    userId: "user-1",
    label: "Office",
    district: "Jambangan",
    village: "Jambangan",
    addressDetail: "Jalan Jambangan Baru II No 15",
    isPrimary: false,
  },
];

export default function OrderWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  // Form State
  const [address, setAddress] = useState<UserAddress>(MOCK_ADDRESSES[0]);
  const [vehicle, setVehicle] = useState<VehicleType>(VehicleType.MOTOR);
  const [scheduleType, setScheduleType] = useState<ScheduleType>(
    ScheduleType.INSTANT,
  );
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [notes, setNotes] = useState("");

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

  const handleSubmit = () => {
    router.push("/dashboard/user/order/search");
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
            />
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
              <AddressPicker
                addresses={MOCK_ADDRESSES}
                selected={address}
                onSelect={setAddress}
              />
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
            className="w-full py-4 rounded-full bg-dark text-white font-black text-xs uppercase tracking-widest hover:bg-primary transition-colors shadow-xl shadow-gray-300/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            Cari Kurir Sekarang <Box size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
