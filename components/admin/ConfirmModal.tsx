"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Trash2, Ban, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "success" | "info";
  icon?: "delete" | "suspend" | "activate" | "info";
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  type = "danger",
  icon = "delete",
  isLoading = false,
}: ConfirmModalProps) {
  const getIcon = () => {
    switch (icon) {
      case "delete":
        return <Trash2 size={32} />;
      case "suspend":
        return <Ban size={32} />;
      case "activate":
        return <CheckCircle2 size={32} />;
      default:
        return <AlertCircle size={32} />;
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return "text-red-500";
      case "warning":
        return "text-amber-500";
      case "success":
        return "text-emerald-500";
      case "info":
        return "bg-blue-50 text-blue-500";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const getButtonStyles = () => {
    switch (type) {
      case "danger":
        return "bg-red-500 hover:bg-red-600";
      case "warning":
        return "bg-amber-500 hover:bg-amber-600";
      case "success":
        return "bg-emerald-500 hover:bg-emerald-600";
      case "info":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-gray-900 hover:bg-black";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Content */}
          <motion.div
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl transition-all"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="px-8 pb-10 pt-12 text-center flex flex-col items-center">
              {/* Icon Container */}
              <div
                className={cn(
                  "p-4 rounded-full flex items-center justify-center mb-6",
                  getTypeStyles(),
                )}
              >
                {getIcon()}
              </div>

              {/* Title & Message */}
              <h3 className="text-xl font-extrabold text-gray-900 mb-2 tracking-tight">
                {title}
              </h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10 px-2">
                {message}
              </p>

              {/* Action Buttons */}
              <div className="flex w-full gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full rounded-full py-6 font-bold border-gray-200 text-gray-500 hover:bg-gray-50 transition-all active:scale-[0.98]"
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={cn(
                    "w-full rounded-full py-6 font-bold text-white border-none transition-all active:scale-[0.98] flex items-center justify-center gap-2",
                    getButtonStyles(),
                  )}
                >
                  {isLoading && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
