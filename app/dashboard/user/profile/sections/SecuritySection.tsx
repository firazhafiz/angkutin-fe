"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  ArrowLeft,
  Shield,
  Key,
  Lock,
  Smartphone,
  Eye,
  EyeOff,
  Check,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/cn";

type ModalType = "password" | "pin" | null;

export default function SecuritySection({ onBack }: { onBack: () => void }) {
  const [modal, setModal] = useState<ModalType>(null);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [saved, setSaved] = useState(false);

  const sessions = [
    {
      device: "Chrome on Windows",
      location: "Bandung, ID",
      time: "Now · Active",
      current: true,
    },
    {
      device: "Safari on iPhone 14",
      location: "Bandung, ID",
      time: "2 hours ago",
      current: false,
    },
    {
      device: "Angkutin App (Android)",
      location: "Jakarta, ID",
      time: "3 days ago",
      current: false,
    },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setModal(null);
    }, 2000);
  };

  const handlePinInput = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...pin];
    next[idx] = val;
    setPin(next);
    if (val && idx < 5) {
      document.getElementById(`pin-${idx + 1}`)?.focus();
    }
  };

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
            <h2 className="text-xl font-extrabold text-dark">
              Account Security
            </h2>
            <p className="text-[10px] font-black text-dark/40 uppercase tracking-widest">
              Manage password, PIN & sessions
            </p>
          </div>
        </div>

        {/* Security Status Banner */}
        <div className="bg-dark rounded-2xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-green-400/20 flex items-center justify-center shrink-0">
            <Shield size={28} className="text-green-400" />
          </div>
          <div>
            <p className="font-black text-white">Your account is secure</p>
            <p className="text-white/50 text-xs mt-0.5">
              Last password change: 30 days ago
            </p>
          </div>
        </div>

        {/* Security Items */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Credentials
            </h3>
          </div>
          {[
            {
              icon: Key,
              label: "Change Password",
              desc: "Update your login password",
              color: "bg-blue-50 text-blue-600",
              action: () => setModal("password"),
            },
            {
              icon: Lock,
              label: "Wallet PIN",
              desc: "6-digit PIN for wallet transactions",
              color: "bg-purple-50 text-purple-600",
              action: () => setModal("pin"),
            },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className="w-full flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition-all group border-b border-gray-50 last:border-0"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  item.color,
                )}
              >
                <item.icon size={18} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-dark text-sm">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <ChevronRight
                size={18}
                className="text-gray-300 group-hover:text-primary transition-colors"
              />
            </button>
          ))}
        </div>

        {/* Active Sessions */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Active Sessions
            </h3>
            <button className="text-xs font-black text-red-500 hover:text-red-600">
              Revoke All
            </button>
          </div>
          {sessions.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-6 py-5 border-b border-gray-50 last:border-0"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <Smartphone size={18} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-dark text-sm">{s.device}</p>
                <p className="text-xs text-gray-400">
                  {s.location} · {s.time}
                </p>
              </div>
              {s.current ? (
                <span className="text-[9px] font-black uppercase bg-green-50 text-green-600 px-2 py-1 rounded-full">
                  Current
                </span>
              ) : (
                <button className="text-xs font-black text-red-400 hover:text-red-600 transition-colors">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-red-50">
            <h3 className="text-xs font-black text-red-400 uppercase tracking-widest">
              Danger Zone
            </h3>
          </div>
          <div className="px-6 py-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} className="text-red-500" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-dark text-sm">Delete Account</p>
              <p className="text-xs text-gray-400">
                Permanently delete your account and all data
              </p>
            </div>
            <button className="text-xs font-black text-red-500 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition-all">
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {modal === "password" && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-black text-dark">Change Password</h3>
              <button
                onClick={() => setModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                {
                  label: "Current Password",
                  show: showOld,
                  toggle: () => setShowOld(!showOld),
                },
                {
                  label: "New Password",
                  show: showNew,
                  toggle: () => setShowNew(!showNew),
                },
                {
                  label: "Confirm New Password",
                  show: showConfirm,
                  toggle: () => setShowConfirm(!showConfirm),
                },
              ].map((f, i) => (
                <div key={i}>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                    {f.label}
                  </label>
                  <div className="relative">
                    <input
                      type={f.show ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pl-4 pr-12 py-4 rounded-xl border border-gray-100 bg-gray-50 text-dark text-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={f.toggle}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {f.show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              ))}
              <div className="bg-blue-50 rounded-xl p-4 text-xs text-blue-700 font-medium space-y-1">
                <p className="font-bold">Password requirements:</p>
                <p>• At least 8 characters</p>
                <p>• Contains uppercase & lowercase letters</p>
                <p>• Contains at least one number</p>
              </div>
              <button
                onClick={handleSave}
                className={cn(
                  "w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                  saved
                    ? "bg-green-500 text-white"
                    : "bg-dark text-white hover:bg-primary",
                )}
              >
                {saved ? (
                  <>
                    <Check size={18} /> Password Updated!
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change PIN Modal */}
      {modal === "pin" && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-black text-dark">Set Wallet PIN</h3>
              <button
                onClick={() => setModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6 text-center">
              <p className="text-sm text-gray-500">
                Enter your 6-digit wallet security PIN
              </p>
              <div className="flex justify-center gap-3">
                {pin.map((digit, i) => (
                  <input
                    key={i}
                    id={`pin-${i}`}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinInput(e.target.value, i)}
                    className="w-12 h-14 rounded-xl border-2 border-gray-100 text-center text-xl font-black text-dark focus:outline-none focus:border-primary transition-all bg-gray-50 focus:bg-white"
                  />
                ))}
              </div>
              <button
                onClick={handleSave}
                disabled={pin.some((d) => !d)}
                className={cn(
                  "w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                  saved
                    ? "bg-green-500 text-white"
                    : "bg-dark text-white hover:bg-primary disabled:opacity-40",
                )}
              >
                {saved ? (
                  <>
                    <Check size={18} /> PIN Set!
                  </>
                ) : (
                  "Confirm PIN"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
