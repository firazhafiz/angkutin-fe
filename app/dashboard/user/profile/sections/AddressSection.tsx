"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  ArrowLeft,
  Plus,
  Home,
  Building2,
  MapPin,
  Edit2,
  Trash2,
  X,
  Check,
  Star,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  userService,
  UserAddress,
  UserAddressInput,
} from "@/services/user.service";
import { toast } from "sonner";

const emptyAddress: UserAddressInput = {
  label: "",
  district: "",
  village: "",
  addressDetail: "",
  isPrimary: false,
};

// Helper function to pick an icon based on label
const getIconForLabel = (label: string) => {
  const lower = label.toLowerCase();
  if (lower.includes("home") || lower.includes("rumah")) return Home;
  if (
    lower.includes("office") ||
    lower.includes("kantor") ||
    lower.includes("work")
  )
    return Building2;
  return MapPin;
};

// Helper function to pick color based on label
const getColorForLabel = (label: string) => {
  const lower = label.toLowerCase();
  if (lower.includes("home") || lower.includes("rumah"))
    return "bg-blue-50 text-blue-600";
  if (
    lower.includes("office") ||
    lower.includes("kantor") ||
    lower.includes("work")
  )
    return "bg-purple-50 text-purple-600";
  return "bg-orange-50 text-orange-600";
};

