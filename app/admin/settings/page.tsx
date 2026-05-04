'use client';

import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Palette } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">Pengaturan</h2>
        <p className="text-sm text-gray-400">Konfigurasi sistem admin panel</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: Shield, title: 'Keamanan', desc: 'Atur password, 2FA, dan sesi aktif', color: 'from-blue-500 to-blue-600' },
          { icon: Bell, title: 'Notifikasi', desc: 'Kelola preferensi notifikasi admin', color: 'from-amber-500 to-orange-500' },
          { icon: Palette, title: 'Tampilan', desc: 'Tema, bahasa, dan preferensi tampilan', color: 'from-purple-500 to-violet-600' },
        ].map((item) => (
          <div
            key={item.title}
            className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-200"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white mb-4 transition-transform group-hover:scale-105`}>
              <item.icon size={20} />
            </div>
            <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
            <p className="mt-1 text-xs text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500 text-center">
          ⚙️ Halaman pengaturan detail akan diimplementasikan pada sprint berikutnya
        </p>
      </div>
    </div>
  );
}
