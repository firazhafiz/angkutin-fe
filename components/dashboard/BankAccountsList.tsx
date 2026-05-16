"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletService } from "@/services/wallet.service";
import {
  Plus,
  Trash2,
  CreditCard,
  Loader2,
  X,
  Pencil,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { toast } from "sonner";

export default function BankAccountsList() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    providerName: "",
    accountNumber: "",
    accountName: "",
    isDefault: false,
  });

  const { data: accountsData, isLoading } = useQuery({
    queryKey: ["walletAccounts"],
    queryFn: walletService.getAccounts,
  });

  const createMutation = useMutation({
    mutationFn: walletService.createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walletAccounts"] });
      resetForm();
      toast.success("Akun berhasil ditambahkan");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Gagal menambahkan akun";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: walletService.updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walletAccounts"] });
      resetForm();
      toast.success("Akun berhasil diperbarui");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Gagal memperbarui akun";
      toast.error(message);
    },
  });

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      providerName: "",
      accountNumber: "",
      accountName: "",
      isDefault: false,
    });
  };


  const deleteMutation = useMutation({
    mutationFn: walletService.deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walletAccounts"] });
      setDeleteConfirmId(null);
      toast.success("Akun berhasil dihapus");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Gagal menghapus akun";
      toast.error(message);
      setDeleteConfirmId(null);
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: walletService.setDefaultAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walletAccounts"] });
      toast.success("Akun utama berhasil diubah");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Fitur ini sedang dalam pengembangan";
      toast.error(message);
    },
  });

  const accounts = accountsData?.data || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-md font-bold text-dark ">Akun Terhubung</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F1F5F9] text-[#0F172A] hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* List */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <CreditCard
              size={40}
              className="text-gray-300 mx-auto mb-4 opacity-50"
            />
            <p className="text-xs text-gray-400 font-regular uppercase tracking-widest">
              Belum ada akun
            </p>
          </div>
        ) : (
          accounts.map((account, idx) => (
            <div
              key={account.id}
              className="bg-white transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-5">
                {/* Icon */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-md flex items-center justify-center transition-transform group-hover:scale-105",
                    idx % 2 === 0
                      ? "bg-blue-50 text-blue-600"
                      : "bg-orange-50 text-orange-600",
                  )}
                >
                  <CreditCard size={24} />
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-black text-[#1E293B]">
                      {account.providerName}
                    </p>
                    {account.isDefault && (
                      <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-[#F1F5F9] text-[#64748B]">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-[#94A3B8] tracking-widest uppercase">
                    **** {account.accountNumber.slice(-4)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {!account.isDefault && (
                  <button
                    disabled={setDefaultMutation.isPending}
                    onClick={() => setDefaultMutation.mutate(account.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-50"
                  >
                    {setDefaultMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditingId(account.id);
                    setFormData({
                      providerName: account.providerName,
                      accountNumber: account.accountNumber,
                      accountName: account.accountName,
                      isDefault: account.isDefault,
                    });
                    setIsAdding(true);
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Pencil size={16} />
                </button>
                <button
                  disabled={deleteMutation.isPending}
                  onClick={() => setDeleteConfirmId(account.id)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal / Form Overlay for Adding Account */}
      {isAdding && (
        <div className="fixed inset-0 z-100 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-dark">
                {editingId ? "Edit Akun" : "Tambah Akun"}
              </h3>
              <button
                onClick={resetForm}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1">
                  Provider Bank / Wallet
                </label>
                <input
                  type="text"
                  placeholder="Contoh: BCA, Mandiri, GoPay"
                  className="w-full px-5 py-4 rounded-md text-dark bg-gray-100 text-sm font-regular focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.providerName}
                  onChange={(e) =>
                    setFormData({ ...formData, providerName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1">
                  Nomor Rekening / HP
                </label>
                <input
                  type="text"
                  placeholder="0012345678"
                  className="w-full px-5 py-4 rounded-md text-dark bg-gray-100 text-sm font-regular focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, accountNumber: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1">
                  Atas Nama
                </label>
                <input
                  type="text"
                  placeholder="Nama sesuai rekening"
                  className="w-full px-5 py-4 rounded-md text-dark bg-gray-100 text-sm font-regular focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.accountName}
                  onChange={(e) =>
                    setFormData({ ...formData, accountName: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center gap-3 py-2">
                <div
                  onClick={() =>
                    setFormData({ ...formData, isDefault: !formData.isDefault })
                  }
                  className={cn(
                    "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200",
                    formData.isDefault ? "bg-primary" : "bg-gray-200",
                  )}
                >
                  <div
                    className={cn(
                      "bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200",
                      formData.isDefault ? "translate-x-6" : "translate-x-0",
                    )}
                  />
                </div>
                <label className="text-xs font-bold text-gray-500 cursor-pointer select-none">
                  Jadikan Akun Utama
                </label>
              </div>

              <div className="pt-4 flex gap-4">
                <Button
                  className="w-full py-7 rounded-full font-black text-sm uppercase tracking-widest"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  onClick={() => {
                    if (editingId) {
                      updateMutation.mutate({ id: editingId, data: formData });
                    } else {
                      createMutation.mutate(formData);
                    }
                  }}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : editingId ? (
                    "Simpan Perubahan"
                  ) : (
                    "Simpan Akun"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-110 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={40} className="text-red-500" />
            </div>
            <h3 className="text-xl font-black text-dark mb-2">Hapus Akun?</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Tindakan ini tidak dapat dibatalkan. Akun ini akan dihapus
              permanen dari daftar penarikan Anda.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-4 rounded-full border border-gray-300 text-xs font-bold uppercase tracking-widest text-dark hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deleteConfirmId)}
                className="py-4 bg-red-500 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {deleteMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
