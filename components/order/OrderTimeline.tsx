"use client";
import React from "react";
import {
  CheckCircle2,
  Circle,
  Truck,
  MapPin,
  Scale,
  CreditCard,
  Package,
  Navigation,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { OrderStatus } from "@/types/enums";

interface TimelineStep {
  status: OrderStatus;
  label: string;
  time?: string;
  icon: React.ReactNode;
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    status: OrderStatus.CREATED,
    label: "Pesanan Dibuat",
    icon: <Package size={16} />,
  },
  {
    status: OrderStatus.MATCHED,
    label: "Kurir Ditemukan",
    icon: <CheckCircle2 size={16} />,
  },
  {
    status: OrderStatus.ON_GOING,
    label: "Kurir Menuju Lokasi",
    icon: <Navigation size={16} />,
  },
  {
    status: OrderStatus.ARRIVED,
    label: "Kurir Tiba",
    icon: <MapPin size={16} />,
  },
  {
    status: OrderStatus.WEIGHING,
    label: "Proses Penimbangan",
    icon: <Scale size={16} />,
  },
  {
    status: OrderStatus.WAITING_PAYMENT,
    label: "Ringkasan Order",
    icon: <CreditCard size={16} />,
  },
  {
    status: OrderStatus.DELIVERING,
    label: "Pengantaran ke Gudang",
    icon: <Truck size={16} />,
  },
  {
    status: OrderStatus.COMPLETED,
    label: "Selesai",
    icon: <CheckCircle2 size={16} />,
  },
];

const STATUS_ORDER = Object.values(OrderStatus);

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  timestamps?: Partial<Record<OrderStatus, string>>;
  cancelled?: boolean;
}

export default function OrderTimeline({
  currentStatus,
  timestamps = {},
  cancelled = false,
}: OrderTimelineProps) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  // Mock timestamps for UI
  const displayTimestamps: Partial<Record<OrderStatus, string>> = timestamps;

  const steps = cancelled
    ? [
        ...TIMELINE_STEPS.slice(0, Math.max(currentIndex + 1, 1)),
        {
          status: OrderStatus.CANCELLED,
          label: "Dibatalkan",
          icon: <XCircle size={16} />,
        },
      ]
    : TIMELINE_STEPS;

  return (
    <div className="space-y-0">
      {steps.map((step, idx) => {
        const stepIndex = STATUS_ORDER.indexOf(step.status);
        const isPast = stepIndex < currentIndex;
        const isCurrent = step.status === currentStatus;
        const isFuture = stepIndex > currentIndex;
        const isCancelled = step.status === OrderStatus.CANCELLED;
        const isLast = idx === steps.length - 1;

        return (
          <div key={step.status} className="flex gap-3">
            {/* Line + Dot */}
            <div className="flex flex-col items-center w-8 shrink-0">
              {/* Dot */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all border-2",
                  isCancelled && "bg-red-500 border-red-500 text-white",
                  isPast &&
                    !isCancelled &&
                    "bg-primary border-primary text-white",
                  isCurrent &&
                    !isCancelled &&
                    "bg-primary border-primary text-white shadow-md shadow-primary/40",
                  isFuture &&
                    !isCancelled &&
                    "bg-white border-gray-200 text-gray-300",
                )}
              >
                {isPast ? <CheckCircle2 size={14} /> : step.icon}
              </div>
              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-[28px]",
                    isPast ? "bg-primary" : "bg-gray-200",
                    isCurrent && "bg-gradient-to-b from-primary to-gray-200",
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className={cn("pb-5 pt-1", isLast && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-bold leading-tight",
                  isCancelled && "text-red-500",
                  isPast && !isCancelled && "text-dark",
                  isCurrent && !isCancelled && "text-dark",
                  isFuture && !isCancelled && "text-gray-300",
                )}
              >
                {step.label}
              </p>
              {displayTimestamps[step.status] && (isPast || isCurrent) && (
                <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                  {displayTimestamps[step.status]}
                </p>
              )}
              {isCurrent && !isCancelled && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  <span className="text-[10px] font-black text-secondary uppercase tracking-widest">
                    Saat Ini
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
