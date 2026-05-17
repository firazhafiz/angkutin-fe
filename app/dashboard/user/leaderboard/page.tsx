"use client";

import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Trophy,
  Medal,
  Award,
  Calendar,
  Gift,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";
import Image from "next/image";

// Dummy Data
const dummyLeaderboard = [
  {
    id: 1,
    name: "Budi Santoso",
    points: 15420,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
  },
  {
    id: 2,
    name: "Siti Rahma",
    points: 14200,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
  },
  {
    id: 3,
    name: "Agus Pratama",
    points: 13850,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Agus",
  },
  {
    id: 4,
    name: "Dewi Lestari",
    points: 12100,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi",
  },
  {
    id: 5,
    name: "Rizky Firmansyah",
    points: 11540,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rizky",
  },
  {
    id: 6,
    name: "Ayu Wandira",
    points: 10900,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayu",
  },
  {
    id: 7,
    name: "Hafiz",
    points: 9840,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hafiz",
  },
  {
    id: 8,
    name: "Dina Mariana",
    points: 8500,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dina",
  },
  {
    id: 9,
    name: "Bagus Setiawan",
    points: 7200,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bagus",
  },
  {
    id: 10,
    name: "Putri Anggraini",
    points: 6100,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Putri",
  },
];

export default function LeaderboardPage() {
  const topThree = dummyLeaderboard.slice(0, 3);
  const others = dummyLeaderboard.slice(3);

  return (
    <DashboardLayout role="user">
      <div className="max-w-6xl mx-auto space-y-8 pb-10">
        {/* Header Section */}
        <div className="bg-dark rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Trophy size={28} className="text-yellow-400" />
                <h1 className="text-3xl font-black tracking-tight">
                  Leaderboard
                </h1>
              </div>
              <p className="text-white/60 font-medium">
                Kumpulkan poin sebanyak-banyaknya dan menangkan hadiah
                eksklusif!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-md border border-white/10 flex items-center gap-3">
              <Calendar size={20} className="text-primary-light" />
              <div>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                  Periode Musim Ini
                </p>
                <p className="text-sm font-bold text-white">
                  1 Mei 2026 - 1 Nov 2026
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Leaderboard Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Top 3 Podium */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 flex items-end justify-center gap-4 sm:gap-8 h-[280px]">
              {/* 2nd Place */}
              <div className="flex flex-col items-center w-24 sm:w-28 relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-4 ring-gray-200 overflow-hidden mb-3 relative z-10">
                  <img
                    src={topThree[1].avatar}
                    alt={topThree[1].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-3 right-2 sm:right-4 z-20 bg-gray-200 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center font-black text-xs border-2 border-white ">
                  2
                </div>
                <p className="text-xs font-bold text-dark text-center line-clamp-1 w-full">
                  {topThree[1].name}
                </p>
                <p className="text-[10px] font-black text-primary mb-2">
                  {topThree[1].points.toLocaleString()} pt
                </p>
                <div className="w-full h-24 bg-gradient-to-t from-gray-100 to-gray-50 rounded-t-xl border border-gray-200 border-b-0 flex items-start justify-center pt-4">
                  <Medal size={24} className="text-gray-400" />
                </div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center w-28 sm:w-32 relative">
                <div className="absolute -top-8 text-yellow-400 z-0 animate-pulse">
                  <Trophy size={40} />
                </div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-4 ring-yellow-400 overflow-hidden mb-3 relative z-10 shadow-xl shadow-yellow-400/20">
                  <img
                    src={topThree[0].avatar}
                    alt={topThree[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-3 right-4 sm:right-6 z-20 bg-yellow-400 text-yellow-900 rounded-full w-6 h-6 flex items-center justify-center font-black text-xs border-2 border-white shadow-sm">
                  1
                </div>
                <p className="text-sm font-bold text-dark text-center line-clamp-1 w-full">
                  {topThree[0].name}
                </p>
                <p className="text-xs font-black text-primary mb-2">
                  {topThree[0].points.toLocaleString()} pt
                </p>
                <div className="w-full h-32 bg-gradient-to-t from-yellow-100/50 to-yellow-50 rounded-t-xl border border-yellow-200 border-b-0 flex items-start justify-center pt-4">
                  <Medal size={32} className="text-yellow-500" />
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center w-24 sm:w-28 relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-4 ring-amber-700/40 overflow-hidden mb-3 relative z-10">
                  <img
                    src={topThree[2].avatar}
                    alt={topThree[2].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-3 right-2 sm:right-4 z-20 bg-amber-700/20 text-amber-900 rounded-full w-6 h-6 flex items-center justify-center font-black text-xs border-2 border-white shadow-sm">
                  3
                </div>
                <p className="text-xs font-bold text-dark text-center line-clamp-1 w-full">
                  {topThree[2].name}
                </p>
                <p className="text-[10px] font-black text-primary mb-2">
                  {topThree[2].points.toLocaleString()} pt
                </p>
                <div className="w-full h-20 bg-gradient-to-t from-amber-50 to-orange-50/30 rounded-t-xl border border-amber-200/50 border-b-0 flex items-start justify-center pt-4">
                  <Medal size={24} className="text-amber-700/60" />
                </div>
              </div>
            </div>

            {/* Others List */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-dark text-sm">
                  Peringkat 4 - 10
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {others.map((user, index) => (
                  <div
                    key={user.id}
                    className={cn(
                      "p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors",
                      user.name === "Hafiz" ? "bg-primary/5" : "",
                    )}
                  >
                    <div className="w-8 font-black text-gray-400 text-center">
                      {index + 4}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "font-bold text-sm truncate",
                          user.name === "Hafiz" ? "text-primary" : "text-dark",
                        )}
                      >
                        {user.name} {user.name === "Hafiz" && "(Anda)"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-dark text-sm">
                        {user.points.toLocaleString()}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Points
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Prizes */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-primary to-[#0f4c42] rounded-2xl p-6 text-white  relative overflow-hidden">
              <div className="absolute -top-10 -right-10 text-white/10 transform rotate-12">
                <Gift size={120} />
              </div>

              <div className="relative z-10">
                <h2 className="text-xl font-black mb-1">Daftar Hadiah</h2>
                <p className="text-xs text-white/70 mb-6 font-medium">
                  Periode: 1 Mei - 1 Nov 2026
                </p>

                <div className="space-y-4">
                  {/* Juara 1 */}
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900 shrink-0 shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                      <Trophy size={24} className="fill-current" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400 mb-0.5">
                        Juara 1
                      </p>
                      <p className="font-bold text-sm leading-tight">
                        Rp 10.000.000
                      </p>
                      <p className="text-xs text-white/70 mt-0.5">
                        + Emas Antam 5g
                      </p>
                    </div>
                  </div>

                  {/* Juara 2 */}
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 shrink-0">
                      <Medal size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-0.5">
                        Juara 2
                      </p>
                      <p className="font-bold text-sm leading-tight">
                        Rp 5.000.000
                      </p>
                      <p className="text-xs text-white/70 mt-0.5">
                        Saldo e-Wallet
                      </p>
                    </div>
                  </div>

                  {/* Juara 3 */}
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-700/60 rounded-full flex items-center justify-center text-amber-100 shrink-0">
                      <Medal size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/80 mb-0.5">
                        Juara 3
                      </p>
                      <p className="font-bold text-sm leading-tight">
                        Rp 2.500.000
                      </p>
                      <p className="text-xs text-white/70 mt-0.5">
                        Saldo e-Wallet
                      </p>
                    </div>
                  </div>

                  {/* Juara 4 - 10 */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white/60 shrink-0 border border-white/5">
                      <Award size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-0.5">
                        Peringkat 4 - 10
                      </p>
                      <p className="font-bold text-sm leading-tight">
                        Rp 500.000
                      </p>
                      <p className="text-xs text-white/50 mt-0.5">
                        Saldo e-Wallet
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-dark text-sm mb-3 flex items-center gap-2">
                <Gift size={16} className="text-primary" /> Syarat & Ketentuan
              </h3>
              <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
                <li>
                  Poin didapatkan dari setiap transaksi penyetoran sampah yang
                  berhasil diselesaikan.
                </li>
                <li>
                  1 kg Sampah Mutu = 1 Poin (Atau sesuai konversi event yang
                  berlaku).
                </li>
                <li>
                  Pemenang akan dihubungi langsung oleh tim Angkutin maksimal 7
                  hari setelah periode berakhir.
                </li>
                <li>Pajak hadiah ditanggung oleh pemenang.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
