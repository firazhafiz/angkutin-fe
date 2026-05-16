"use client";

import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Lock,
  User,
  Globe,
  Smartphone,
  Save,
  CheckCircle2,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "general" | "security" | "notifications";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [isSaving, setIsSaving] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    appName: "Angkutin",
    adminEmail: "admin@angkutin.com",
    timezone: "(GMT+07:00) Jakarta",
    language: "id",
    notifications: {
      email: true,
      push: true,
      courierAlert: false,
      weeklyReport: true,
    },
    isMaintenanceMode: false,
  });

  const toggleMaintenance = () => {
    setSettings((prev) => ({
      ...prev,
      isMaintenanceMode: !prev.isMaintenanceMode,
    }));
  };

  const toggleNotification = (key: keyof typeof settings.notifications) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 3000);
    }, 1000);
  };

  const tabs = [
    { id: "general", label: "Umum", icon: SettingsIcon },
    { id: "security", label: "Keamanan", icon: Shield },
    { id: "notifications", label: "Notifikasi", icon: Bell },
  ];

  // ───── Main Settings View ─────
  return (
    <div className="space-y-6">
      {/* Feedback Notification */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 right-6 z-100 flex items-center gap-3 rounded-xl bg-emerald-600 px-6 py-4 text-white "
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="font-bold">Pengaturan Tersimpan!</p>
              <p className="text-xs opacity-90">
                Semua perubahan Anda telah berhasil diperbarui.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-extrabold text-dark dark:text-white">
          Pengaturan
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Konfigurasi dan personalisasi sistem admin panel Angkutin
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <aside className="w-full lg:w-64 shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-soft-gray bg-white p-2 shadow-sm"
          >
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all relative overflow-hidden group",
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-gray-500 hover:bg-very-light-gray hover:text-dark",
                  )}
                >
                  <tab.icon
                    size={18}
                    className={cn(
                      "transition-colors",
                      activeTab === tab.id
                        ? "text-primary"
                        : "text-gray-400 group-hover:text-dark",
                    )}
                  />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                    />
                  )}
                </button>
              ))}
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 p-5 text-white "
          >
            <h4 className="text-sm font-bold">Butuh Bantuan?</h4>
            <p className="mt-1 text-xs opacity-90 leading-relaxed">
              Hubungi tim IT support jika Anda mengalami kesulitan teknis.
            </p>
            <button className="mt-4 w-full rounded-xl bg-white/20 px-3 py-2 text-xs font-semibold hover:bg-white/30 transition-all backdrop-blur-sm">
              Hubungi Support
            </button>
          </motion.div>
        </aside>

        {/* Content Area */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 rounded-2xl border border-soft-gray bg-white shadow-sm overflow-hidden flex flex-col min-h-[500px]"
        >
          <div className="border-b border-soft-gray bg-very-light-gray/50 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-dark capitalize">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h3>
          </div>

          <div className="p-6 flex-1 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <Input
                        label="Nama Aplikasi"
                        value={settings.appName}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            appName: e.target.value,
                          }))
                        }
                      />
                      <Input
                        label="Email Administrator"
                        value={settings.adminEmail}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            adminEmail: e.target.value,
                          }))
                        }
                      />
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block px-1">
                          Zona Waktu
                        </label>
                        <select
                          value={settings.timezone}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              timezone: e.target.value,
                            }))
                          }
                          className="flex h-12 w-full rounded-md border-2 border-gray-200 bg-white px-4 py-2 text-sm text-dark focus-visible:outline-none focus-visible:border-primary transition-all cursor-pointer"
                        >
                          <option>(GMT+07:00) Jakarta</option>
                          <option>(GMT+08:00) Singapore</option>
                          <option>(GMT+00:00) UTC</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block px-1">
                          Bahasa Utama
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setSettings((prev) => ({
                                ...prev,
                                language: "id",
                              }))
                            }
                            className={cn(
                              "flex-1 h-12 rounded-md border-2 px-4 py-2 text-sm font-semibold transition-all",
                              settings.language === "id"
                                ? "border-primary bg-primary/5 text-primary shadow-sm"
                                : "border-gray-200 bg-white text-gray-400",
                            )}
                          >
                            Indonesia
                          </button>
                          <button
                            onClick={() =>
                              setSettings((prev) => ({
                                ...prev,
                                language: "en",
                              }))
                            }
                            className={cn(
                              "flex-1 h-12 rounded-md border-2 px-4 py-2 text-sm font-semibold transition-all",
                              settings.language === "en"
                                ? "border-primary bg-primary/5 text-primary shadow-sm"
                                : "border-gray-200 bg-white text-gray-400",
                            )}
                          >
                            English
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "rounded-xl border border-l-4 p-4 transition-all",
                        settings.isMaintenanceMode
                          ? "border-red-100 bg-red-50/50 border-l-red-500"
                          : "border-amber-100 bg-amber-50/50 border-l-amber-400",
                      )}
                    >
                      <div className="flex gap-4">
                        <div
                          className={cn(
                            "h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-colors",
                            settings.isMaintenanceMode
                              ? "bg-red-100 text-red-600"
                              : "bg-amber-100 text-amber-600",
                          )}
                        >
                          {settings.isMaintenanceMode ? (
                            <AlertCircle size={20} />
                          ) : (
                            <SettingsIcon size={20} />
                          )}
                        </div>
                        <div>
                          <h4
                            className={cn(
                              "text-sm font-bold",
                              settings.isMaintenanceMode
                                ? "text-red-800"
                                : "text-amber-800",
                            )}
                          >
                            {settings.isMaintenanceMode
                              ? "Sistem dalam Mode Pemeliharaan"
                              : "Mode Pemeliharaan"}
                          </h4>
                          <p
                            className={cn(
                              "text-xs mt-1 leading-relaxed",
                              settings.isMaintenanceMode
                                ? "text-red-700/80"
                                : "text-amber-700/80",
                            )}
                          >
                            {settings.isMaintenanceMode
                              ? "Peringatan: Pengguna saat ini tidak dapat mengakses aplikasi."
                              : "Aktifkan ini untuk menonaktifkan sementara akses pengguna saat sedang ada pembaruan sistem besar."}
                          </p>
                          <button
                            onClick={toggleMaintenance}
                            className={cn(
                              "mt-3 rounded-lg px-4 py-1.5 text-xs font-bold text-white shadow-md transition-all active:scale-95",
                              settings.isMaintenanceMode
                                ? "bg-red-500 hover:bg-red-600 shadow-red-200"
                                : "bg-amber-500 hover:bg-amber-600 shadow-amber-200",
                            )}
                          >
                            {settings.isMaintenanceMode
                              ? "Matikan Pemeliharaan"
                              : "Aktifkan Mode Pemeliharaan"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="space-y-8">
                    {/* Change Password */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-dark font-bold">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Lock size={16} className="text-primary" />
                        </div>
                        <h4>Ubah Kata Sandi</h4>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <Input
                          type="password"
                          label="Password Sekarang"
                          placeholder="••••••••"
                        />
                        <Input
                          type="password"
                          label="Password Baru"
                          placeholder="••••••••"
                        />
                        <Input
                          type="password"
                          label="Konfirmasi Password"
                          placeholder="••••••••"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 italic px-1">
                        * Gunakan minimal 8 karakter dengan kombinasi angka dan
                        simbol.
                      </p>
                    </div>

                    <hr className="border-soft-gray" />

                    {/* 2FA */}
                    <div className="flex items-center justify-between rounded-2xl border border-soft-gray p-5 bg-very-light-gray/30 transition-all hover:border-gray-300 group">
                      <div className="flex gap-4">
                        <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-transform group-hover:scale-110">
                          <Smartphone size={24} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-dark">
                            Otentikasi Dua Faktor (2FA)
                          </h4>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                            Keamanan berlapis menggunakan aplikasi autentikator
                            atau SMS.
                          </p>
                        </div>
                      </div>
                      <button className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full bg-emerald-500 transition-colors shadow-inner">
                        <span className="translate-x-6 inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md" />
                      </button>
                    </div>

                    {/* Login Sessions */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <h4 className="text-sm font-bold text-dark">
                          Sesi Login Aktif
                        </h4>
                        <button className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors">
                          Keluar dari semua perangkat
                        </button>
                      </div>
                      <div className="space-y-3">
                        {[
                          {
                            device: "Windows PC • Jakarta, ID",
                            status: "Sesi Sekarang",
                            browser: "Chrome",
                            active: true,
                          },
                          {
                            device: "Macbook Pro • Bandung, ID",
                            status: "2 jam yang lalu",
                            browser: "Safari",
                            active: false,
                          },
                        ].map((session, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-4 rounded-xl border border-soft-gray bg-white hover:border-gray-300 transition-all hover:shadow-sm"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={cn(
                                  "h-3 w-3 rounded-full shadow-sm",
                                  session.active
                                    ? "bg-emerald-500 animate-pulse"
                                    : "bg-gray-300",
                                )}
                              />
                              <div>
                                <p className="text-sm font-bold text-dark">
                                  {session.device}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                  {session.browser} • {session.status}
                                </p>
                              </div>
                            </div>
                            {!session.active && (
                              <button className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                                <LogOut size={18} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-dark px-1">
                        Konfigurasi Pengiriman Notifikasi
                      </h4>
                      <div className="grid gap-4">
                        {[
                          {
                            id: "email",
                            title: "Notifikasi Email",
                            desc: "Terima log harian dan pembaruan sistem via email.",
                            icon: Globe,
                          },
                          {
                            id: "push",
                            title: "Notifikasi Push Desktop",
                            desc: "Dapatkan pemberitahuan langsung di pojok layar browser.",
                            icon: Bell,
                          },
                          {
                            id: "courierAlert",
                            title: "Alert Pendaftaran Kurir",
                            desc: "Beritahu saya secara real-time jika ada mitra baru.",
                            icon: User,
                          },
                          {
                            id: "weeklyReport",
                            title: "Ringkasan Mingguan",
                            desc: "Kirim performa operasional mingguan setiap hari Senin.",
                            icon: CheckCircle2,
                          },
                        ].map((n) => {
                          const isActive =
                            settings.notifications[
                              n.id as keyof typeof settings.notifications
                            ];
                          return (
                            <button
                              key={n.id}
                              onClick={() =>
                                toggleNotification(
                                  n.id as keyof typeof settings.notifications,
                                )
                              }
                              className="flex w-full items-center justify-between p-5 rounded-2xl border border-soft-gray bg-white hover:bg-very-light-gray/30 transition-all hover:border-gray-300 group shadow-sm hover:shadow-md"
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={cn(
                                    "h-10 w-10 rounded-xl flex items-center justify-center transition-colors group-hover:scale-110",
                                    isActive
                                      ? "bg-primary/10 text-primary"
                                      : "bg-gray-100 text-gray-400",
                                  )}
                                >
                                  <n.icon size={20} />
                                </div>
                                <div className="text-left">
                                  <h5 className="text-sm font-bold text-dark">
                                    {n.title}
                                  </h5>
                                  <p className="text-[11px] text-gray-400 mt-0.5">
                                    {n.desc}
                                  </p>
                                </div>
                              </div>
                              <div
                                className={cn(
                                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-all duration-300 shadow-inner",
                                  isActive ? "bg-emerald-500" : "bg-gray-200",
                                )}
                              >
                                <span
                                  className={cn(
                                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-md",
                                    isActive
                                      ? "translate-x-6"
                                      : "translate-x-1",
                                  )}
                                />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Save Area */}
          <motion.div className="border-t border-soft-gray bg-very-light-gray/20 px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <p className="text-[11px] text-gray-400 font-medium italic">
                  Sistem dalam keadaan stabil • Ready to sync
                </p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none h-11 border-gray-300"
                >
                  Reset
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 sm:flex-none gap-2 bg-primary hover:bg-primary-dark text-white px-10 h-11  transition-all hover:-translate-y-0.5 active:translate-y-0"
                  isLoading={isSaving}
                >
                  <Save size={18} />
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}
