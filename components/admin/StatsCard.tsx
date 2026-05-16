"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  iconColor?: string;
  className?: string;
}

export default function StatsCard({
  label,
  value,
  subtitle,
  icon: Icon,
  trend,
  iconColor = "bg-primary",
  className,
}: StatsCardProps) {
  const displayValue =
    typeof value === "number" ? value.toLocaleString("id-ID") : value;
  const isLong = String(displayValue).length > 10;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-soft-gray bg-white p-4 md:p-5",
        "shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20",
        className,
      )}
    >
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-linear-to-br from-soft-gray to-transparent opacity-40 transition-transform duration-500 group-hover:scale-150" />

      <div className="relative flex flex-col gap-4">
        {/* Top: Label & Icon */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {label}
          </span>
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-white",
              "shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3",
              iconColor,
            )}
          >
            <Icon size={18} strokeWidth={2.5} />
          </div>
        </div>

        {/* Bottom: Main Data & Subtitle/Trend */}
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="group/text relative w-full">
            <span
              className={cn(
                "block font-extrabold text-dark tracking-tight truncate leading-none",
                isLong ? "text-2xl" : "text-3xl",
              )}
            >
              {displayValue}
            </span>

            {isLong && (
              <div className="pointer-events-none absolute -top-9 left-0 z-20 opacity-0 transition-all duration-200 group-hover/text:opacity-100 group-hover/text:-translate-y-1">
                <div className="relative rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold tracking-wide text-white shadow-xl whitespace-nowrap">
                  {displayValue}
                  <div className="absolute -bottom-1 left-4 h-2 w-2 rotate-45 bg-gray-900" />
                </div>
              </div>
            )}
          </div>

          {(subtitle || trend) && (
            <div className="flex items-center gap-2 mt-0.5">
              {trend && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-bold",
                    trend.direction === "up"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600",
                  )}
                >
                  {trend.direction === "up" ? "↗" : "↘"} {Math.abs(trend.value)}
                  %
                </span>
              )}
              {subtitle && (
                <span className="text-[11px] font-medium text-gray-400">
                  {subtitle}
                </span>
              )}
              {trend && !subtitle && (
                <span className="text-[11px] font-medium text-gray-400">
                  vs minggu lalu
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
