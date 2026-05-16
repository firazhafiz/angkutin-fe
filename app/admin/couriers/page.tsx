"use client";

import React, { useState } from "react";
import { Search, Eye, Plus, Trash2, Pencil, Truck } from "lucide-react";
import DataTable, { type Column } from "@/components/admin/DataTable";
import type { CourierProfile } from "@/types/models";
import { VehicleType } from "@/types/enums";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { cn } from "@/lib/cn";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";

// Extend CourierProfile locally for suspended state
interface ExtendedCourier extends CourierProfile {
  userId: string;
  isSuspended?: boolean;
}

export default function CouriersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  // Confirm Modal States
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    courier: ExtendedCourier | null;
  }>({
    isOpen: false,
    courier: null,
  });

  const { data: couriersResponse, isLoading } = useQuery({
    queryKey: ["couriers"],
    queryFn: () => {
      console.log("--- Fetching Couriers List ---");
      return adminService.getCouriers();
    },
  });

  // Mapping data from backend (flattening nested user object)
  const rawData = couriersResponse?.data || [];
  const couriers = rawData.map((c: any) => {
    const isActuallySuspended =
      (c.user?.status || c.status || "").toUpperCase() === "SUSPENDED" ||
      c.isSuspended === true;

    const mapped = {
      ...c,
      userId: c.user?.id || c.userId || c.id || "",
      name: c.name || c.user?.name || "Kurir",
      email: c.email || c.user?.email || "",
      phone: c.phone || c.user?.phone || "",
      totalDeliveries: c.totalDeliveries || c._count?.orders || 0,
      isSuspended: isActuallySuspended,
    };

    console.log(
      `[CouriersPage] Mapping ${mapped.name}: isSuspended=${mapped.isSuspended} (raw status=${c.user?.status || c.status}, raw isSuspended=${c.isSuspended})`,
    );
    return mapped;
  }) as ExtendedCourier[];

  const filteredCouriers = couriers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.vehiclePlate?.toLowerCase().includes(search.toLowerCase()),
  );

  const [viewId, setViewId] = useState<string | null>(null);
  const [selectedCourier, setSelectedCourier] =
    useState<ExtendedCourier | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Detail Query
  const { data: detailResponse, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["courier-detail", viewId],
    queryFn: () => adminService.getCourierDetail(viewId!),
    enabled: !!viewId,
  });

  const courierDetail = detailResponse?.data
    ? {
        ...(detailResponse.data as any),
        userId:
          (detailResponse.data as any).user?.id ||
          (detailResponse.data as any).userId ||
          (detailResponse.data as any).id ||
          "",
        name:
          (detailResponse.data as any).user?.name ||
          (detailResponse.data as any).name ||
          "Unknown",
        email:
          (detailResponse.data as any).user?.email ||
          (detailResponse.data as any).email ||
          "",
        phone:
          (detailResponse.data as any).user?.phone ||
          (detailResponse.data as any).phone ||
          "",
        isSuspended:
          (
            (detailResponse.data as any).user?.status ||
            (detailResponse.data as any).status ||
            ""
          ).toUpperCase() === "SUSPENDED" ||
          (detailResponse.data as any).isSuspended ||
          false,
      }
    : null;

  // Mutations
  const createMutation = useMutation({
    mutationFn: adminService.createCourier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["couriers"] });
      setIsFormModalOpen(false);
      toast.success("Kurir berhasil ditambahkan");
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Gagal menambahkan kurir";
      toast.error(msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminService.updateCourier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["couriers"] });
      setIsFormModalOpen(false);
      toast.success("Data kurir berhasil diperbarui");
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Gagal memperbarui kurir";
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteCourier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["couriers"] });
      setConfirmModal({ ...confirmModal, isOpen: false });
      setIsDetailModalOpen(false);
      toast.success("Kurir berhasil dihapus");
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.message || error.response?.data?.error || "";

      // Detect foreign key constraint error from Prisma
      if (
        errorMsg.includes("Foreign key constraint violated") ||
        errorMsg.includes("order_tracking_logs")
      ) {
        toast.error(
          'Tidak dapat menghapus kurir karena memiliki riwayat pengiriman. Gunakan fitur "Suspend" sebagai gantinya.',
        );
      } else {
        toast.error(errorMsg || "Gagal menghapus kurir");
      }
      setConfirmModal({ ...confirmModal, isOpen: false });
    },
  });

  // const filteredCouriers = couriers.filter(
  //   (c) =>
  //     (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
  //     (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
  //     (c.vehiclePlate || '').toLowerCase().includes(search.toLowerCase())
  // );

  const handleViewDetail = (id: string) => {
    setViewId(id);
    setIsDetailModalOpen(true);
  };

  const openAddForm = () => {
    setSelectedCourier(null);
    setIsEditMode(false);
    setIsFormModalOpen(true);
  };

  const openEditForm = (courier: ExtendedCourier) => {
    setSelectedCourier(courier);
    setIsEditMode(true);
    setIsFormModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const courier = couriers.find((c) => c.id === id);
    setConfirmModal({
      isOpen: true,
      courier: courier || null,
    });
  };

  const executeConfirm = () => {
    const { courier } = confirmModal;
    if (!courier) return;
    deleteMutation.mutate(courier.id);
  };

  const ActionButtons = ({
    courier,
    onView,
    onEdit,
    onDelete,
  }: {
    courier: ExtendedCourier;
    onView: (id: string) => void;
    onEdit: (c: ExtendedCourier) => void;
    onDelete: (id: string) => void;
  }) => {
    const iconSize = 14;

    return (
      <div className="flex items-center justify-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(courier.id);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          title="Lihat Detail"
        >
          <Eye size={iconSize} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(courier);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-primary/60 hover:bg-primary-light hover:text-primary transition-colors"
          title="Edit Data"
        >
          <Pencil size={iconSize} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(courier.id);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-soft-gray hover:text-gray-600 transition-colors"
          title="Hapus"
        >
          <Trash2 size={iconSize} />
        </button>
      </div>
    );
  };

  const courierColumns: Column<ExtendedCourier>[] = [
    {
      key: "name",
      header: "Nama Kurir",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-xs font-bold text-white shrink-0">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-dark">{item.name}</p>
            <p className="text-xs text-gray-400">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "vehicleType",
      header: "Kendaraan",
      render: (item) => (
        <span
          className={cn(
            "rounded-full bg-soft-gray px-2.5 py-0.5 text-xs font-medium text-dark capitalize",
            item.isSuspended && "opacity-40 grayscale",
          )}
        >
          {item.vehicleType.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "vehiclePlate",
      header: "Plat Nomor",
      render: (item) => (
        <span
          className={cn(
            "font-medium text-dark",
            item.isSuspended && "opacity-40 grayscale",
          )}
        >
          {item.vehiclePlate}
        </span>
      ),
    },

    {
      key: "isOnline",
      header: "Status Kerja",
      align: "center",
      render: (item) => (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
            item.isOnline
              ? "bg-emerald-50 text-emerald-600"
              : "bg-gray-50 text-gray-400",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              item.isOnline ? "bg-emerald-500" : "bg-gray-400",
            )}
          />
          {item.isOnline ? "Online" : "Offline"}
        </span>
      ),
    },
    {
      key: "totalDeliveries",
      header: "Deliveries",
      align: "right",
      numeric: true,
      render: (item) => (
        <span
          className={cn(
            "font-mono tabular-nums font-medium text-dark",
            item.isSuspended && "opacity-40 grayscale",
          )}
        >
          {item.totalDeliveries}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      align: "center",
      render: (item) => (
        <ActionButtons
          courier={item}
          onView={handleViewDetail}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (isEditMode && selectedCourier) {
      const updateData = {
        vehicleType: formData.get("vehicleType") as any,
        vehiclePlate: formData.get("vehiclePlate") as string,
      };
      updateMutation.mutate({ id: selectedCourier.id, data: updateData });
    } else {
      const createData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        vehicleType: formData.get("vehicleType") as any,
        vehiclePlate: formData.get("vehiclePlate") as string,
        password: formData.get("password") as string,
      };
      createMutation.mutate(createData);
    }
  };

  // Summary stats
  const onlineCount = couriers.filter((c) => c.isOnline).length;
  const offlineCount = couriers.filter((c) => !c.isOnline).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-dark">Daftar Kurir</h2>
          <p className="text-sm text-gray-500">
            Kelola data kurir yang bertugas menjemput sampah
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 rounded-xl border border-soft-gray bg-white px-3 py-2 w-full sm:w-auto">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, email, plat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-52 bg-transparent text-sm text-gray-600 placeholder:text-gray-400 outline-none"
            />
          </div>
          <Button
            onClick={openAddForm}
            className="w-full sm:w-auto gap-2 bg-primary hover:bg-[#015558] border-primary hover:border-[#015558] text-white"
          >
            <Plus size={16} />
            Tambah Kurir
          </Button>
        </div>
      </div>

      {/* Courier Table */}
      <div className="rounded-2xl border border-soft-gray bg-white shadow-sm overflow-hidden min-h-[300px] relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
        <DataTable
          columns={courierColumns}
          data={filteredCouriers}
          keyExtractor={(i) => i.id}
          emptyMessage={
            isLoading ? "Memuat data..." : "Tidak ada kurir ditemukan"
          }
        />
      </div>

      {/* Form Courier Modal (Add/Edit) */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={isEditMode ? "Edit Data Kurir" : "Tambah Kurir Baru"}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="name"
              label="Nama Lengkap"
              defaultValue={selectedCourier?.name}
              placeholder="Nama Kurir"
              required={!isEditMode}
              disabled={isEditMode}
            />
            <Input
              name="phone"
              label="No. Telepon"
              defaultValue={selectedCourier?.phone}
              placeholder="Nomor HP Kurir"
              required={!isEditMode}
              disabled={isEditMode}
            />
          </div>
          <Input
            name="email"
            type="email"
            label="Alamat Email"
            defaultValue={selectedCourier?.email}
            placeholder="Email Kurir"
            required={!isEditMode}
            disabled={isEditMode}
          />

          {!isEditMode && (
            <Input
              name="password"
              type="password"
              label="Password Sementara"
              placeholder="••••••••"
              required
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-dark">
                Tipe Kendaraan
              </label>
              <select
                name="vehicleType"
                required
                defaultValue={selectedCourier?.vehicleType}
                className="w-full rounded-xl border border-soft-gray bg-white px-4 py-2.5 text-sm text-dark outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              >
                <option value={VehicleType.MOTOR}>Motor</option>
                <option value={VehicleType.PICKUP}>Mobil Pickup</option>
                <option value={VehicleType.TRUCK}>Truk</option>
              </select>
            </div>
            <Input
              name="vehiclePlate"
              label="Plat Nomor"
              defaultValue={selectedCourier?.vehiclePlate}
              placeholder="B 1234 XYZ"
              required
            />
          </div>

          <div className="pt-4 mt-2 flex justify-end gap-3 border-t border-soft-gray">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFormModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-[#015558] border-primary text-white"
            >
              {isEditMode ? "Simpan Perubahan" : "Simpan Data Kurir"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Courier Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setViewId(null);
        }}
        title="Detail Profil Kurir"
        maxWidth="max-w-2xl"
      >
        {isLoadingDetail ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : courierDetail ? (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center gap-5 border-b border-soft-gray pb-5">
              <div
                className={cn(
                  "flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold text-white shadow-md",
                  courierDetail.isOnline
                    ? "bg-linear-to-br from-primary to-secondary"
                    : "bg-gray-400",
                )}
              >
                {courierDetail.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-dark">
                    {courierDetail.name}
                  </h3>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                      courierDetail.isOnline
                        ? "bg-primary-light text-primary"
                        : "bg-soft-gray text-gray-500",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        courierDetail.isOnline ? "bg-primary" : "bg-gray-400",
                      )}
                    />
                    {courierDetail.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{courierDetail.email}</p>
                <div className="mt-2 flex gap-3 text-sm">
                  <span className="font-medium text-dark">
                    {courierDetail.totalDeliveries} Pengiriman Selesai
                  </span>
                </div>
              </div>
            </div>

            {/* Stats / Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl bg-primary-light p-4 border border-primary/20">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Tipe Kendaraan
                </span>
                <p className="mt-1 font-bold text-dark capitalize">
                  {(courierDetail.vehicleType || "").replace("_", " ")}
                </p>
              </div>
              <div className="rounded-xl bg-soft-gray p-4 border border-gray-200">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Plat Nomor
                </span>
                <p className="mt-1 font-bold text-dark">
                  {courierDetail.vehiclePlate || "-"}
                </p>
              </div>
              <div className="rounded-xl bg-very-light-gray p-4 border border-soft-gray">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  No. Telepon
                </span>
                <p className="mt-1 font-bold text-dark">
                  {courierDetail.phone}
                </p>
              </div>
              <div className="rounded-xl bg-primary-light/50 p-4 border border-primary/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Bergabung
                </span>
                <p className="mt-1 font-bold text-dark">
                  {new Date(courierDetail.createdAt).toLocaleDateString(
                    "id-ID",
                    { month: "short", year: "numeric" },
                  )}
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-soft-gray">
              <Button
                variant="outline"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={executeConfirm}
        title="Hapus Kurir"
        message={`Apakah Anda yakin ingin menghapus kurir ${confirmModal.courier?.name} secara permanen? Data yang terkait juga akan dihapus.`}
        confirmText="Hapus"
        type="danger"
        icon="delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
