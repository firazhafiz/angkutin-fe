"use client";

import React from "react";
import { Wallet, ArrowUpRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface WalletCardProps {
  balance: number;
  onOrder?: () => void;
  onWithdraw?: () => void;
  showOrderButton?: boolean;
  showWithdrawButton?: boolean;
  isLoading?: boolean;
}

export default function WalletCard({
  balance,
  onOrder,
  onWithdraw,
  showOrderButton = true,
  showWithdrawButton = false,
  isLoading = false,
}: WalletCardProps) {
  const formattedBalance = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(balance);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-dark p-8 text-white ">
      {/* Decorative Background Elements */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex md:h-10 md:w-10 w-8 h-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <Wallet size={18} className="text-secondary" />
            </div>
            <span className="text-sm font-medium text-gray-400">
              Saldo Wallet
            </span>
          </div>
          {!showWithdrawButton && onWithdraw && (
            <button
              onClick={onWithdraw}
              className="flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-white transition-colors"
            >
              Tarik Saldo <ArrowUpRight size={14} />
            </button>
          )}
        </div>

        <div>
          {isLoading ? (
            <div className="h-10 md:h-12 w-48 bg-white/10 animate-pulse rounded-lg" />
          ) : (
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              {formattedBalance}
            </h2>
          )}
          <p className="mt-2 text-xs text-gray-400 font-medium tracking-wide uppercase">
            Tersedia untuk digunakan
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {showOrderButton && (
            <Button
              onClick={onOrder}
              variant="secondary"
              size="lg"
              className="w-full py-7 text-sm md:text-base font-bold cursor-pointer hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
            >
              Mulai Angkut Sekarang
            </Button>
          )}

          {showWithdrawButton && (
            <Button
              onClick={onWithdraw}
              variant="secondary"
              size="lg"
              className="w-full py-7 text-sm md:text-base font-bold cursor-pointer hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
            >
              Tarik Saldo Sekarang
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
