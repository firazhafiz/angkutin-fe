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
} from "lucide-react";
import { cn } from "@/lib/cn";

interface Address {
  id: string;
  label: string;
  type: "home" | "office" | "other";
  recipient: string;
  phone: string;
  street: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  isPrimary: boolean;
  notes: string;
}

const defaultAddresses: Address[] = [
  {
    id: "1",
    label: "Home",
    type: "home",
    recipient: "Budi Santoso",
    phone: "+62 812 3456 7890",
    street: "Jl. Merdeka No. 10, Kel. Babakan Ciamis",
    district: "Kec. Sumur Bandung",
    city: "Kota Bandung",
    province: "Jawa Barat",
    postalCode: "40117",
    isPrimary: true,
    notes: "Ring the bell twice",
  },
  {
    id: "2",
    label: "Office",
    type: "office",
    recipient: "Budi Santoso",
    phone: "+62 812 3456 7890",
    street: "Jl. Sudirman No. 45, Lt. 3",
    district: "Kec. Lengkong",
    city: "Kota Bandung",
    province: "Jawa Barat",
    postalCode: "40265",
    isPrimary: false,
    notes: "Ask security for visitor pass",
  },
];

const emptyAddress: Omit<Address, "id"> = {
  label: "",
  type: "home",
  recipient: "",
  phone: "",
  street: "",
  district: "",
  city: "",
  province: "",
  postalCode: "",
  isPrimary: false,
  notes: "",
};

const typeIcon = { home: Home, office: Building2, other: MapPin };
const typeColor = {
  home: "bg-blue-50 text-blue-600",
  office: "bg-purple-50 text-purple-600",
  other: "bg-orange-50 text-orange-600",
};

export default function AddressSection({ onBack }: { onBack: () => void }) {
  const [addresses, setAddresses] = useState<Address[]>(defaultAddresses);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [form, setForm] = useState<Omit<Address, "id">>(emptyAddress);

  const openAdd = () => {
    setEditingAddress(null);
    setForm(emptyAddress);
    setModalOpen(true);
  };

  const openEdit = (addr: Address) => {
    setEditingAddress(addr);
    const { id, ...rest } = addr;
    setForm(rest);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingAddress) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingAddress.id ? { ...form, id: editingAddress.id } : a,
        ),
      );
    } else {
      setAddresses((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirm(null);
  };

  const setPrimary = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isPrimary: a.id === id })));
  };

  return (
    <DashboardLayout role="user">
      <div className="max-w-6xl mx-auto space-y-6 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-700 hover:text-primary hover:border-primary transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-dark">My Addresses</h2>
              <p className="text-[10px] font-black text-dark/40 uppercase tracking-widest">
                {addresses.length} saved addresses
              </p>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-dark text-white px-5 py-3 rounded-md text-xs font-black uppercase tracking-widest hover:bg-primary transition-all"
          >
            <Plus size={16} /> Add New
          </button>
        </div>

        {/* Address List */}
        <div className="space-y-4">
          {addresses.map((addr) => {
            const Icon = typeIcon[addr.type];
            return (
              <div
                key={addr.id}
                className={cn(
                  "bg-white rounded-2xl border p-6 transition-all",
                  addr.isPrimary
                    ? "border-primary/30 shadow-md"
                    : "border-gray-100",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                        typeColor[addr.type],
                      )}
                    >
                      <Icon size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-black text-dark text-sm">
                          {addr.label || addr.type}
                        </span>
                        {addr.isPrimary && (
                          <span className="text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star size={8} /> Primary
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-dark">
                        {addr.recipient} · {addr.phone}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {addr.street}, {addr.district}, {addr.city},{" "}
                        {addr.province} {addr.postalCode}
                      </p>
                      {addr.notes && (
                        <p className="text-[10px] text-gray-400 mt-1 italic">
                          Note: {addr.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-50">
                  {!addr.isPrimary && (
                    <button
                      onClick={() => setPrimary(addr.id)}
                      className="flex-1 py-2.5 rounded-full border border-primary text-primary text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                    >
                      Set as Primary
                    </button>
                  )}
                  <button
                    onClick={() => openEdit(addr)}
                    className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-full border border-gray-300 text-dark text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  {!addr.isPrimary && (
                    <button
                      onClick={() => setDeleteConfirm(addr.id)}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-100 text-red-500 text-xs font-black hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {addresses.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <MapPin size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="font-black text-gray-300 text-sm">
              No addresses saved yet
            </p>
            <button
              onClick={openAdd}
              className="mt-4 px-6 py-3 bg-dark text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary transition-all"
            >
              Add Your First Address
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 pb-20 sm:pb-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
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
                  Fill in the address details below
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center shrink-0"
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
              {/* Type Selector */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                  Address Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["home", "office", "other"] as const).map((t) => {
                    const Icon = typeIcon[t];
                    return (
                      <button
                        key={t}
                        onClick={() => setForm({ ...form, type: t })}
                        className={cn(
                          "py-4 rounded-xl border text-xs font-black uppercase tracking-widest flex flex-col items-center gap-2 transition-all",
                          form.type === t
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-gray-100 text-gray-400 hover:border-gray-200",
                        )}
                      >
                        <Icon size={18} />
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Label */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                  Label
                </label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="e.g. Mom's House"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-dark focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>

              {/* Recipient & Phone */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    key: "recipient",
                    label: "Recipient Name",
                    placeholder: "Full name",
                  },
                  {
                    key: "phone",
                    label: "Phone Number",
                    placeholder: "+62 xxx",
                  },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                      {f.label}
                    </label>
                    <input
                      type="text"
                      value={form[f.key as keyof typeof form] as string}
                      onChange={(e) =>
                        setForm({ ...form, [f.key]: e.target.value })
                      }
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-dark focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* Street */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                  Street Address
                </label>
                <textarea
                  rows={2}
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  placeholder="Street name, number, building..."
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-dark focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                />
              </div>

              {/* District, City, Province, Postal */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    key: "district",
                    label: "District",
                    placeholder: "Kecamatan",
                  },
                  {
                    key: "city",
                    label: "City",
                    placeholder: "Kota / Kabupaten",
                  },
                  {
                    key: "province",
                    label: "Province",
                    placeholder: "Provinsi",
                  },
                  {
                    key: "postalCode",
                    label: "Postal Code",
                    placeholder: "00000",
                  },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                      {f.label}
                    </label>
                    <input
                      type="text"
                      value={form[f.key as keyof typeof form] as string}
                      onChange={(e) =>
                        setForm({ ...form, [f.key]: e.target.value })
                      }
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-dark focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                  Notes for Courier (Optional)
                </label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. Ring the bell, gate code 1234..."
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-dark focus:outline-none focus:border-primary focus:bg-white transition-all"
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
                    This will be your default pickup address
                  </p>
                </div>
              </div>
            </div>

            {/* ── Fixed Footer ── */}
            <div className="px-6 py-5 border-t border-gray-100 shrink-0 bg-white rounded-b-3xl">
              <div className="flex gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-4 rounded-full border border-gray-300 text-dark text-sm font-bold tracking-widest hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-4 bg-dark text-white rounded-full text-sm font-bold tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2"
                >
                  <Check size={18} />{" "}
                  {editingAddress ? "Save Changes" : "Add Address"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
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
                className="flex-1 py-3 rounded-xl border border-gray-100 text-dark text-sm font-black hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-black hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
