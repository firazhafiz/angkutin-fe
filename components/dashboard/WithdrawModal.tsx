"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletService } from "@/services/wallet.service";
import { WalletAccount } from "@/types/wallet";
import { Button } from "@/components/ui/Button";
import {
  X,
  Loader2,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { toast } from "sonner";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

export default function WithdrawModal({
  isOpen,
  onClose,
  balance,
}: WithdrawModalProps) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [selectedAccount, setSelectedAccount] = useState<WalletAccount | null>(
    null,
  );
  const [amount, setAmount] = useState("");
  const [showAccountPicker, setShowAccountPicker] = useState(false);

  const { data: accountsData, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ["walletAccounts"],
    queryFn: walletService.getAccounts,
    enabled: isOpen,
  });

  const accounts = accountsData?.data || [];

  const withdrawMutation = useMutation({
    mutationFn: walletService.withdraw,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walletBalance"] });
      queryClient.invalidateQueries({ queryKey: ["walletTransactions"] });
      setStep("success");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Gagal memproses penarikan";
      toast.error("Penarikan Gagal", { description: message });
    },
  });

  const numericAmount = parseInt(amount.replace(/\D/g, "")) || 0;
  const isValidAmount = numericAmount >= 10000 && numericAmount <= balance;

  const handleAmountChange = (val: string) => {
    const raw = val.replace(/\D/g, "");
    if (raw === "") {
      setAmount("");
      return;
    }
    setAmount(parseInt(raw).toLocaleString("id-ID"));
  };

  const handleSubmit = () => {
    if (!selectedAccount || !isValidAmount) return;
    if (step === "form") {
      setStep("confirm");
      return;
    }
    withdrawMutation.mutate({
      amount: numericAmount,
      method: selectedAccount.providerName,
      accountNumber: selectedAccount.accountNumber,
      accountName: selectedAccount.accountName,
      paymentAccountId: selectedAccount.id,
    });
  };

  const handleClose = () => {
    setStep("form");
    setSelectedAccount(null);
    setAmount("");
    setShowAccountPicker(false);
    onClose();
  };

  const quickAmounts = [10000, 25000, 50000, 100000];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-black text-dark">
            {step === "success" ? "Penarikan Berhasil" : "Tarik Saldo"}
          </h3>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Success State */}
        {step === "success" && (
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <div>
              <h4 className="text-xl font-black text-dark mb-2">
                Permintaan Terkirim!
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Penarikan sebesar{" "}
                <span className="font-bold text-dark">
                  Rp {numericAmount.toLocaleString("id-ID")}
                </span>{" "}
                ke{" "}
                <span className="font-bold text-dark">
                  {selectedAccount?.providerName}
                </span>{" "}
                sedang diproses. Anda akan menerima notifikasi setelah disetujui
                admin.
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="w-full py-4 h-auto rounded-full cursor-pointer"
              variant="primary"
            >
              Kembali ke Wallet
            </Button>
          </div>
        )}

        {/* Confirm State */}
        {step === "confirm" && (
          <div className="p-8 space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Nominal
                </span>
                <span className="text-xl font-black text-dark">
                  Rp {numericAmount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="border-t border-gray-200" />
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Tujuan
                </span>
                <div className="text-right">
                  <p className="text-sm font-bold text-dark">
                    {selectedAccount?.providerName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedAccount?.accountNumber} •{" "}
                    {selectedAccount?.accountName}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200" />
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Status
                </span>
                <span className="text-xs font-semibold text-orange-400 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-widest">
                  Menunggu Persetujuan
                </span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle
                size={18}
                className="text-amber-500 mt-0.5 shrink-0"
              />
              <p className="text-xs text-amber-700 leading-relaxed">
                Penarikan memerlukan persetujuan admin. Dana akan dikirimkan
                setelah permintaan disetujui.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setStep("form")}
                className="py-4 rounded-full border border-gray-300 text-xs font-bold uppercase tracking-widest text-dark hover:bg-gray-50 transition-all"
              >
                Kembali
              </button>
              <Button
                onClick={handleSubmit}
                className="py-4 h-auto rounded-full cursor-pointer text-xs font-bold uppercase tracking-widest"
                isLoading={withdrawMutation.isPending}
              >
                Konfirmasi
              </Button>
            </div>
          </div>
        )}

        {/* Form State */}
        {step === "form" && (
          <div className="p-8 space-y-6">
            {/* Account Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-widest ml-1">
                Akun Tujuan
              </label>
              {isLoadingAccounts ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : accounts.length === 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-red-600 font-bold">
                    Belum ada akun terhubung. Tambahkan akun terlebih dahulu.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowAccountPicker(!showAccountPicker)}
                    className="w-full px-5 py-4 rounded-md bg-gray-50 border border-gray-200 text-left flex items-center justify-between hover:border-primary/30 transition-all"
                  >
                    {selectedAccount ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CreditCard size={16} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-dark">
                            {selectedAccount.providerName}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold tracking-widest">
                            **** {selectedAccount.accountNumber.slice(-4)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">
                        Pilih akun tujuan...
                      </span>
                    )}
                    <ChevronDown
                      size={16}
                      className={cn(
                        "text-gray-400 transition-transform",
                        showAccountPicker && "rotate-180",
                      )}
                    />
                  </button>

                  {showAccountPicker && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-sm z-10 max-h-48 overflow-y-auto">
                      {accounts.map((acc) => (
                        <button
                          key={acc.id}
                          onClick={() => {
                            setSelectedAccount(acc);
                            setShowAccountPicker(false);
                          }}
                          className={cn(
                            "w-full px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left",
                            selectedAccount?.id === acc.id && "bg-primary/5",
                          )}
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <CreditCard size={16} className="text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-dark">
                              {acc.providerName}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold tracking-widest">
                              **** {acc.accountNumber.slice(-4)} •{" "}
                              {acc.accountName}
                            </p>
                          </div>
                          {acc.isDefault && (
                            <span className="text-[8px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase tracking-widest">
                              Primary
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-widest ml-1">
                Nominal Penarikan
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                  Rp
                </span>
                <input
                  type="text"
                  placeholder="0"
                  className="w-full pl-12 pr-5 py-4 rounded-md bg-gray-50  text-dark text-lg font-black focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] text-gray-400 font-bold">
                  Min. Rp 10.000
                </p>
                <p className="text-[10px] text-gray-400 font-bold">
                  Saldo:{" "}
                  <span className="text-primary">
                    Rp {balance.toLocaleString("id-ID")}
                  </span>
                </p>
              </div>

              {numericAmount > balance && (
                <p className="text-[10px] text-red-500 font-bold px-1">
                  Saldo tidak mencukupi
                </p>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((qa) => (
                <button
                  key={qa}
                  disabled={qa > balance}
                  onClick={() => handleAmountChange(qa.toString())}
                  className={cn(
                    "py-3 rounded-md text-xs font-bold transition-all border",
                    numericAmount === qa
                      ? "bg-primary text-white border-primary"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed",
                  )}
                >
                  {(qa / 1000).toFixed(0)}rb
                </button>
              ))}
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={!selectedAccount || !isValidAmount}
              className="w-full py-5 h-auto rounded-full cursor-pointer font-black text-sm uppercase tracking-widest"
            >
              Lanjutkan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
