"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { walletService } from "@/services/wallet.service";
import {
  Wallet,
  ArrowUpRight,
  Plus,
  ArrowDownLeft,
  History,
  Search,
  Filter,
  CreditCard,
  Gift,
  TrendingUp,
  Calendar,
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/cn";
interface ConnectedAccount {
  id: string;
  type: "bank" | "ewallet";
  provider: string;
  accountName: string;
  accountNumber: string;
  color: string;
  isPrimary?: boolean;
}

const PROVIDERS = {
  bank: [
    {
      name: "Bank Central Asia",
      code: "BCA",
      color: "bg-blue-50 text-blue-600",
    },
    {
      name: "Bank Mandiri",
      code: "MANDIRI",
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      name: "Bank Rakyat Indonesia",
      code: "BRI",
      color: "bg-blue-100 text-blue-700",
    },
    {
      name: "Bank Negara Indonesia",
      code: "BNI",
      color: "bg-orange-50 text-orange-600",
    },
  ],
  ewallet: [
    { name: "DANA", code: "DANA", color: "bg-blue-500 text-white" },
    { name: "ShopeePay", code: "SHOPEEPAY", color: "bg-orange-500 text-white" },
    { name: "GoPay", code: "GOPAY", color: "bg-cyan-500 text-white" },
    { name: "OVO", code: "OVO", color: "bg-purple-600 text-white" },
  ],
};

export default function CourierWalletPage() {
  const { data: walletData, isLoading: isWalletLoading } = useQuery({
    queryKey: ["walletBalance"],
    queryFn: walletService.getBalance,
  });

  const walletBalance = walletData?.data?.balance || 0;

  const [activeTab, setActiveTab] = useState("Semua");
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([
    {
      id: "1",
      type: "bank",
      provider: "Bank Central Asia",
      accountName: "Hafiz",
      accountNumber: "882100921",
      color: "bg-blue-50 text-blue-600",
      isPrimary: true,
    },
    {
      id: "2",
      type: "ewallet",
      provider: "GoPay",
      accountName: "Hafiz",
      accountNumber: "081234567890",
      color: "bg-cyan-50 text-cyan-600",
      isPrimary: false,
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ConnectedAccount | null>(
    null,
  );
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [primaryConfirm, setPrimaryConfirm] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<ConnectedAccount, "id">>({
    type: "bank",
    provider: "Bank Central Asia",
    accountName: "",
    accountNumber: "",
    color: "bg-blue-50 text-blue-600",
  });

  const handleOpenAdd = () => {
    setEditingAccount(null);
    setForm({
      type: "bank",
      provider: "Bank Central Asia",
      accountName: "",
      accountNumber: "",
      color: "bg-blue-50 text-blue-600",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (acc: ConnectedAccount) => {
    setEditingAccount(acc);
    setForm({ ...acc });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingAccount) {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === editingAccount.id ? { ...form, id: a.id } : a,
        ),
      );
    } else {
      setAccounts((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirm(null);
  };

  const handleSetPrimary = (id: string) => {
    setPrimaryConfirm(id);
  };

  const confirmSetPrimary = () => {
    if (primaryConfirm) {
      setAccounts((prev) =>
        prev.map((a) => ({ ...a, isPrimary: a.id === primaryConfirm })),
      );
      setPrimaryConfirm(null);
    }
  };

  const transactions = [
    {
      id: "TX-9921",
      type: "Income",
      title: "Komisi Penjemputan Sampah",
      category: "Angkutin",
      date: "24 April 2024",
      amount: "+ Rp 25.000",
      points: "+ 125 pts",
      status: "Berhasil",
    },
    {
      id: "TX-9920",
      type: "Expense",
      title: "Tarik Saldo Komisi",
      category: "Bank Transfer",
      date: "21 April 2024",
      amount: "- Rp 150.000",
      points: null,
      status: "Berhasil",
    },
    {
      id: "TX-9919",
      type: "Income",
      title: "Bonus Performa Tepat Waktu",
      category: "Reward",
      date: "18 April 2024",
      amount: "+ Rp 50.000",
      points: "+ 50 pts",
      status: "Berhasil",
    },
    {
      id: "TX-9918",
      type: "Expense",
      title: "Tarik Saldo Komisi",
      category: "E-Wallet",
      date: "15 April 2024",
      amount: "- Rp 100.000",
      points: null,
      status: "Berhasil",
    },
  ];

  return (
    <DashboardLayout role="courier">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 pb-10">
        <div className="order-1 lg:col-span-4 lg:col-start-9 lg:row-start-1 space-y-6">
          <div className="bg-dark p-8 rounded-2xl text-white relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 opacity-10 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
              <Wallet size={160} />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-1.5">
                    Saldo Komisi
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-white/40">Rp</span>
                    {isWalletLoading ? (
                      <div className="h-10 w-32 bg-white/10 animate-pulse rounded-lg mt-1" />
                    ) : (
                      <h2 className="md:text-4xl text-4xl font-black tracking-tighter">
                        {walletBalance.toLocaleString("id-ID")}
                      </h2>
                    )}
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl  py-1.5 px-2 rounded-md text-xs font-black flex flex-col items-center gap-0.5 border border-white/10 shadow-lg">
                  <span className="text-primary text-sm tracking-tight">
                    +4.2k
                  </span>
                  <span className="text-white/20 tracking-[0.2em] text-[7px]">
                    POINTS
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button className="py-4 bg-primary-light rounded-full text-xs text-dark font-black uppercase tracking-widest transition-all border border-white/5 cursor-pointer">
                  Tarik Saldo
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="order-2 lg:col-span-8 lg:col-start-1 lg:row-start-1">
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Total Komisi",
                value: "2.400.000",
                icon: TrendingUp,
                color: "bg-green-50 text-green-600",
              },
              {
                label: "Total Ditarik",
                value: "1.850.000",
                icon: ArrowDownLeft,
                color: "bg-red-50 text-red-600",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-6 md:p-8 rounded-2xl border border-primary flex flex-col justify-between h-36 md:h-44 transition-all group relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 relative z-10",
                    stat.color,
                  )}
                >
                  <stat.icon size={20} />
                </div>
                <div className="relative z-10">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold text-gray-500">Rp</span>
                    <p className="text-2xl md:text-3xl font-black text-dark tracking-tighter">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-3 lg:col-span-4 lg:col-start-9 lg:row-start-2">
          <div className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm">
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="text-sm font-black text-dark uppercase tracking-widest">
                Akun Terhubung
              </h3>
              <button
                onClick={handleOpenAdd}
                className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="flex items-center gap-4 p-3 rounded-2xl border border-gray-50 hover:border-gray-100 transition-all group relative"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-[10px]",
                      acc.color,
                    )}
                  >
                    {acc.type === "bank" ? (
                      <CreditCard size={18} />
                    ) : (
                      <Wallet size={18} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-dark truncate">
                        {acc.provider}
                      </p>
                      {acc.isPrimary && (
                        <span className="text-[8px] font-black uppercase tracking-widest bg-primary/10 text-primary px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">
                      **** {acc.accountNumber.slice(-4)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {!acc.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(acc.id)}
                        className="w-7 h-7 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                        title="Set as Primary"
                      >
                        <Check size={12} />
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenEdit(acc)}
                      className="w-7 h-7 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(acc.id)}
                      className="w-7 h-7 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}

              {accounts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-xs text-gray-400 italic">
                    Belum ada akun terhubung
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="order-4 lg:col-span-8 lg:col-start-1 lg:row-start-2 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-black text-dark text-lg flex items-center gap-2">
                <History size={20} className="text-primary" />
                Riwayat Transaksi
              </h3>
            </div>

            <div className="space-y-3">
              {transactions.map((tx, index) => (
                <div
                  key={index}
                  className="group bg-white p-5 rounded-xl border border-gray-50 hover:border-primary/20 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
                        tx.type === "Income"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600",
                      )}
                    >
                      {tx.type === "Income" ? (
                        <Plus size={20} />
                      ) : (
                        <ArrowUpRight size={20} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-dark text-sm leading-none mb-1.5">
                        {tx.title}
                      </h4>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        {tx.category}{" "}
                        <span className="w-1 h-1 rounded-full bg-gray-200" />{" "}
                        {tx.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "font-black text-sm tracking-tight mb-1",
                        tx.type === "Income"
                          ? "text-green-600"
                          : "text-red-600",
                      )}
                    >
                      {tx.amount}
                    </p>
                    <span
                      className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                        tx.status === "Berhasil"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-orange-50 text-orange-600 border-orange-100",
                      )}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-6 rounded-full border border-dashed  text-primary text-sm font-bold border-primary cursor-pointer">
              Lihat Semua Transaksi
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h3 className="font-black text-dark text-lg">
                  {editingAccount ? "Edit Akun" : "Tambah Akun"}
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Hubungkan rekening atau e-wallet
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-dark transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-600 tracking-wide block mb-3">
                  Tipe Akun
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "bank", label: "Bank", icon: CreditCard },
                    { id: "ewallet", label: "E-Wallet", icon: Wallet },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        const firstProvider =
                          PROVIDERS[t.id as keyof typeof PROVIDERS][0];
                        setForm({
                          ...form,
                          type: t.id as any,
                          provider: firstProvider.name,
                          color: firstProvider.color,
                        });
                      }}
                      className={cn(
                        "flex items-center justify-center gap-2 py-3 rounded-md border text-xs font-black uppercase tracking-widest transition-all cursor-pointer",
                        form.type === t.id
                          ? "bg-primary/5 border-primary text-primary shadow-sm"
                          : "border-gray-300 text-gray-400 ",
                      )}
                    >
                      <t.icon size={16} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Provider Selection */}
              <div>
                <label className="text-xs font-bold text-gray-600 tracking-wide block mb-3">
                  Pilih {form.type === "bank" ? "Bank" : "E-Wallet"}
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                  {PROVIDERS[form.type].map((p) => (
                    <button
                      key={p.code}
                      onClick={() =>
                        setForm({ ...form, provider: p.name, color: p.color })
                      }
                      className={cn(
                        "p-3 rounded-md border text-xs font-bold transition-all text-left flex items-center gap-3 cursor-pointer",
                        form.provider === p.name
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-300 text-gray-500 ",
                      )}
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-[8px]",
                          p.color,
                        )}
                      >
                        {p.code.slice(0, 2)}
                      </div>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 tracking-wide block mb-2">
                    Nama Pemilik
                  </label>
                  <input
                    type="text"
                    value={form.accountName}
                    onChange={(e) =>
                      setForm({ ...form, accountName: e.target.value })
                    }
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-5 py-4 rounded-md bg-gray-50 border border-gray-100 text-sm font-bold text-dark focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 tracking-wide block mb-2">
                    {form.type === "bank" ? "Nomor Rekening" : "Nomor HP / ID"}
                  </label>
                  <input
                    type="text"
                    value={form.accountNumber}
                    onChange={(e) =>
                      setForm({ ...form, accountNumber: e.target.value })
                    }
                    placeholder={
                      form.type === "bank" ? "0092318..." : "0812..."
                    }
                    className="w-full px-5 py-4 rounded-md bg-gray-50 border border-gray-100 text-sm font-bold text-dark focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50/50 border-t border-gray-50 flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-4 text-xs font-bold border border-primary rounded-full uppercase tracking-widest text-primary transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={!form.accountName || !form.accountNumber}
                className="flex-1 py-4 bg-dark text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {editingAccount ? "Simpan" : "Tambah Akun"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Confirm Modal */}
      {primaryConfirm && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Check size={32} />
            </div>
            <h3 className="font-black text-dark text-xl mb-2">
              Jadikan Utama?
            </h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Akun ini akan menjadi tujuan default untuk semua penarikan saldo
              Anda di masa mendatang.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPrimaryConfirm(null)}
                className="flex-1 py-4 rounded-full border border-gray-300 text-xs font-black uppercase tracking-wide text-dark hover:bg-gray-50 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmSetPrimary}
                className="flex-1 py-4 bg-primary text-white rounded-full text-xs font-black uppercase tracking-wide hover:bg-primary-dark transition-all cursor-pointer"
              >
                Yakin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <Trash2 size={32} />
            </div>
            <h3 className="font-black text-dark text-xl mb-2">Hapus Akun?</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Akun ini tidak akan bisa digunakan untuk penarikan saldo sampai
              Anda menghubungkannya kembali.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-4 rounded-xl border border-gray-100 text-xs font-black uppercase tracking-widest text-dark hover:bg-gray-50 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-4 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-200 cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
