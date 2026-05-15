"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { walletService } from "@/services/wallet.service";
import BankAccountsList from "@/components/dashboard/BankAccountsList";
import WithdrawModal from "@/components/dashboard/WithdrawModal";
import {
  Wallet,
  ArrowUpRight,
  Plus,
  ArrowDownLeft,
  History,
  TrendingUp,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/cn";

export default function UserWalletPage() {
  const [showWithdraw, setShowWithdraw] = useState(false);

  const { data: walletData, isLoading: isWalletLoading } = useQuery({
    queryKey: ["walletBalance"],
    queryFn: walletService.getBalance,
  });

  const { data: txData, isLoading: isTxLoading } = useQuery({
    queryKey: ["walletTransactions"],
    queryFn: walletService.getTransactions,
  });

  const walletBalance = walletData?.data?.balance || 0;

  // Filter: only show PENDING, SUCCESS, FAILED (skip PROCESSING)
  const transactions = (txData?.data || []).filter((tx) =>
    ["PENDING", "SUCCESS", "FAILED"].includes(tx.status),
  );

  // Calculate totals from transactions
  const totalIncome = transactions
    .filter((tx) => tx.type === "CREDIT" && tx.status === "SUCCESS")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = transactions
    .filter((tx) => tx.type === "DEBIT" && tx.status === "SUCCESS")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return {
          label: "Berhasil",
          color: "bg-green-50 text-green-600 border-green-100",
          icon: CheckCircle2,
        };
      case "PENDING":
        return {
          label: "Menunggu",
          color: "bg-orange-50 text-orange-600 border-orange-100",
          icon: Clock,
        };
      case "FAILED":
        return {
          label: "Gagal",
          color: "bg-red-50 text-red-600 border-red-100",
          icon: XCircle,
        };
      default:
        return {
          label: status,
          color: "bg-gray-50 text-gray-600 border-gray-100",
          icon: Clock,
        };
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout role="user">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 pb-10">
        <div className="order-1 lg:col-span-4 lg:col-start-9 lg:row-start-1 space-y-6">
          <div className="bg-dark p-8 rounded-2xl text-white relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 opacity-10 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
              <Wallet size={160} />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-1.5">
                    Saldo Anda
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-white/40">Rp</span>
                    {isWalletLoading ? (
                      <div className="h-10 w-32 bg-white/10 animate-pulse rounded-lg mt-1" />
                    ) : (
                      <h2 className="md:text-4xl text-4xl font-black tracking-tighter">
                        {walletBalance.toLocaleString("id-ID")}
                      </h2>
                    )}
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl  py-1.5 px-2 rounded-md text-xs font-black flex flex-col items-center gap-0.5 border border-white/10 shadow-lg">
                  <span className="text-primary text-sm tracking-tight">
                    +2.8k
                  </span>
                  <span className="text-white/20 tracking-[0.2em] text-[7px]">
                    POINTS
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setShowWithdraw(true)}
                  className="py-4 bg-primary-light rounded-full text-xs text-dark font-black uppercase tracking-widest transition-all border border-white/5 cursor-pointer hover:opacity-90 active:scale-[0.98]"
                >
                  Tarik Saldo
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="order-2 lg:col-span-8 lg:col-start-1 lg:row-start-1">
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Total Pendapatan",
                value: totalIncome,
                icon: TrendingUp,
                color: "bg-green-50 text-green-600",
              },
              {
                label: "Total Pengeluaran",
                value: totalExpense,
                icon: ArrowDownLeft,
                color: "bg-red-50 text-red-600",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-6 md:p-8 rounded-2xl border border-primary flex flex-col justify-between h-36 md:h-44 transition-all group relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 relative z-10",
                    stat.color,
                  )}
                >
                  <stat.icon size={20} />
                </div>
                <div className="relative z-10">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold text-gray-500">Rp</span>
                    <p className="text-2xl md:text-3xl font-black text-dark tracking-tighter">
                      {stat.value.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-3 lg:col-span-4 lg:col-start-9 lg:row-start-2">
          <BankAccountsList />
        </div>

        <div className="order-4 lg:col-span-8 lg:col-start-1 lg:row-start-2 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-black text-dark text-lg flex items-center gap-2">
                <History size={20} className="text-primary" />
                Riwayat Transaksi
              </h3>
            </div>

            <div className="space-y-3">
              {isTxLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <History
                    size={40}
                    className="text-gray-300 mx-auto mb-4 opacity-50"
                  />
                  <p className="text-xs text-gray-400 font-regular uppercase tracking-widest">
                    Belum ada transaksi
                  </p>
                </div>
              ) : (
                transactions.map((tx) => {
                  const badge = getStatusBadge(tx.status);
                  const isIncome = tx.type === "CREDIT";
                  return (
                    <div
                      key={tx.id}
                      className="group bg-white p-5 rounded-xl border border-gray-50 hover:border-primary/20 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
                            isIncome
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-600",
                          )}
                        >
                          {isIncome ? (
                            <Plus size={20} />
                          ) : (
                            <ArrowUpRight size={20} />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-dark text-sm leading-none mb-1.5">
                            {(tx.description || tx.referenceType).split(" - ")[0]}
                          </h4>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            {tx.referenceType}
                            <span className="w-1 h-1 rounded-full bg-gray-200" />
                            {formatDate(tx.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "font-black text-sm tracking-tight mb-1",
                            isIncome ? "text-green-600" : "text-red-600",
                          )}
                        >
                          {isIncome ? "+" : "-"} Rp{" "}
                          {tx.amount.toLocaleString("id-ID")}
                        </p>
                        <span
                          className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                            badge.color,
                          )}
                        >
                          {badge.label}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <WithdrawModal
        isOpen={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        balance={walletBalance}
      />
    </DashboardLayout>
  );
}
