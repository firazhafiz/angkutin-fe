"use client";

import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Package,
  Phone,
  CheckCircle2,
  Download,
  HelpCircle,
  TrendingUp,
  ChevronRight,
  Loader2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { OrderStatus, WasteCategory } from "@/types/enums";
import type { Order } from "@/types/models";

interface OrderDetailViewProps {
  id: string;
}

const STATUS_TIMELINE_MAP: Record<string, string> = {
  [OrderStatus.CREATED]: "Order Diterima",
  [OrderStatus.MATCHED]: "Kurir Ditugaskan",
  [OrderStatus.ON_GOING]: "Menuju Lokasi",
  [OrderStatus.ARRIVED]: "Tiba di Lokasi",
  [OrderStatus.WEIGHING]: "Menimbang Sampah",
  [OrderStatus.WAITING_PAYMENT]: "Menunggu Pembayaran",
  [OrderStatus.PICKED_UP]: "Mengangkut Sampah",
  [OrderStatus.DELIVERING]: "Tiba di Gudang",
  [OrderStatus.COMPLETED]: "Order Selesai",
  [OrderStatus.CANCELLED]: "Dibatalkan",
};

const STATUS_SEQUENCE: OrderStatus[] = [
  OrderStatus.CREATED,
  OrderStatus.MATCHED,
  OrderStatus.ON_GOING,
  OrderStatus.ARRIVED,
  OrderStatus.WEIGHING,
  OrderStatus.WAITING_PAYMENT,
  OrderStatus.PICKED_UP,
  OrderStatus.DELIVERING,
  OrderStatus.COMPLETED,
];

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

