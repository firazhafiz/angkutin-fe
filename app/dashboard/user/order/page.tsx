"use client";

import React, { useEffect, useState } from "react";
import OrderWizard from "@/components/order/OrderWizard";
import BottomNav from "@/components/dashboard/BottomNav";
import { addressService } from "@/services/address.service";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function OrderPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAddress = async () => {
      try {
        const result = await addressService.getAddresses();
        const list = result.data || [];
        if (list.length === 0) {
          toast.error("Silakan isi alamat terlebih dahulu sebelum membuat pesanan.");
          router.replace("/dashboard/user/profile?tab=address");
        } else {
          setChecking(false);
        }
      } catch (err) {
        console.error("Failed to check address:", err);
        setChecking(false);
      }
    };
    checkAddress();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-dvh bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-dark flex items-stretch justify-center">
      <div className="w-full max-w-lg bg-gray-50 relative flex flex-col min-h-dvh">
        <OrderWizard />
        <BottomNav role="user" />
      </div>
    </div>
  );
}
