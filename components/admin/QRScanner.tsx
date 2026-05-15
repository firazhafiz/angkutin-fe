'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  isScanning?: boolean;
}

export function QRScanner({ onScanSuccess, isScanning = true }: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isComponentMounted = useRef(true);

  // Keep callback up to date without re-triggering effects
  const onScanSuccessRef = useRef(onScanSuccess);
  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
  }, [onScanSuccess]);

  useEffect(() => {
    isComponentMounted.current = true;
    
    // Create instance if it doesn't exist
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode('qr-reader');
    }

    const startScanner = async () => {
      if (!scannerRef.current) return;
      try {
        await scannerRef.current.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            // Stop scanning immediately on success to prevent duplicates
            if (scannerRef.current && scannerRef.current.isScanning) {
              scannerRef.current.pause(true);
            }
            onScanSuccessRef.current(decodedText);
          },
          (errorMessage) => {
            // Ignore frequent frame errors
          }
        );
        if (isComponentMounted.current) {
          setHasPermission(true);
        }
      } catch (err) {
        if (!isComponentMounted.current) return;
        const errMsg = String(err);
        if (errMsg.includes('NotAllowedError') || errMsg.includes('Permission')) {
          setHasPermission(false);
          setScannerError('Izin kamera ditolak. Mohon izinkan akses kamera di browser Anda.');
        }
        console.error('Failed to start scanner', err);
      }
    };

    const stopScanner = async () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        try {
          await scannerRef.current.stop();
        } catch (err) {
          console.error('Failed to stop scanner', err);
        }
      }
    };

    if (isScanning) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      isComponentMounted.current = false;
      // Cleanup on unmount
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  if (hasPermission === false) {
    return (
      <div className="flex h-64 flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
        <div className="h-12 w-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-3">
          <AlertCircle size={24} />
        </div>
        <p className="text-sm font-semibold text-gray-900">Akses Kamera Ditolak</p>
        <p className="text-xs text-gray-500 mt-1 max-w-xs">{scannerError}</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-black w-full min-h-[300px]">
      {/* Scanner Container */}
      <div 
        id="qr-reader" 
        className={cn(
          "w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full border-none"
        )} 
      />
      
      {!isScanning && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <CameraOff size={40} className="text-white/50 mb-3" />
          <p className="text-sm font-medium text-white/80">Kamera Jeda</p>
        </div>
      )}
    </div>
  );
}
