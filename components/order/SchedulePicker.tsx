"use client";
import React, { useMemo } from "react";
import {
  Clock,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { ScheduleType } from "@/types/enums";

interface SchedulePickerProps {
  value: ScheduleType;
  onChange: (type: ScheduleType) => void;
  time?: string;
  onTimeChange?: (time: string) => void;
}

// Generate time slots from now (rounded up to next 30min) until 17:00
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  const now = new Date();
  let startHour = now.getHours();
  let startMin = now.getMinutes();

  // Round up to next 30-minute mark (no extra hour buffer)
  if (startMin > 30) {
    startHour += 1;
    startMin = 0;
  } else if (startMin > 0) {
    startMin = 30;
  }

  // Set absolute bounds for start time: Min 9 AM
  if (startHour < 9) {
    startHour = 9;
    startMin = 0;
  }

  // Generate slots up to 17:00 (5 PM)
  for (let h = startHour; h <= 17; h++) {
    for (let m = h === startHour ? startMin : 0; m < 60; m += 30) {
      if (h === 17 && m > 0) break; // Stop exactly at 17:00
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
}

function formatTimeLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "Siang" : "Pagi";
  const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

function TimeSlotDropdown({
  time,
  onTimeChange,
  timeSlots,
}: {
  time?: string;
  onTimeChange: (time: string) => void;
  timeSlots: string[];
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between",
          isOpen
            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
            : "border-gray-200 bg-gray-50 hover:border-primary/30",
        )}
      >
        <span
          className={cn(
            "text-sm font-regular",
            time ? "text-dark" : "text-gray-600",
          )}
        >
          {time ? formatTimeLabel(time) : "Pilih Waktu (09:00 - 17:00)"}
        </span>
        <ChevronDown
          size={18}
          className={cn(
            "text-gray-400 transition-transform duration-300",
            isOpen && "rotate-180 text-primary",
          )}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl shadow-gray-200/50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div
            className="max-h-60 overflow-y-auto"
            style={{ scrollbarWidth: "thin" }}
          >
            {timeSlots.map((slot) => (
              <div
                key={slot}
                onClick={() => {
                  onTimeChange(slot);
                  setIsOpen(false);
                }}
                className={cn(
                  "px-4 py-3 text-sm font-bold cursor-pointer transition-colors flex items-center justify-between",
                  time === slot
                    ? "bg-primary/10 text-primary"
                    : "text-dark hover:bg-gray-50",
                )}
              >
                {formatTimeLabel(slot)}
                {time === slot && (
                  <CheckCircle2 size={16} className="text-primary" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SchedulePicker({
  value,
  onChange,
  time,
  onTimeChange,
}: SchedulePickerProps) {
  const timeSlots = useMemo(generateTimeSlots, []);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {/* Instant Card */}
        <button
          type="button"
          onClick={() => onChange(ScheduleType.INSTANT)}
          className={cn(
            "p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden",
            value === ScheduleType.INSTANT
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-gray-100 bg-white hover:border-primary/30",
          )}
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={cn(
                "p-2 rounded-xl",
                value === ScheduleType.INSTANT
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-400",
              )}
            >
              <Clock size={18} />
            </div>
            {value === ScheduleType.INSTANT && (
              <CheckCircle2 size={16} className="text-primary" />
            )}
          </div>
          <h4 className="font-black text-dark text-sm mb-0.5">Instan</h4>
          <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
            Kurir langsung meluncur ke lokasi Anda
          </p>
        </button>

        {/* Scheduled Card */}
        <button
          type="button"
          onClick={() => onChange(ScheduleType.SCHEDULED)}
          className={cn(
            "p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden",
            value === ScheduleType.SCHEDULED
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-gray-100 bg-white hover:border-primary/30",
          )}
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={cn(
                "p-2 rounded-xl",
                value === ScheduleType.SCHEDULED
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-400",
              )}
            >
              <CalendarIcon size={18} />
            </div>
            {value === ScheduleType.SCHEDULED && (
              <CheckCircle2 size={16} className="text-primary" />
            )}
          </div>
          <h4 className="font-black text-dark text-sm mb-0.5">Terjadwal</h4>
          <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
            Pilih jam penjemputan hari ini
          </p>
        </button>
      </div>

      {/* Time Slot Selector (Custom Dropdown) */}
      {value === ScheduleType.SCHEDULED && onTimeChange && (
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Pilih Jam Penjemputan
            </label>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Hari Ini
            </span>
          </div>

          {timeSlots.length > 0 ? (
            <TimeSlotDropdown
              time={time}
              onTimeChange={onTimeChange}
              timeSlots={timeSlots}
            />
          ) : (
            <div className="text-center py-6">
              <Clock size={24} className="text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400 font-medium">
                Tidak ada slot tersedia hari ini.
              </p>
              <p className="text-[10px] text-gray-300 mt-0.5">
                Coba pesan untuk besok melalui fitur Instan.
              </p>
            </div>
          )}

          {time && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
              <Clock size={12} className="text-primary shrink-0" />
              <p className="text-[10px] text-gray-500">
                Kurir estimasi tiba{" "}
                <span className="font-bold text-dark">
                  {formatTimeLabel(time)}
                </span>{" "}
                ± 15 menit.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
