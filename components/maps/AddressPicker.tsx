"use client";
import React, { useState } from "react";
import {
  MapPin,
  ChevronRight,
  Home,
  Building2,
  CheckCircle2,
  X,
} from "lucide-react";
import { UserAddress } from "@/services/user.service";
import { cn } from "@/lib/cn";

interface AddressPickerProps {
  selected?: UserAddress;
  onSelect: (address: UserAddress) => void;
  addresses: UserAddress[];
}

const getIconForLabel = (label: string) => {
  const lower = label.toLowerCase();
  if (lower.includes("home") || lower.includes("rumah")) return Home;
  return Building2;
};

export default function AddressPicker({
  selected,
  onSelect,
  addresses,
}: AddressPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeAddress =
    selected || addresses.find((a) => a.isPrimary) || addresses[0];

  return (
    <>
      {/* Selected Address Card */}
      <div
        onClick={() => setIsOpen(true)}
        className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm cursor-pointer hover:border-primary/40 transition-all flex items-center justify-between group"
      >
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-105">
            <MapPin size={20} />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-black text-dark truncate">
                {activeAddress
                  ? activeAddress.label
                  : "Pilih Lokasi Penjemputan"}
              </span>
              {activeAddress?.isPrimary && (
                <span className="text-[8px] font-black uppercase tracking-widest bg-primary text-white px-1.5 py-0.5 rounded shadow-sm shrink-0">
                  Utama
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-gray-500 truncate">
              {activeAddress
                ? activeAddress.addressDetail
                : "Ketuk untuk memilih"}
            </p>
            {activeAddress && (
              <p className="text-[10px] text-gray-400 mt-0.5 font-bold truncate">
                {[activeAddress.village, activeAddress.district, "Surabaya"]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors shrink-0 ml-2">
          <ChevronRight size={14} />
        </div>
      </div>

      {/* Selection Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 pb-20 sm:pb-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            style={{ maxHeight: "80vh" }}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-black text-dark text-base">
                  Pilih Lokasi Penjemputan
                </h3>
                <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                  {addresses.length} alamat tersimpan
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Address List */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-2.5"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#e5e7eb transparent",
              }}
            >
              {addresses.map((addr) => {
                const isSelected = activeAddress?.id === addr.id;
                const Icon = getIconForLabel(addr.label);
                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      onSelect(addr);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-100 bg-white hover:border-primary/30",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-gray-50 text-gray-400",
                      )}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-black text-dark truncate">
                          {addr.label}
                        </p>
                        {addr.isPrimary && (
                          <span className="text-[8px] font-black uppercase tracking-widest bg-primary text-white px-1.5 py-0.5 rounded shrink-0">
                            Utama
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                        {addr.addressDetail}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 font-bold">
                        {[addr.village, addr.district, "Surabaya"]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="shrink-0 mt-2">
                        <CheckCircle2
                          size={20}
                          className="text-primary fill-primary/20"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer info */}
            <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50 shrink-0">
              <p className="text-[10px] text-gray-400 text-center font-medium">
                Kelola alamat Anda di menu{" "}
                <span className="font-bold text-primary">Profil → Alamat</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
