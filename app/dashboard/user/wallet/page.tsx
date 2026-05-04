"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Wallet,
  ArrowUpRight,
  Plus,
  ArrowDownLeft,
  History,
  Search,
  Filter,
  CreditCard,
  Gift,
  TrendingUp,
  Calendar,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/cn";

export default function UserWalletPage() {
  const [activeTab, setActiveTab] = useState("Semua");

  const transactions = [
    {
      id: "TX-9921",
      type: "Income",
      title: "Hasil Angkut Sampah",
      category: "Anorganik",
      date: "24 April 2024",
      amount: "+ Rp 25.000",
      points: "+ 125 pts",
      status: "Berhasil",
    },
    {
      id: "TX-9920",
      type: "Expense",
      title: "Tarik Saldo",
      category: "Bank Transfer",
      date: "21 April 2024",
      amount: "- Rp 50.000",
      points: null,
      status: "Berhasil",
    },
    {
      id: "TX-9919",
      type: "Income",
      title: "Bonus Referal",
      category: "Reward",
      date: "18 April 2024",
      amount: "+ Rp 10.000",
      points: "+ 50 pts",
      status: "Berhasil",
    },
    {
      id: "TX-9918",
      type: "Expense",
      title: "Pembelian Voucher",
      category: "Marketplace",
      date: "15 April 2024",
      amount: "- Rp 15.000",
      points: null,
      status: "Berhasil",
    },
  ];

  return (
    <DashboardLayout role="user">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 pb-10">
        {/* 1. Balance Card - Top (Mobile), Sidebar (Desktop) */}
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
                    <h2 className="md:text-4xl text-4xl font-black tracking-tighter">
                      425.000
                    </h2>
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
                <button className="py-4 bg-primary-light rounded-full text-xs text-dark font-black uppercase tracking-widest transition-all border border-white/5">
                  Tarik Saldo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Stats Grid - Below Balance (Mobile), Top-Left (Desktop) */}
        <div className="order-2 lg:col-span-8 lg:col-start-1 lg:row-start-1">
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Total Pendapatan",
                value: "1.250.000",
                icon: TrendingUp,
                color: "bg-green-50 text-green-600",
              },
              {
                label: "Total Pengeluaran",
                value: "850.000",
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
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Connected Accounts - Below Stats (Mobile), Sidebar (Desktop) */}
        <div className="order-3 lg:col-span-4 lg:col-start-9 lg:row-start-2">
          <div className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm">
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="text-sm font-black text-dark uppercase tracking-widest">
                Akun Terhubung
              </h3>
              <button className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Plus size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  name: "Bank Central Asia",
                  id: "**** 8821",
                  icon: CreditCard,
                  color: "bg-blue-50 text-blue-600",
                },
                {
                  name: "Bank Mandiri",
                  id: "**** 4412",
                  icon: CreditCard,
                  color: "bg-yellow-50 text-yellow-600",
                },
              ].map((acc, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-2xl border border-gray-50 hover:border-gray-100 transition-all group"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-md flex items-center justify-center",
                      acc.color,
                    )}
                  >
                    <acc.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-dark">{acc.name}</p>
                    <p className="text-xs text-gray-400 font-medium">
                      {acc.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Transactions - Bottom (Mobile), Below Stats (Desktop) */}
        <div className="order-4 lg:col-span-8 lg:col-start-1 lg:row-start-2 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-black text-dark text-lg flex items-center gap-2">
                <History size={20} className="text-primary" />
                Riwayat Transaksi
              </h3>
            </div>

            <div className="space-y-3">
              {transactions.map((tx, index) => (
                <div
                  key={index}
                  className="group bg-white p-5 rounded-xl border border-gray-50 hover:border-primary/20 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
                        tx.type === "Income"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600",
                      )}
                    >
                      {tx.type === "Income" ? (
                        <Plus size={20} />
                      ) : (
                        <ArrowUpRight size={20} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-dark text-sm leading-none mb-1.5">
                        {tx.title}
                      </h4>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        {tx.category}{" "}
                        <span className="w-1 h-1 rounded-full bg-gray-200" />{" "}
                        {tx.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "font-black text-sm tracking-tight mb-1",
                        tx.type === "Income"
                          ? "text-green-600"
                          : "text-red-600",
                      )}
                    >
                      {tx.amount}
                    </p>
                    <span
                      className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                        tx.status === "Berhasil"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-orange-50 text-orange-600 border-orange-100",
                      )}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-6 rounded-full border border-dashed  text-primary text-sm font-bold border-primary cursor-pointer">
              Lihat Semua Transaksi
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