function formatCurrency(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function buildTimeline(order: Order) {
  if (order.statusHistory && order.statusHistory.length > 0) {
    return order.statusHistory.map((entry) => ({
      status: STATUS_TIMELINE_MAP[entry.status] || entry.status,
      time: formatTime(entry.createdAt),
      completed: true,
    }));
  }
  const currentIdx = STATUS_SEQUENCE.indexOf(order.status);
  if (order.status === OrderStatus.CANCELLED) {
    return [
      { status: "Order Dibuat", time: formatTime(order.createdAt), completed: true },
      { status: "Dibatalkan", time: formatTime(order.createdAt), completed: true },
    ];
  }
  return STATUS_SEQUENCE.map((s, idx) => ({
    status: STATUS_TIMELINE_MAP[s] || s,
    time: idx === 0 ? formatTime(order.createdAt) : "-",
    completed: idx <= currentIdx,
  }));
}

export default function OrderDetailView({ id }: OrderDetailViewProps) {
  const { data: orderResponse, isLoading } = useQuery({
    queryKey: ["orderDetail", id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  });

  const order = orderResponse?.data as Order | null;

  if (isLoading) {
    return (
      <DashboardLayout role="courier">
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 size={32} className="text-primary animate-spin mb-3" />
          <p className="text-sm text-gray-400 font-medium">Memuat detail order...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout role="courier">
        <div className="flex flex-col items-center justify-center py-32">
          <XCircle size={32} className="text-red-400 mb-3" />
          <p className="text-sm text-gray-400 font-medium">Order tidak ditemukan</p>
          <Link href="/dashboard/courier/missions" className="mt-4 text-xs font-bold text-primary hover:underline">
            Kembali ke Daftar Order
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const timeline = buildTimeline(order);
  const wasteItems = order.wasteItems || [];
  const statusLabel = STATUS_TIMELINE_MAP[order.status] || order.status;
  const addressText = order.address?.addressDetail ||
    [order.address?.village, order.address?.district].filter(Boolean).join(", ") || "-";

  return (
    <DashboardLayout role="courier">
      <div className="space-y-6">
        {/* Back Button & Title */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/courier/missions"
            className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-700 hover:text-primary hover:border-primary transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-xl font-extrabold text-dark">Detail Order</h2>
            <p className="text-[10px] font-black text-dark/50 uppercase tracking-widest">
              {order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-10">
            {/* Status Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status Saat Ini</p>
                <h3 className="text-lg font-black text-dark uppercase">{statusLabel}</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Waktu Dibuat</p>
                <p className="text-sm font-bold text-dark">{formatDate(order.createdAt)} • {formatTime(order.createdAt)}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-4">
              <div className="absolute left-[33px] top-4 bottom-4 w-0.5 bg-slate-800/50 z-0"></div>
              {timeline.map((step, index) => (
                <div key={index} className="relative z-10 flex items-start gap-6 pb-10 last:pb-0 group">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shrink-0 transition-all duration-500",
                    step.completed ? "bg-primary text-white scale-110" : "bg-gray-50 text-gray-300",
                  )}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="pt-1">
                    <p className={cn("text-sm font-bold uppercase tracking-wider mb-1", step.completed ? "text-dark" : "text-gray-400")}>
                      {step.status}
                    </p>
                    <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
                      <Calendar size={10} /> {step.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Waste Items */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-dark text-sm uppercase tracking-widest flex items-center gap-2">
                  <Package size={18} className="text-primary" /> Rincian Pengangkutan
                </h3>
                <div className="px-4 py-2 bg-primary-light rounded-full text-[10px] font-black text-gray-500 border border-gray-100">
                  {wasteItems.length > 0 ? `${wasteItems.length} ITEM` : "BELUM ADA"}
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="space-y-2 w-full">
                  {wasteItems.length > 0 ? wasteItems.map((item, index) => (
                    <div key={item.id || index} className="flex items-center justify-between p-4 border border-primary rounded-xl transition-all group">
                      <div className="flex items-center gap-5">
                        <span className="text-2xl font-black text-primary/40">{index + 1}</span>
                        <div>
                          <p className="text-sm font-bold text-dark">
                            {item.category === WasteCategory.MUTU ? "Sampah Mutu" : "Sampah Residu"}
                            {item.type ? ` (${item.type})` : ""}
                          </p>
                          <p className="text-xs font-bold text-gray-400">{item.weightKg} kg</p>
                        </div>
                      </div>
                      <p className="font-black text-dark tracking-tight">{formatCurrency(item.subtotal)}</p>
                    </div>
                  )) : (
                    <div className="p-6 border border-dashed border-gray-200 rounded-xl text-center">
                      <p className="text-xs text-gray-400 font-medium">Rincian muncul setelah penimbangan.</p>
                    </div>
                  )}
                </div>

                {(order.totalCredit > 0 || order.netTotal !== null) && (
                  <div className="w-full mt-6 p-6 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Net Total</p>
                      <p className="text-2xl font-black text-dark tracking-tighter">
                        {formatCurrency(order.netTotal ?? order.totalCredit ?? 0)}
                      </p>
                    </div>
                    <TrendingUp size={32} className="text-primary/20" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-10">
            {/* Map Preview */}
            <div className="relative group">
              <div className="relative h-72 rounded-2xl overflow-hidden border border-primary/10 bg-[#cad9d7] flex items-center justify-center shadow-inner">
                <div className="relative flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-ping absolute"></div>
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center relative shadow-xl border-4 border-white">
                    <MapPin size={24} />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-full flex items-center gap-4 border border-white/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-primary uppercase tracking-widest mb-0.5">Titik Penjemputan</p>
                    <p className="text-[11px] font-bold text-dark leading-tight line-clamp-1">{addressText}</p>
                  </div>
                  <button className="w-10 h-10 flex items-center justify-center cursor-pointer">
                    <ChevronRight size={20} className="text-dark" />
                  </button>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-19 h-19 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-2xl ring-2 ring-primary/60">
                    {order.user?.name?.charAt(0) || "U"}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-dark text-lg leading-tight">
                    {order.user?.name || "User"}
                  </h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Customer Angkutin
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-primary/10 text-primary rounded-md text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                      Chat
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-all">
                      <Phone size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Digital Receipt */}
              <div className="relative">
                <div className="bg-dark p-8 rounded-t-2xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <Package size={40} className="text-white/5" />
                  </div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-8">Bukti Transaksi</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/50 font-medium">Jadwal</span>
                      <span className="font-bold capitalize">{order.scheduleType.toLowerCase()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/50 font-medium">Waktu Dibuat</span>
                      <span className="font-bold">{formatDate(order.createdAt)}</span>
                    </div>
                    {order.note && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/50 font-medium">Catatan</span>
                        <span className="font-bold text-right max-w-[200px] truncate">{order.note}</span>
                      </div>
                    )}
                    <div className="pt-6 border-t border-white/10 flex items-end justify-between">
                      <div>
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">
                          {order.netTotal !== null && order.netTotal !== undefined ? "NET TOTAL" : "KREDIT MUTU"}
                        </p>
                        <p className="text-4xl font-black text-white tracking-tighter">
                          {formatCurrency(order.netTotal ?? order.totalCredit ?? 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-4 bg-dark rounded-b-2xl relative overflow-hidden flex">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="flex-1 h-8 bg-gray-50 -mt-2 rounded-full transform rotate-45 origin-top-left"></div>
                  ))}
                </div>
              </div>

              {/* Action Strip */}
              <div className="flex gap-4">
                <button className="flex-1 py-4 bg-white border border-gray-100 rounded-md text-xs font-black uppercase tracking-widest text-dark hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                  <Download size={16} className="text-primary" /> Struk PDF
                </button>
                <button className="flex-1 py-4 bg-white border border-gray-100 rounded-md text-xs font-black uppercase tracking-widest text-dark hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                  <HelpCircle size={16} className="text-primary" /> Bantuan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
