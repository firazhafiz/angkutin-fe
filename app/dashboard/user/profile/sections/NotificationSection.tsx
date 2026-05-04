"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  ArrowLeft,
  Bell,
  Package,
  Wallet,
  Star,
  Tag,
  MessageSquare,
  Mail,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface NotifSetting {
  id: string;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  push: boolean;
  email: boolean;
  sms: boolean;
}

const defaultSettings: NotifSetting[] = [
  {
    id: "orders",
    label: "Order Updates",
    desc: "Status changes for your pickup requests",
    icon: Package,
    color: "bg-blue-50 text-blue-600",
    push: true,
    email: true,
    sms: false,
  },
  {
    id: "wallet",
    label: "Wallet & Payments",
    desc: "Transactions, withdrawals & top-ups",
    icon: Wallet,
    color: "bg-green-50 text-green-600",
    push: true,
    email: true,
    sms: true,
  },
  {
    id: "points",
    label: "Points & Rewards",
    desc: "Point earnings, level-ups & expiry",
    icon: Star,
    color: "bg-yellow-50 text-yellow-600",
    push: true,
    email: false,
    sms: false,
  },
  {
    id: "promo",
    label: "Promotions & Offers",
    desc: "Discounts, vouchers & special deals",
    icon: Tag,
    color: "bg-purple-50 text-purple-600",
    push: false,
    email: true,
    sms: false,
  },
  {
    id: "support",
    label: "Support & Updates",
    desc: "Replies to your reports & app updates",
    icon: MessageSquare,
    color: "bg-orange-50 text-orange-600",
    push: true,
    email: true,
    sms: false,
  },
];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "w-11 h-6 rounded-full transition-all relative shrink-0",
        checked ? "bg-primary" : "bg-gray-200",
      )}
    >
      <div
        className={cn(
          "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all",
          checked ? "left-6" : "left-1",
        )}
      />
    </button>
  );
}

export default function NotificationSection({
  onBack,
}: {
  onBack: () => void;
}) {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  const toggle = (id: string, channel: "push" | "email" | "sms") => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [channel]: !s[channel] } : s)),
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const channels = [
    { key: "push" as const, label: "Push", icon: Smartphone },
    { key: "email" as const, label: "Email", icon: Mail },
    { key: "sms" as const, label: "SMS", icon: MessageSquare },
  ];

  return (
    <DashboardLayout role="user">
      <div className="max-w-6xl mx-auto space-y-6 pb-10">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-700 hover:text-primary hover:border-primary transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-extrabold text-dark">Notifications</h2>
            <p className="text-[10px] font-black text-dark/40 uppercase tracking-widest">
              Manage your notification preferences
            </p>
          </div>
        </div>

        {/* Master Toggle */}
        <div className="bg-dark rounded-2xl p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Bell size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-black text-white text-sm">All Notifications</p>
            <p className="text-white/40 text-xs">
              Master switch for all alerts
            </p>
          </div>
          <Toggle checked={true} onChange={() => {}} />
        </div>

        {/* Channel Legend */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
            Channel Legend
          </h3>
          <div className="flex flex-wrap gap-4">
            {channels.map((ch) => (
              <div key={ch.key} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                  <ch.icon size={14} className="text-gray-500" />
                </div>
                <span className="text-xs font-bold text-gray-500">
                  {ch.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Notification Categories
            </h3>
          </div>

          {settings.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "px-6 py-5",
                i < settings.length - 1 && "border-b border-gray-50",
              )}
            >
              {/* Top Row: Icon + Label */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    s.color,
                  )}
                >
                  <s.icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-dark text-sm">{s.label}</p>
                  <p className="text-xs text-gray-400">{s.desc}</p>
                </div>
              </div>

              {/* Channel Toggles */}
              <div className="flex gap-4 pl-14">
                {channels.map((ch) => (
                  <div
                    key={ch.key}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      {ch.label}
                    </span>
                    <Toggle
                      checked={s[ch.key]}
                      onChange={() => toggle(s.id, ch.key)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quiet Hours */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
            Quiet Hours
          </h3>
          <p className="text-sm text-gray-500">
            Suppress non-critical notifications during these hours.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Start Time", default: "22:00" },
              { label: "End Time", default: "07:00" },
            ].map((t) => (
              <div key={t.label}>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                  {t.label}
                </label>
                <input
                  type="time"
                  defaultValue={t.default}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 text-dark text-sm font-medium focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className={cn(
            "w-full py-5 rounded-full text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
            saved
              ? "bg-green-500 text-white"
              : "bg-dark text-white hover:bg-primary",
          )}
        >
          {saved ? "✓ Preferences Saved!" : "Save Preferences"}
        </button>
      </div>
    </DashboardLayout>
  );
}
