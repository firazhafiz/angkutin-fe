'use client';

import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical,
  Trash2,
  X
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/admin.service';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { AdminNotification } from '@/types/api';

const typeIcons = {
  INFO: <Info size={18} className="text-blue-500" />,
  SUCCESS: <CheckCircle2 size={18} className="text-secondary" />,
  WARNING: <AlertTriangle size={18} className="text-amber-500" />,
  ERROR: <XCircle size={18} className="text-red-500" />,
};

const typeStyles = {
  INFO: 'bg-blue-50 border-blue-100',
  SUCCESS: 'bg-emerald-50 border-emerald-100',
  WARNING: 'bg-amber-50 border-amber-100',
  ERROR: 'bg-red-50 border-red-100',
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  // ──────────────────────────────────────────────────────────
  // MOCK DATA & LOCAL STATE (Temporary until API is ready)
  // ──────────────────────────────────────────────────────────
  const [mockNotifs, setMockNotifs] = useState<AdminNotification[]>([
    {
      id: '1',
      title: 'Permintaan Penarikan Baru',
      message: 'Muhammad Ilham mengajukan penarikan dana sebesar Rp 150.000 via DANA.',
      type: 'INFO',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    },
    {
      id: '2',
      title: 'Peringatan Armada',
      message: 'Kurir Agus Prasetyo terpantau offline lebih dari 2 jam saat jam kerja.',
      type: 'WARNING',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: '3',
      title: 'Sistem Diperbarui',
      message: 'Pembaruan sistem versi 1.2.0 berhasil diterapkan ke semua modul.',
      type: 'SUCCESS',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      id: '4',
      title: 'Gagal Sinkronisasi Peta',
      message: 'Terjadi kesalahan saat sinkronisasi data GPS kurir ke dashboard fleet.',
      type: 'ERROR',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    },
    {
      id: '5',
      title: 'Registrasi Kurir Baru',
      message: 'Hendra Setiawan baru saja mendaftar sebagai mitra kurir. Perlu verifikasi.',
      type: 'INFO',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    }
  ]);

  // UNCOMMENT THIS WHEN BACKEND ENDPOINT IS READY
  /*
  const { data: notifData, isLoading } = useQuery({
    queryKey: ['admin', 'notifications'],
    queryFn: () => adminService.getNotifications(),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => adminService.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => adminService.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
      toast.success('Semua notifikasi ditandai terbaca');
    },
  });
  */

  // --- Temporary Local Handlers ---
  const handleMarkAsRead = (id: string) => {
    setMockNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setMockNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('Semua notifikasi ditandai terbaca');
  };

  const isLoading = false; // Mock loading state
  const notifications = mockNotifs;
  const unreadCount = notifications.filter(n => !n.isRead).length;


  const filteredNotifs = filter === 'ALL'
    ? notifications
    : notifications.filter(n => !n.isRead);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-dark flex items-center gap-2">
            Notifikasi
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-400">Kelola pemberitahuan sistem dan aktivitas armada</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="text-xs h-9 gap-2"
          >
            <CheckCheck size={16} />
            Tandai Semua Terbaca
          </Button>
          <button 
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-soft-gray text-gray-400 hover:bg-gray-50 transition-colors"
            title="Tutup"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-soft-gray">
        <button
          onClick={() => setFilter('ALL')}
          className={cn(
            "px-6 py-3 text-sm font-bold transition-all border-b-2",
            filter === 'ALL'
              ? "border-primary text-primary"
              : "border-transparent text-gray-400 hover:text-gray-600"
          )}
        >
          Semua
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={cn(
            "px-6 py-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2",
            filter === 'UNREAD'
              ? "border-primary text-primary"
              : "border-transparent text-gray-400 hover:text-gray-600"
          )}
        >
          Belum Dibaca
          {unreadCount > 0 && (
            <span className="h-2 w-2 rounded-full bg-primary" />
          )}
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 w-full bg-white border border-soft-gray rounded-2xl animate-pulse" />
          ))
        ) : filteredNotifs.length === 0 ? (
          <div className="bg-white border border-soft-gray rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
            <div className="h-16 w-16 bg-very-light-gray rounded-full flex items-center justify-center text-gray-300">
              <Bell size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-dark">Tidak ada notifikasi</p>
              <p className="text-xs text-gray-400">Semua pemberitahuan akan muncul di sini</p>
            </div>
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                "group relative bg-white border rounded-2xl p-4 md:p-5 flex gap-4 transition-all hover:shadow-md",
                !notif.isRead ? "border-primary-light shadow-sm cursor-pointer" : "border-soft-gray",
              )}
              onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
            >
              <div className={cn(
                "h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center shrink-0 border",
                typeStyles[notif.type]
              )}>
                {typeIcons[notif.type]}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={cn(
                    "text-sm font-bold truncate",
                    !notif.isRead ? "text-dark" : "text-gray-600"
                  )}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1 shrink-0">
                    <Clock size={10} />
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: id })}
                  </span>
                </div>
                <p className={cn(
                  "text-xs leading-relaxed line-clamp-2",
                  !notif.isRead ? "text-gray-600" : "text-gray-400"
                )}>
                  {notif.message}
                </p>

                <div className="flex items-center gap-3 pt-1">
                  {!notif.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notif.id);
                      }}
                      className="text-[10px] font-bold text-primary hover:underline"
                    >
                      Tandai terbaca
                    </button>
                  )}
                </div>
              </div>

              {!notif.isRead && (
                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary" />
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
