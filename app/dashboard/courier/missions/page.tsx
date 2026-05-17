"use client";

import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Search,
  Calendar,
  ChevronRight,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Trash2,
  Loader2,
  Truck,
  User,
} from "lucide-react";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { courierService } from "@/services/courier.service";
import { OrderStatus } from "@/types/enums";

// Map BE status to display label & style
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  [OrderStatus.CREATED]: {
    label: "Menunggu",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
  [OrderStatus.MATCHED]: {
    label: "Diterima",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  [OrderStatus.ON_GOING]: {
    label: "Menuju Lokasi",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  [OrderStatus.ARRIVED]: {
    label: "Tiba di Lokasi",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  [OrderStatus.WEIGHING]: {
    label: "Penimbangan",
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
  [OrderStatus.WAITING_PAYMENT]: {
    label: "Menunggu Bayar",
    color: "bg-orange-50 text-orange-600 border-orange-100",
  },
  [OrderStatus.PICKED_UP]: {
    label: "Diangkut",
    color: "bg-teal-50 text-teal-600 border-teal-100",
  },
  [OrderStatus.DELIVERING]: {
    label: "Mengantarkan",
    color: "bg-cyan-50 text-cyan-600 border-cyan-100",
  },
  [OrderStatus.COMPLETED]: {
    label: "Selesai",
    color: "bg-green-50 text-green-600 border-green-100",
  },
  [OrderStatus.CANCELLED]: {
    label: "Dibatalkan",
    color: "bg-red-50 text-red-600 border-red-100",
  },
};

type TabKey = "Semua" | "Sedang Berjalan" | "Selesai" | "Dibatalkan";

const TAB_FILTER: Record<TabKey, OrderStatus[]> = {
  Semua: [],
  "Sedang Berjalan": [
    OrderStatus.MATCHED,
    OrderStatus.ON_GOING,
    OrderStatus.ARRIVED,
    OrderStatus.WEIGHING,
    OrderStatus.WAITING_PAYMENT,
    OrderStatus.PICKED_UP,
    OrderStatus.DELIVERING,
  ],
  Selesai: [OrderStatus.COMPLETED],
  Dibatalkan: [OrderStatus.CANCELLED],
};

function getStatusDisplay(status: string) {
  return (
    STATUS_MAP[status] || {
      label: status,
      color: "bg-gray-50 text-gray-600 border-gray-100",
    }
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CourierHistoryPage() {
  const [activeTab, setActiveTab] = React.useState<TabKey>("Semua");
  const [search, setSearch] = React.useState("");

  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ["courierOrders"],
    queryFn: () => courierService.getMyOrders(),
  });

  const orders = (ordersResponse?.data || []) as any[];

  // Filter by tab
  const tabStatuses = TAB_FILTER[activeTab];
  const filteredOrders = orders
    .filter(
      (o: any) => tabStatuses.length === 0 || tabStatuses.includes(o.status),
    )
    .filter(
      (o: any) =>
        !search ||
        o.id?.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(search.toLowerCase()),
    );

  // Stats
  const totalOrders = orders.length;
  const completedOrders = orders.filter(
    (o: any) => o.status === OrderStatus.COMPLETED,
  ).length;
  const activeOrders = orders.filter(
    (o: any) =>
      ![OrderStatus.COMPLETED, OrderStatus.CANCELLED].includes(o.status),
  ).length;

  return (
    <DashboardLayout role="courier">
      <div className="space-y-6">
        {/* Header */}
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari ID atau nama user..."
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
            <p className="text-xl font-black text-dark">
              {isLoading ? "..." : totalOrders}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-50 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Selesai
            </p>
            <p className="text-xl font-black text-green-600">
              {isLoading ? "..." : completedOrders}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-50 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Aktif
            </p>
            <p className="text-xl font-black text-blue-600">
              {isLoading ? "..." : activeOrders}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-50 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Dibatalkan
            </p>
            <p className="text-xl font-black text-red-500">
              {isLoading
                ? "..."
                : orders.filter((o: any) => o.status === OrderStatus.CANCELLED)
                    .length}
            </p>
          </div>
        </div>

        {/* Tabs Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 p-1 bg-gray-100/50 rounded-2xl w-fit">
            {(Object.keys(TAB_FILTER) as TabKey[]).map((tab) => (
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
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={32} className="text-primary animate-spin mb-3" />
            <p className="text-sm text-gray-400 font-medium">Memuat order...</p>
          </div>
        )}

        {/* Order List */}
        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.map((order: any) => {
              const statusDisplay = getStatusDisplay(order.status);
              return (
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
                                statusDisplay.color,
                              )}
                            >
                              {statusDisplay.label}
                            </div>
                          </div>
                          <h3 className="font-black text-dark text-sm tracking-tight">
                            {order.id.slice(0, 8).toUpperCase()}
                          </h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 capitalize">
                          {(order.scheduleType || "").toLowerCase()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                        <Calendar size={14} className="text-gray-400" />
                        <span>
                          {formatDate(order.createdAt)} •{" "}
                          {formatTime(order.createdAt)}
                        </span>
                      </div>
                      {order.address && (
                        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="truncate">
                            {order.address.addressDetail ||
                              [order.address.village, order.address.district]
                                .filter(Boolean)
                                .join(", ")}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          {order.user ? (
                            <>
                              <span className="text-xs font-bold text-dark">
                                {order.user.name}
                              </span>
                            </>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400">
                              -
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/dashboard/courier/history/${order.id}`}
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
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="font-bold text-dark text-lg">Belum ada pesanan</h3>
            <p className="text-xs text-gray-400 mt-1">
              {search
                ? `Tidak ditemukan order "${search}"`
                : `Pesanan yang berstatus ${activeTab} akan muncul di sini.`}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