export default function AddressSection({ onBack }: { onBack: () => void }) {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null,
  );
  const [form, setForm] = useState<UserAddressInput>(emptyAddress);

  // Fetch API Wilayah Indonesia (Kecamatan di Surabaya - Code: 3578)
  const { data: districts = [], isLoading: isLoadingDistricts } = useQuery({
    queryKey: ["surabayaDistricts"],
    queryFn: async () => {
      const res = await fetch(
        "https://www.emsifa.com/api-wilayah-indonesia/api/districts/3578.json",
      );
      if (!res.ok) throw new Error("Gagal mengambil data kecamatan");
      return res.json();
    },
  });

  const { data: addressesData, isLoading } = useQuery({
    queryKey: ["userAddresses"],
    queryFn: userService.getAddresses,
  });

  const addresses: UserAddress[] = addressesData?.data || [];
  const sortedAddresses = [...addresses].sort(
    (a, b) => Number(b.isPrimary) - Number(a.isPrimary),
  );

  const addMutation = useMutation({
    mutationFn: (data: UserAddressInput) => userService.addAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      toast.success("Address added successfully");
      setModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add address");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserAddressInput }) =>
      userService.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      toast.success("Address updated successfully");
      setModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update address");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      toast.success("Address deleted successfully");
      setDeleteConfirm(null);
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || "Failed to delete address";
      if (errorMsg.includes("orders_address_id_fkey")) {
        toast.error("Alamat tidak dapat dihapus karena masih digunakan pada riwayat pesanan.");
      } else {
        toast.error(errorMsg);
      }
    },
  });

  const openAdd = () => {
    setEditingAddress(null);
    setForm(emptyAddress);
    setModalOpen(true);
  };

  const openEdit = (addr: UserAddress) => {
    setEditingAddress(addr);
    const { id, userId, ...rest } = addr;
    setForm(rest);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.label || !form.district || !form.village || !form.addressDetail) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingAddress) {
      updateMutation.mutate({ id: editingAddress.id, data: form });
    } else {
      addMutation.mutate(form);
    }
  };

  const setPrimary = (addr: UserAddress) => {
    const { id, userId, ...rest } = addr;
    updateMutation.mutate({ id: addr.id, data: { ...rest, isPrimary: true } });
  };

  const isSaving = addMutation.isPending || updateMutation.isPending;

  return (
    <DashboardLayout role="user">
      <div className="max-w-6xl mx-auto space-y-6 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-700 hover:text-primary hover:border-primary transition-all cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-dark">My Addresses</h2>
              <p className="text-[10px] font-black text-dark/40 uppercase tracking-widest">
                {isLoading
                  ? "Loading..."
                  : `${addresses.length} saved addresses`}
              </p>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-dark text-white px-5 py-3 rounded-md text-xs font-black uppercase tracking-widest hover:bg-primary transition-all cursor-pointer"
          >
            <Plus size={16} /> Add New
          </button>
        </div>

        {/* Address List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedAddresses.map((addr) => {
              const Icon = getIconForLabel(addr.label);
              return (
                <div
                  key={addr.id}
                  className={cn(
                    "rounded-2xl border transition-all overflow-hidden",
                    addr.isPrimary
                      ? "border-primary/20 "
                      : "border-gray-100 bg-white",
                  )}
                >
                  {/* Card Body */}
                  <div
                    className={cn(
                      "p-6",
                      addr.isPrimary ? "bg-primary/10" : "bg-white",
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                          addr.isPrimary
                            ? "bg-primary text-white shadow-md shadow-primary/30"
                            : getColorForLabel(addr.label),
                        )}
                      >
                        <Icon size={22} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-black text-dark text-sm">
                            {addr.label}
                          </span>
                          {addr.isPrimary && (
                            <span className="text-[9px] font-black uppercase tracking-widest bg-primary text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                              <Star size={8} /> Primary
                            </span>
                          )}
                        </div>
                        <p
                          className={cn(
                            "text-xs mt-1 leading-relaxed",
                            addr.isPrimary ? "text-dark/70" : "text-gray-500",
                          )}
                        >
                          {addr.addressDetail}
                        </p>
                        <p
                          className={cn(
                            "text-[11px] font-bold mt-1",
                            addr.isPrimary
                              ? "text-primary/60"
                              : "text-gray-400",
                          )}
                        >
                          {[
                            addr.village,
                            addr.district,
                            "Surabaya",
                            "Jawa Timur",
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 border-t",
                      addr.isPrimary
                        ? "border-primary/10 bg-primary/5"
                        : "border-gray-50 bg-white",
                    )}
                  >
                    <button
                      onClick={() => openEdit(addr)}
                      className={cn(
                        "flex items-center justify-center gap-2 flex-1 py-2.5 rounded-full border text-xs font-black uppercase tracking-widest transition-all cursor-pointer",
                        addr.isPrimary
                          ? "border-primary/30 text-primary hover:bg-primary hover:text-white"
                          : "border-gray-300 text-dark hover:bg-gray-50",
                      )}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(addr.id)}
                      className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-full border border-red-300 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all cursor-pointer"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && addresses.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <MapPin size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="font-regular text-gray-600 text-sm">
              No addresses saved yet
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 pb-20 sm:pb-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSaving) setModalOpen(false);
          }}
        >
          <div
            className="bg-white w-full max-w-lg rounded-3xl flex flex-col overflow-hidden shadow-2xl"
            style={{ maxHeight: "min(85dvh, calc(100dvh - 6rem))" }}
          >
            {/* ── Fixed Header ── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="font-black text-dark text-base">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  Surabaya, Jawa Timur
                </p>
              </div>
              <button
                onClick={() => !isSaving && setModalOpen(false)}
                disabled={isSaving}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {/* ── Scrollable Body ── */}
            <div
              className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#e5e7eb transparent",
              }}
            >
              {/* Label */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                  Label
                </label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="e.g. Home, Office, Apartment"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-dark focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>

              {/* District & Village */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                    Kecamatan
                  </label>
                  <div className="relative">
                    <select
                      value={form.district}
                      onChange={(e) =>
                        setForm({ ...form, district: e.target.value })
                      }
                      disabled={isLoadingDistricts}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-dark focus:outline-none focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="" disabled>
                        {isLoadingDistricts ? "Loading..." : "Pilih Kecamatan"}
                      </option>
                      {districts.map((d: any) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                    Kelurahan / Desa
                  </label>
                  <input
                    type="text"
                    value={form.village}
                    onChange={(e) =>
                      setForm({ ...form, village: e.target.value })
                    }
                    placeholder="Kelurahan"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-dark focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Address Detail */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                  Complete Address Detail
                </label>
                <textarea
                  rows={3}
                  value={form.addressDetail}
                  onChange={(e) =>
                    setForm({ ...form, addressDetail: e.target.value })
                  }
                  placeholder="Street name, building, house number, RT/RW..."
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-dark focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Primary Toggle */}
              <div
                onClick={() => setForm({ ...form, isPrimary: !form.isPrimary })}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:border-primary/30 transition-all"
              >
                <div
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative shrink-0",
                    form.isPrimary ? "bg-primary" : "bg-gray-300",
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all",
                      form.isPrimary ? "left-7" : "left-1",
                    )}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-dark">
                    Set as primary address
                  </p>
                  <p className="text-xs text-gray-400">
                    This will be your default address for pickups
                  </p>
                </div>
              </div>
            </div>

            {/* ── Fixed Footer ── */}
            <div className="px-6 py-5 border-t border-gray-100 shrink-0 bg-white rounded-b-3xl">
              <div className="flex gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  disabled={isSaving}
                  className="flex-1 py-4 rounded-full border border-gray-300 text-dark text-sm font-bold tracking-widest hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 py-4 bg-dark text-white rounded-full text-sm font-bold tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Check size={18} />
                  )}
                  {editingAddress ? "Save Changes" : "Add Address"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="font-black text-dark text-lg mb-2">
              Delete Address?
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              This address will be permanently removed from your account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleteMutation.isPending}
                className="flex-1 py-3 rounded-xl border border-gray-100 text-dark text-sm font-black hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirm)}
                disabled={deleteMutation.isPending}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-black hover:bg-red-600 transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
