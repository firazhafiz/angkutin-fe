"use client";

import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Search,
  Filter,
  Calendar,
  ChevronRight,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import Link from "next/link";

const orders = [
  {
    id: "AGT-12345",
    type: "Anorganik (Plastik)",
    date: "24 April 2024",
    time: "14:20",
    weight: "5.2kg",
    price: "Rp 15.000",
    status: "Selesai",
    address: "Jl. Merdeka No. 10, Bandung",
    customer: "Firaz Hafiz",
  },
  {
    id: "AGT-12346",
    type: "Campuran (Mutu & Residu)",
    date: "21 April 2024",
    time: "10:15",
    weight: "3.1kg",
    price: "Rp 10.000",
    status: "Selesai",
    address: "Jl. Merdeka No. 10, Bandung",
    customer: "Budi Santoso",
  },
  {
    id: "AGT-12347",
    type: "Organik",
    date: "28 April 2024",
    time: "09:00",
    weight: "2.5kg",
    price: "Rp 8.000",
    status: "Sedang Berjalan",
    address: "Jl. Merdeka No. 10, Bandung",
    customer: "Siti Aminah",
  },
  {
    id: "AGT-12348",
    type: "Anorganik (Kertas)",
    date: "15 April 2024",
    time: "16:45",
    weight: "8.0kg",
    price: "Rp 20.000",
    status: "Dibatalkan",
    address: "Jl. Merdeka No. 10, Bandung",
    customer: "Bambang Pamungkas",
  },
];

export default function CourierHistoryPage() {
  const [activeTab, setActiveTab] = React.useState("Semua");

  const statusColors = {
    Selesai: "bg-green-50 text-green-600 border-green-100",
    "Sedang Berjalan": "bg-blue-50 text-blue-600 border-blue-100",
    Dibatalkan: "bg-red-50 text-red-600 border-red-100",
  };

  const statusIcons = {
    Selesai: <CheckCircle2 size={14} />,
    "Sedang Berjalan": <Clock size={14} />,
    Dibatalkan: <XCircle size={14} />,
  };

  return (
    <DashboardLayout role="courier">
      <div className="space-y-6">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-dark">Daftar Order</h2>
            <p className="text-base text-gray-400 mt-1">
              Pantau semua aktivitas penjemputan sampah Anda.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari ID Pesanan..."
                className="pl-10 pr-9 py-2.5 text-dark bg-white rounded-md text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all w-full md:w-64 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-50 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Total Order
            </p>
            <p className="text-xl font-black text-dark">156</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-50 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Selesai
            </p>
            <p className="text-xl font-black text-green-600">142</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-50 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Total Berat
            </p>
            <p className="text-xl font-black text-dark">450.5kg</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-50 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Pendapatan
            </p>
            <p className="text-xl font-black text-primary">Rp 2.4jt</p>
          </div>
        </div>

        {/* Tabs Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 p-1 bg-gray-100/50 rounded-2xl w-fit">
            {["Semua", "Sedang Berjalan", "Selesai", "Dibatalkan"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2 text-[10px] md:text-xs font-bold rounded-full transition-all",
                    activeTab === tab
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-600 border border-primary",
                  )}
                >
                  {tab}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Order List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders
            .filter((o) => activeTab === "Semua" || o.status === activeTab)
            .map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-50 shadow-sm transition-all duration-300 group overflow-hidden"
              >
                <div className="p-5 md:p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                        <Package size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className={cn(
                              "flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border",
                              statusColors[
                                order.status as keyof typeof statusColors
                              ],
                            )}
                          >
                            {order.status}
                          </div>
                        </div>
                        <h3 className="font-black text-dark text-lg md:text-xl tracking-tighter">
                          {order.id}
                        </h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-primary">
                        {order.price}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400">
                        {order.weight}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                      <Calendar size={14} className="text-gray-400" />
                      <span>
                        {order.date} • {order.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="truncate">{order.address}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden border border-white">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.customer}`}
                            alt="Customer"
                          />
                        </div>
                        <span className="text-xs font-bold text-dark">
                          {order.customer}
                        </span>
                      </div>

                      <Link
                        href={`/dashboard/courier/missions/${order.id}`}
                        className="flex items-center gap-1 text-[10px] font-bold text-primary group/btn"
                      >
                        Lihat Detail{" "}
                        <ChevronRight
                          size={14}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Empty State (if no orders) */}
        {orders.filter((o) => activeTab === "Semua" || o.status === activeTab)
          .length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="font-bold text-dark text-lg">Belum ada pesanan</h3>
            <p className="text-xs text-gray-400 mt-1">
              Pesanan Anda yang berstatus {activeTab} akan muncul di sini.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
