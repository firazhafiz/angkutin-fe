"use client";

import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Package,
  User,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  Star,
  Download,
  HelpCircle,
  TrendingUp,
  Map as MapIcon,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";
import Link from "next/link";

interface OrderDetailViewProps {
  id: string;
}

export default function OrderDetailView({ id }: OrderDetailViewProps) {
  // Mock data for the specific order (Courier perspective)
  const order = {
    id: id || "AGT-12345",
    type: "Anorganik (Plastik)",
    status: "Selesai",
    date: "24 April 2024",
    time: "14:20",
    weight: "5.2 kg",
    price: "Rp 15.000",
    points: "+125 pts",
    address:
      "Jl. Merdeka No. 10, Kel. Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung, 40117",
    paymentMethod: "Dompet Komisi",
    customer: {
      name: "Firaz Hafiz",
      id: "CUST-99212",
      rating: 4.9,
      phone: "+62 812 3456 7890",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Firaz",
    },
    timeline: [
      { status: "Order Diterima", time: "14:00", completed: true },
      { status: "Menuju Lokasi", time: "14:05", completed: true },
      { status: "Tiba di Lokasi", time: "14:10", completed: true },
      { status: "Menimbang Sampah", time: "14:15", completed: true },
      { status: "Mengangkut Sampah", time: "14:20", completed: true },
      { status: "Tiba di Gudang", time: "14:25", completed: true },
      { status: "Validasi Selesai", time: "14:30", completed: true },
    ],
    items: [
      { name: "Sampah Mutu", qty: "3.2 kg", price: "Rp 9.000" },
      { name: "Sampah Residu", qty: "2.0 kg", price: "Rp 6.000" },
    ],
  };

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
              {order.id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Info & Timeline (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Minimal Status Header */}
            <div className=" flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Status Saat Ini
                  </p>
                  <h3 className="text-lg font-black text-dark uppercase">
                    {order.status}
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Estimasi Selesai
                </p>
                <p className="text-sm font-bold text-dark">
                  Selesai pada {order.time}
                </p>
              </div>
            </div>

            {/* Premium Vertical Timeline */}
            <div className="relative pl-4">
              <div className="absolute left-[33px] top-4 bottom-4 w-0.5 bg-slate-800/50 z-0"></div>
              {order.timeline.map((step, index) => (
                <div
                  key={index}
                  className="relative z-10 flex items-start gap-6 pb-10 last:pb-0 group"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shrink-0 transition-all duration-500",
                      step.completed
                        ? "bg-primary text-white scale-110"
                        : "bg-gray-50 text-gray-300",
                    )}
                  >
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="pt-1">
                    <p
                      className={cn(
                        "text-sm font-bold uppercase tracking-wider mb-1",
                        step.completed ? "text-dark" : "text-gray-400",
                      )}
                    >
                      {step.status}
                    </p>
                    <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
                      <Calendar size={10} /> {step.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Waste List - Borderless List Style */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-dark text-sm uppercase tracking-widest flex items-center gap-2">
                  <Package size={18} className="text-primary" />
                  Rincian Pengangkutan
                </h3>
                <div className="px-4 py-2 bg-primary-light rounded-full text-[10px] font-black text-gray-500 border border-gray-100">
                  {order.items.length} ITEM
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="space-y-2 w-full ">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-primary rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-5">
                        <span className="text-2xl font-black text-primary/40">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-dark">
                            {item.name}
                          </p>
                          <p className="text-xs font-bold text-gray-400">
                            {item.qty}
                          </p>
                        </div>
                      </div>
                      <p className="font-black text-dark tracking-tight">
                        {item.price}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="w-full mt-6 p-6 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
                      Akumulasi Berat
                    </p>
                    <p className="text-2xl font-black text-dark tracking-tighter">
                      {order.weight}
                    </p>
                  </div>
                  <TrendingUp size={32} className="text-primary/20" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customer & Receipt (5 cols) */}
          <div className="lg:col-span-5 space-y-10">
            {/* Clean Dashboard-style Map Preview */}
            <div className="relative group">
              <div className="relative h-72 rounded-2xl overflow-hidden border border-primary/10 bg-[#cad9d7] flex items-center justify-center shadow-inner">
                {/* Stylized Central Pin */}
                <div className="relative flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-ping absolute"></div>
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center relative shadow-xl border-4 border-white">
                    <MapPin size={24} />
                  </div>
                </div>

                {/* Simplified Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-full flex items-center gap-4 border border-white/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-primary uppercase tracking-widest mb-0.5">
                      Titik Penjemputan
                    </p>
                    <p className="text-[11px] font-bold text-dark leading-tight line-clamp-1">
                      {order.address}
                    </p>
                  </div>
                  <button className="w-10 h-10 flex items-center justify-center cursor-pointer">
                    <ChevronRight size={20} className="text-dark" />
                  </button>
                </div>
              </div>
            </div>

            {/* Customer & Rating Integrated */}
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-19 h-19 rounded-full overflow-hidden ring-2 ring-primary/60">
                    <img
                      src={order.customer.photo}
                      alt="Customer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-white w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">
                    {order.customer.rating}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-dark text-lg leading-tight">
                    {order.customer.name}
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
              {/* Digital Receipt Style Payment */}
              <div className="relative">
                <div className="bg-dark p-8 rounded-t-2xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <Package size={40} className="text-white/5" />
                  </div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-8">
                    Bukti Transaksi
                  </p>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/50 font-medium">
                        Disalurkan ke
                      </span>
                      <span className="font-bold">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/50 font-medium">
                        Waktu Selesai
                      </span>
                      <span className="font-bold">{order.date}</span>
                    </div>
                    <div className="pt-6 border-t border-white/10 flex items-end justify-between">
                      <div>
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">
                          KOMISI DITERIMA
                        </p>
                        <p className="text-4xl font-black text-white tracking-tighter">
                          {order.price}
                        </p>
                      </div>
                      <div className="bg-white/10 px-3 py-2 rounded-xl text-[10px] font-black flex items-center gap-2">
                        <span className="text-primary">{order.points}</span>
                        <span className="text-white/30 tracking-widest">
                          PTS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Receipt Jagged Edge Effect */}
                <div className="h-4 bg-dark rounded-b-2xl relative overflow-hidden flex">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-8 bg-gray-50 -mt-2 rounded-full transform rotate-45 origin-top-left"
                    ></div>
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
