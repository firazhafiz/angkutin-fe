"use client";

import React from "react";
import OrderWizard from "@/components/order/OrderWizard";
import BottomNav from "@/components/dashboard/BottomNav";

export default function OrderPage() {
  return (
    <div className="min-h-dvh bg-dark flex items-stretch justify-center">
      <div className="w-full max-w-lg bg-gray-50 relative flex flex-col min-h-dvh">
        <OrderWizard />
        <BottomNav role="user" />
      </div>
    </div>
  );
}
