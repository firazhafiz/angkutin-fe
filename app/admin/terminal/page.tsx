'use client';

import React, { useState, useCallback } from 'react';
import { ScanLine, CheckCircle2, XCircle, Camera, Wallet, RefreshCw, CheckCircle } from 'lucide-react';
import { mockVerifyQR, type ScanResult } from '@/services/mock/admin.mock';
import { cn } from '@/lib/cn';
import { QRScanner } from '@/components/admin/QRScanner';

// ──────────────────────────────────────────────────────────
// Terminal Scanner & Disbursement Simulation
// ──────────────────────────────────────────────────────────

type FlowStatus = 'idle' | 'scanning' | 'verifying' | 'matched' | 'disbursing' | 'completed';

export default function TerminalPage() {
  const [qrInput, setQrInput] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [flowStatus, setFlowStatus] = useState<FlowStatus>('idle');
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Computed dummy payout
  const totalWeight = result?.wasteItems.reduce((acc, item) => acc + item.weightKg, 0) || 0;
  const simulatedPayout = totalWeight * 3500; // Dummy calculation

  const processScan = useCallback((code: string) => {
    if (!code.trim()) return;
    setQrInput(code);
    setIsCameraActive(false); // Pause camera after successful scan
    setFlowStatus('verifying');

    // Simulate API delay
    setTimeout(() => {
      const res = mockVerifyQR(code.trim());
      setResult(res);
      setFlowStatus(res.matched ? 'matched' : 'idle');
      if (!res.matched) {
        // If not matched, stay in idle but show error result
        setFlowStatus('idle');
      }
    }, 800);
  }, []);

  const handleManualScan = () => {
    processScan(qrInput);
  };

  const handleDisbursement = () => {
    setFlowStatus('disbursing');
    // Simulate transaction delay
    setTimeout(() => {
      setFlowStatus('completed');
    }, 1500);
  };

  const resetFlow = () => {
    setResult(null);
    setQrInput('');
    setFlowStatus('idle');
    setIsCameraActive(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">Terminal QR</h2>
        <p className="text-sm text-gray-400">Scan QR order untuk verifikasi kecocokan data dan pencairan dana kurir</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ----------------- Scanner Area ----------------- */}
        <div className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden h-full">
          <div className="flex items-center justify-between border-b border-gray-50 px-5 py-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">📷 Scanner</h3>
              <p className="text-xs text-gray-400">Arahkan kamera ke QR code dari Kurir</p>
            </div>
            <button
              onClick={() => setIsCameraActive(!isCameraActive)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border",
                isCameraActive
                  ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                  : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
              )}
            >
              {isCameraActive ? 'Matikan Kamera' : 'Aktifkan Kamera'}
            </button>
          </div>

          {/* Camera View */}
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex-1 w-full flex flex-col items-center justify-center bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative">
              {isCameraActive ? (
                <QRScanner onScanSuccess={processScan} isScanning={isCameraActive} />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center h-64">
                  <Camera size={48} className="text-gray-300 mb-4" />
                  <p className="text-sm font-medium text-gray-500">Kamera tidak aktif</p>
                  <p className="text-xs text-gray-400 mt-1">Klik "Aktifkan Kamera" di atas untuk mulai scan</p>
                </div>
              )}
            </div>

            {/* Manual input */}
            <div className="mt-5 space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Atau Input Manual ID</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Contoh: ord-101"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualScan()}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                />
                <button
                  onClick={handleManualScan}
                  disabled={flowStatus === 'verifying' || !qrInput.trim()}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all',
                    'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
                    'disabled:opacity-50 disabled:cursor-not-allowed shadow-sm'
                  )}
                >
                  <ScanLine size={16} />
                  {flowStatus === 'verifying' ? 'Verifikasi...' : 'Cari'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------- Result & Action Area ----------------- */}
        <div className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden h-full">
          <div className="border-b border-gray-50 px-5 py-4">
            <h3 className="text-sm font-bold text-gray-900">📋 Hasil Verifikasi & Tindakan</h3>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            {!result ? (
              // Empty State
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-300 mb-4 border border-gray-100">
                  <ScanLine size={28} />
                </div>
                <p className="text-sm font-medium text-gray-500">Menunggu Hasil Scan</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">Data order dan kurir akan muncul di sini setelah QR berhasil dipindai.</p>
              </div>
            ) : flowStatus === 'completed' ? (
              // Completed State
              <div className="flex flex-1 flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6 ring-8 ring-emerald-50">
                  <CheckCircle size={40} className="text-emerald-500" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">Tugas Selesai!</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm">
                  Order <span className="font-bold text-gray-700">{result.orderId}</span> telah dikonfirmasi selesai.
                </p>

                <div className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 text-left mb-8 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-xs font-semibold text-gray-500">Penerima Dana</span>
                    <span className="text-sm font-bold text-gray-900">{result.courierName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-xs font-semibold text-gray-500">Total Cair</span>
                    <span className="text-lg font-extrabold text-emerald-600">
                      Rp {simulatedPayout.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-500">Status Pencairan</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 size={12} /> Berhasil ke Dompet
                    </span>
                  </div>
                </div>

                <button
                  onClick={resetFlow}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                >
                  <RefreshCw size={16} />
                  Scan Order Lainnya
                </button>
              </div>
            ) : (
              // Verification & Disbursing State
              <div className="flex flex-col h-full">
                {/* Match indicator */}
                <div className={cn('flex items-center gap-3 rounded-2xl p-4 mb-6 border', result.matched ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100')}>
                  {result.matched ? (
                    <CheckCircle2 size={36} className="text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle size={36} className="text-red-500 shrink-0" />
                  )}
                  <div>
                    <h4 className={cn('text-lg font-extrabold', result.matched ? 'text-emerald-700' : 'text-red-700')}>
                      {result.matched ? '✅ ORDER VALID' : '❌ TIDAK COCOK'}
                    </h4>
                    <p className={cn('text-xs font-medium', result.matched ? 'text-emerald-600' : 'text-red-500')}>
                      {result.matched ? 'Data cocok dengan database gudang' : 'QR code tidak ditemukan di sistem'}
                    </p>
                  </div>
                </div>

                {/* Details */}
                {result.matched && (
                  <div className="flex-1 space-y-6">
                    {/* Info Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
                      {[
                        ['Order ID', result.orderId],
                        ['Pengguna', result.userName],
                        ['Kurir (Penerima)', result.courierName],
                        ['Status Saat Ini', result.orderStatus],
                        ['Waktu Scan', new Date().toLocaleString('id-ID')],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">{label}</span>
                          <span className="font-semibold text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Waste items */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Item Sampah Diterima</h4>
                      <div className="space-y-2">
                        {result.wasteItems.map((item, i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 border border-gray-100 px-4 py-2.5">
                            <span className="text-sm font-medium text-gray-700">{item.type}</span>
                            <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded shadow-sm">
                              {item.weightKg} kg
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  {result.matched ? (
                    <button
                      onClick={handleDisbursement}
                      disabled={flowStatus === 'disbursing'}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white transition-all shadow-sm",
                        flowStatus === 'disbursing'
                          ? "bg-gray-400 cursor-wait"
                          : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                      )}
                    >
                      {flowStatus === 'disbursing' ? (
                        <>
                          <RefreshCw size={18} className="animate-spin" />
                          Memproses Pencairan...
                        </>
                      ) : (
                        <>
                          <Wallet size={18} />
                          Selesaikan & Cairkan Rp {simulatedPayout.toLocaleString('id-ID')}
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={resetFlow}
                      className="w-full rounded-xl bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      Coba Scan Lagi
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
