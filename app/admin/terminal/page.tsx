'use client';

import React, { useState, useCallback } from 'react';
import { ScanLine, CheckCircle2, XCircle, Camera } from 'lucide-react';
import { mockVerifyQR, type ScanResult } from '@/services/mock/admin.mock';
import { cn } from '@/lib/cn';

// ──────────────────────────────────────────────────────────
// Terminal Scanner — Item 33 dari PRD
// Integrasikan html5-qrcode nanti. Untuk sekarang,
// demo dengan input manual QR string.
// ──────────────────────────────────────────────────────────

export default function TerminalPage() {
  const [qrInput, setQrInput] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState(false);

  const handleScan = useCallback(() => {
    if (!qrInput.trim()) return;
    setScanning(true);
    // Simulate scan delay
    setTimeout(() => {
      const res = mockVerifyQR(qrInput.trim());
      setResult(res);
      setScanning(false);
    }, 800);
  }, [qrInput]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">Terminal QR</h2>
        <p className="text-sm text-gray-400">Scan QR order untuk verifikasi kecocokan data di gudang</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Scanner Area */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-50 px-5 py-4">
            <h3 className="text-sm font-bold text-gray-900">📷 Scanner</h3>
            <p className="text-xs text-gray-400">Arahkan kamera ke QR code order, atau masukkan ID manual</p>
          </div>

          {/* Camera placeholder */}
          <div className="flex h-64 flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-8">
            <div className="relative">
              <div className="h-32 w-32 rounded-2xl border-2 border-dashed border-emerald-400/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera size={40} className="text-emerald-400/70" />
              </div>
              {/* Corner markers */}
              <div className="absolute -left-1 -top-1 h-4 w-4 border-l-2 border-t-2 border-emerald-400 rounded-tl" />
              <div className="absolute -right-1 -top-1 h-4 w-4 border-r-2 border-t-2 border-emerald-400 rounded-tr" />
              <div className="absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-emerald-400 rounded-bl" />
              <div className="absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-emerald-400 rounded-br" />
            </div>
            <p className="mt-4 text-xs text-gray-400">Kamera QR akan aktif saat html5-qrcode diintegrasikan</p>
          </div>

          {/* Manual input */}
          <div className="p-5 space-y-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Input Manual</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Contoh: ord-101"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              />
              <button
                onClick={handleScan}
                disabled={scanning || !qrInput.trim()}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all',
                  'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
                  'disabled:opacity-50 disabled:cursor-not-allowed shadow-sm'
                )}
              >
                <ScanLine size={16} />
                {scanning ? 'Scanning...' : 'Verifikasi'}
              </button>
            </div>
          </div>
        </div>

        {/* Result Area */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-50 px-5 py-4">
            <h3 className="text-sm font-bold text-gray-900">📋 Hasil Verifikasi</h3>
          </div>

          {!result ? (
            <div className="flex h-[400px] flex-col items-center justify-center p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-4">
                <ScanLine size={28} />
              </div>
              <p className="text-sm font-medium text-gray-500">Belum ada scan</p>
              <p className="text-xs text-gray-400 mt-1">Scan QR code untuk melihat hasil verifikasi</p>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {/* Match indicator */}
              <div className={cn('flex items-center gap-3 rounded-2xl p-4', result.matched ? 'bg-emerald-50' : 'bg-red-50')}>
                {result.matched ? (
                  <CheckCircle2 size={36} className="text-emerald-500 shrink-0" />
                ) : (
                  <XCircle size={36} className="text-red-500 shrink-0" />
                )}
                <div>
                  <h4 className={cn('text-lg font-extrabold', result.matched ? 'text-emerald-700' : 'text-red-700')}>
                    {result.matched ? '✅ COCOK' : '❌ TIDAK COCOK'}
                  </h4>
                  <p className={cn('text-xs', result.matched ? 'text-emerald-500' : 'text-red-400')}>
                    {result.matched ? 'Data order terverifikasi' : 'QR code tidak ditemukan di sistem'}
                  </p>
                </div>
              </div>

              {/* Detail */}
              {result.matched && (
                <div className="space-y-3">
                  {[
                    ['Order ID', result.orderId],
                    ['Pengguna', result.userName],
                    ['Kurir', result.courierName],
                    ['Status', result.orderStatus],
                    ['Waktu Scan', new Date(result.scannedAt).toLocaleString('id-ID')],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between border-b border-gray-50 pb-2">
                      <span className="text-xs text-gray-400">{label}</span>
                      <span className="text-sm font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}

                  {/* Waste items */}
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Item Sampah</span>
                    <div className="mt-2 space-y-1.5">
                      {result.wasteItems.map((item, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                          <span className="text-sm text-gray-700">{item.type}</span>
                          <span className="text-sm font-bold text-gray-900">{item.weightKg} kg</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
