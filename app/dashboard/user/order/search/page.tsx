"use client";

import React, { useEffect, useState, useCallback } from "react";
import FleetMap from "@/components/maps/FleetMap";
import BottomNav from "@/components/dashboard/BottomNav";
import { ChevronLeft, AlertCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { orderService } from "@/services/order.service";
import { OrderStatus } from "@/types/enums";
import { toast } from "sonner";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [isMatched, setIsMatched] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [orderCreatedAt, setOrderCreatedAt] = useState<string | undefined>();
  const [overrideStartTime, setOverrideStartTime] = useState<string | undefined>();
  const [isCancelling, setIsCancelling] = useState(false);

  // Poll BE for order status every 2s
  useEffect(() => {
    if (!orderId || isAccepted) return;

    const interval = setInterval(async () => {
      try {
        const res = await orderService.getOrderById(orderId);
        const order = res?.data;
        if (!order) return;

        if (!orderCreatedAt) setOrderCreatedAt(order.createdAt);

        // Broadcast matching logic:
        // Status stays CREATED while searching.
        // Status becomes MATCHED/ON_GOING when a courier accepts.
        if (
          order.status === OrderStatus.MATCHED ||
          order.status === OrderStatus.ON_GOING ||
          order.status === OrderStatus.ARRIVED
        ) {
          setIsMatched(true);
          // Very fast transition once someone accepts
          setTimeout(() => setIsAccepted(true), 1000);
          clearInterval(interval);
        } else if (order.status === OrderStatus.CANCELLED) {
          clearInterval(interval);
          router.push("/dashboard/user");
        }
      } catch {
        // ignore polling errors
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [orderId, isAccepted, router]);

  const handleMatch = useCallback(() => {
    // This is called by FleetMap internal timer
  }, []);

  const handleTimeout = useCallback(() => {
    setShowTimeoutModal(true);
  }, []);

  const cancelOrderTimeout = async () => {
    setIsCancelling(true);
    try {
      if (orderId) {
        await orderService.cancelOrder(orderId, "Tidak ada kurir yang tersedia. Batas waktu pencarian habis.");
      }
      toast.error("Maaf, tidak ada kurir yang tersedia saat ini. Pesanan Anda dibatalkan otomatis.");
      router.push("/dashboard/user");
    } catch (err) {
      console.error("Cancel failed on timeout:", err);
      toast.error("Maaf, tidak ada kurir yang tersedia saat ini.");
      router.push("/dashboard/user");
    }
  };

  const retrySearch = () => {
    setShowTimeoutModal(false);
    setOverrideStartTime(new Date().toISOString());
  };

  const handleCancel = useCallback(() => {
    setShowCancelModal(true);
  }, []);

  const confirmCancel = async () => {
    setIsCancelling(true);
    try {
      await orderService.cancelOrder(orderId!, "Dibatalkan oleh pengguna");
      router.push("/dashboard/user");
    } catch (err) {
      console.error("Cancel failed:", err);
      setIsCancelling(false);
      setShowCancelModal(false);
    }
  };

  // When polling detects acceptance, navigate to tracking
  useEffect(() => {
    if (isAccepted && orderId) {
      router.push(`/dashboard/user/order/tracking/${orderId}`);
    }
  }, [isAccepted, orderId, router]);

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
            <h1 className="text-sm font-black text-dark">Mencari Kurir</h1>
            <p className="text-[10px] text-gray-400 font-bold">
              {orderId
                ? `Pesanan #${orderId.slice(0, 8).toUpperCase()}`
                : "Pesanan baru"}
            </p>
          </div>
        </div>

        {/* Radar Content */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white px-6">
          <FleetMap
            onMatch={handleMatch}
            onTimeout={handleTimeout}
            onCancel={handleCancel}
            matchAfterSeconds={180} // disable internal timer, use external isMatched
            externalMatched={isMatched}
            startTime={overrideStartTime || orderCreatedAt}
          />
        </div>

        {/* Custom Confirmation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-150 flex items-center justify-center p-6">
            <div
              className="absolute inset-0 bg-dark/60 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setShowCancelModal(false)}
            />
            <div className="relative w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
              <h3 className="text-xl font-black text-dark text-center mb-2">
                Batalkan Pesanan?
              </h3>
              <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
                Apakah Anda yakin ingin membatalkan pencarian kurir ini?
              </p>
              <div className="space-y-3">
                <button
                  onClick={confirmCancel}
                  disabled={isCancelling}
                  className="w-full py-4 rounded-full bg-red-500 text-white font-black text-sm hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isCancelling ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Ya, Batalkan"
                  )}
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="w-full py-4 rounded-full border border-gray-300 bg-gray-50 text-gray-500 font-bold text-sm hover:bg-gray-100 transition-all active:scale-95 cursor-pointer"
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Timeout Modal */}
        {showTimeoutModal && (
          <div className="fixed inset-0 z-150 flex items-center justify-center p-6">
            <div
              className="absolute inset-0 bg-dark/60 backdrop-blur-sm animate-in fade-in duration-300"
            />
            <div className="relative w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-300 text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-black text-dark mb-2">
                Pencarian Berakhir
              </h3>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                Waktu pencarian telah habis, namun belum ada kurir yang menerima pesanan Anda. Apakah Anda ingin mencoba mencari lagi?
              </p>
              <div className="space-y-3">
                <button
                  onClick={retrySearch}
                  disabled={isCancelling}
                  className="w-full py-4 rounded-full bg-primary text-white font-black text-sm hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Coba Cari Lagi
                </button>
                <button
                  onClick={cancelOrderTimeout}
                  disabled={isCancelling}
                  className="w-full py-4 rounded-full border border-red-300 bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isCancelling ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Batalkan Pesanan"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <BottomNav role="user" />
      </div>
    </div>
  );
}
