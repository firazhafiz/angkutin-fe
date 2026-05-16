"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-9998 bg-dark/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-white rounded-2xl overflow-hidden pointer-events-auto shadow-xl"
            >
              {/* Header with Close */}
              <div className="flex justify-end p-4 pb-0">
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-dark transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="px-8 pb-10 text-center flex flex-col items-center">
                <div className="p-8 text-red-500 rounded-3xl flex items-center justify-center mb-6 bg-red-50">
                  <LogOut size={32} />
                </div>

                <h3 className="text-xl font-black text-dark mb-2 tracking-tight">
                  Konfirmasi Keluar
                </h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10 px-2 max-w-[280px]">
                  Apakah Anda yakin ingin keluar? Anda harus login kembali untuk
                  mengakses dashboard Anda.
                </p>

                <div className="flex w-full gap-3">
                  <Button
                    onClick={onConfirm}
                    className="w-full rounded-full py-7 font-bold bg-red-500 hover:bg-red-600 text-white border-none transition-all active:scale-[0.98]"
                  >
                    Keluar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="w-full rounded-full py-7 font-bold border-gray-300 text-gray-500 hover:bg-gray-50 transition-all"
                  >
                    Batal
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
