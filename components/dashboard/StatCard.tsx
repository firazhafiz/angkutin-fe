"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  className?: string;
  iconClassName?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  className,
  iconClassName,
}: StatCardProps) {
  return (
    <div
      className={cn(
        " p-6 rounded-xl border border-dark shadow-sm hover:shadow-md transition-shadow",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={cn(
            "md:w-10 md:h-10 w-8 h-8 rounded-full flex items-center justify-center",
            iconClassName || "bg-primary/5 text-primary",
          )}
        >
          <Icon className="md:w-4 md:h-4 w-4 h-4" />
        </div>
        {trend && (
          <span className="text-xs md:text-sm font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <h3 className="text-lg md:text-2xl font-bold text-dark">{value}</h3>
      </div>
    </div>
  );
}
