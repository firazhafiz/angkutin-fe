// services/mock/admin.mock.ts
// ─────────────────────────────────────────────────────────
// Mock data untuk admin dashboard sementara backend belum siap.
// Akan diganti dengan API call sesungguhnya nanti.
// ─────────────────────────────────────────────────────────

import type { AnalyticsSummary, PricingRule, User, CourierProfile } from "@/types/models";
import { UserRole, VehicleType, WasteCategory, OrderStatus } from "@/types/enums";

// ──────────────────────────────────────────────────────────
// Dashboard Analytics
// ──────────────────────────────────────────────────────────
export const mockAnalytics: AnalyticsSummary = {
  totalOrders: 1247,
  totalRevenue: 48_520_000,
  totalMutuKg: 3_842,
  totalResiduKg: 1_956,
  activeCouriers: 23,
  pendingWithdrawals: 8,
};

export const mockDailyChart = [
  { date: "Sen", mutu: 142, residu: 68 },
  { date: "Sel", mutu: 158, residu: 74 },
  { date: "Rab", mutu: 135, residu: 82 },
  { date: "Kam", mutu: 172, residu: 65 },
  { date: "Jum", mutu: 190, residu: 58 },
  { date: "Sab", mutu: 210, residu: 92 },
  { date: "Min", mutu: 95, residu: 45 },
];

export const mockRevenueChart = [
  { date: "Sen", revenue: 6_800_000, beban: 2_100_000 },
  { date: "Sel", revenue: 7_200_000, beban: 2_400_000 },
  { date: "Rab", revenue: 6_100_000, beban: 2_800_000 },
  { date: "Kam", revenue: 8_400_000, beban: 1_900_000 },
  { date: "Jum", revenue: 9_100_000, beban: 1_700_000 },
  { date: "Sab", revenue: 11_200_000, beban: 3_200_000 },
  { date: "Min", revenue: 4_800_000, beban: 1_600_000 },
];

export interface DailyOrderMetric {
  id: string;
  date: string;
  totalOrders: number;
  completed: number;
  awaitingPayment: number;
  cancelled: number;
  avgWeightKg: number;
  revenue: number;
}

export const mockDailyMetrics: DailyOrderMetric[] = [
  { id: "1", date: "2026-04-28", totalOrders: 48, completed: 42, awaitingPayment: 4, cancelled: 2, avgWeightKg: 12.5, revenue: 11_200_000 },
  { id: "2", date: "2026-04-27", totalOrders: 52, completed: 47, awaitingPayment: 3, cancelled: 2, avgWeightKg: 14.2, revenue: 9_100_000 },
  { id: "3", date: "2026-04-26", totalOrders: 41, completed: 38, awaitingPayment: 2, cancelled: 1, avgWeightKg: 11.8, revenue: 8_400_000 },
  { id: "4", date: "2026-04-25", totalOrders: 35, completed: 30, awaitingPayment: 3, cancelled: 2, avgWeightKg: 10.1, revenue: 6_100_000 },
  { id: "5", date: "2026-04-24", totalOrders: 55, completed: 50, awaitingPayment: 3, cancelled: 2, avgWeightKg: 15.3, revenue: 7_200_000 },
  { id: "6", date: "2026-04-23", totalOrders: 44, completed: 40, awaitingPayment: 2, cancelled: 2, avgWeightKg: 13.0, revenue: 6_800_000 },
  { id: "7", date: "2026-04-22", totalOrders: 38, completed: 33, awaitingPayment: 3, cancelled: 2, avgWeightKg: 11.5, revenue: 5_500_000 },
];

// ──────────────────────────────────────────────────────────
// Pricing Rules
// ──────────────────────────────────────────────────────────
// export const mockMutuPricing: PricingRule[] = [
//   { id: "p1", wasteType: "Plastik PET", category: WasteCategory.MUTU, pricePerKg: 3_500, updatedAt: "2026-04-20" },
//   { id: "p2", wasteType: "Kardus", category: WasteCategory.MUTU, pricePerKg: 2_800, updatedAt: "2026-04-20" },
//   { id: "p3", wasteType: "Kertas HVS", category: WasteCategory.MUTU, pricePerKg: 2_200, updatedAt: "2026-04-18" },
//   { id: "p4", wasteType: "Aluminium", category: WasteCategory.MUTU, pricePerKg: 12_000, updatedAt: "2026-04-18" },
//   { id: "p5", wasteType: "Besi/Logam", category: WasteCategory.MUTU, pricePerKg: 8_500, updatedAt: "2026-04-15" },
//   { id: "p6", wasteType: "Botol Kaca", category: WasteCategory.MUTU, pricePerKg: 1_500, updatedAt: "2026-04-15" },
//   { id: "p7", wasteType: "Plastik HDPE", category: WasteCategory.MUTU, pricePerKg: 4_200, updatedAt: "2026-04-12" },
//   { id: "p8", wasteType: "Tembaga", category: WasteCategory.MUTU, pricePerKg: 65_000, updatedAt: "2026-04-10" },
// ];

export interface ResiduPricing {
  id: string;
  vehicleType: VehicleType;
  vehicleLabel: string;
  pricePerKg: number;
  updatedAt: string;
}

export const mockResiduPricing: ResiduPricing[] = [
  { id: "r1", vehicleType: VehicleType.MOTOR, vehicleLabel: "Motor", pricePerKg: 1_500, updatedAt: "2026-04-20" },
  { id: "r2", vehicleType: VehicleType.PICKUP, vehicleLabel: "Pickup", pricePerKg: 1_200, updatedAt: "2026-04-20" },
  { id: "r3", vehicleType: VehicleType.TRUCK_SMALL, vehicleLabel: "Truk Kecil", pricePerKg: 1_000, updatedAt: "2026-04-18" },
  { id: "r4", vehicleType: VehicleType.TRUCK_LARGE, vehicleLabel: "Truk Besar", pricePerKg: 800, updatedAt: "2026-04-18" },
];

// ──────────────────────────────────────────────────────────
// Users & Couriers
// ──────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  { id: "u1", name: "Muhammad Ilham", email: "ilham@gmail.com", phone: "081234567890", role: UserRole.USER, createdAt: "2026-03-15" },
  { id: "u2", name: "Siti Aisyah", email: "aisyah@gmail.com", phone: "081298765432", role: UserRole.USER, createdAt: "2026-03-18" },
  { id: "u3", name: "Budi Santoso", email: "budi.s@gmail.com", phone: "085612345678", role: UserRole.USER, createdAt: "2026-03-22" },
  { id: "u4", name: "Dewi Lestari", email: "dewi.l@gmail.com", phone: "087654321098", role: UserRole.USER, createdAt: "2026-04-01" },
  { id: "u5", name: "Rudi Hermawan", email: "rudi.h@gmail.com", phone: "089876543210", role: UserRole.USER, createdAt: "2026-04-05" },
  { id: "u6", name: "Nurul Hidayah", email: "nurul.h@gmail.com", phone: "081345678901", role: UserRole.USER, createdAt: "2026-04-10" },
];

export const mockCouriers: CourierProfile[] = [
  { id: "c1", name: "Agus Prasetyo", email: "agus.p@angkutin.id", phone: "081111222333", role: UserRole.COURIER, createdAt: "2026-02-10", vehicleType: VehicleType.MOTOR, vehiclePlate: "B 1234 ABC", isOnline: true, rating: 4.8, totalDeliveries: 342 },
  { id: "c2", name: "Joko Widodo", email: "joko.w@angkutin.id", phone: "081444555666", role: UserRole.COURIER, createdAt: "2026-02-15", vehicleType: VehicleType.PICKUP, vehiclePlate: "B 5678 DEF", isOnline: true, rating: 4.6, totalDeliveries: 218 },
  { id: "c3", name: "Hendra Setiawan", email: "hendra.s@angkutin.id", phone: "081777888999", role: UserRole.COURIER, createdAt: "2026-03-01", vehicleType: VehicleType.TRUCK_SMALL, vehiclePlate: "B 9012 GHI", isOnline: false, rating: 4.9, totalDeliveries: 156 },
  { id: "c4", name: "Dian Kusuma", email: "dian.k@angkutin.id", phone: "082111333555", role: UserRole.COURIER, createdAt: "2026-03-10", vehicleType: VehicleType.MOTOR, vehiclePlate: "B 3456 JKL", isOnline: true, rating: 4.7, totalDeliveries: 289 },
  { id: "c5", name: "Eko Cahyono", email: "eko.c@angkutin.id", phone: "082444666888", role: UserRole.COURIER, createdAt: "2026-03-20", vehicleType: VehicleType.TRUCK_LARGE, vehiclePlate: "B 7890 MNO", isOnline: false, rating: 4.5, totalDeliveries: 97 },
];

// ──────────────────────────────────────────────────────────
// Fleet Monitor (courier locations)
// ──────────────────────────────────────────────────────────
export interface CourierLocation {
  courierId: string;
  name: string;
  vehicleType: VehicleType;
  lat: number;
  lng: number;
  status: "idle" | "delivering" | "returning";
  currentOrderId?: string;
}

export const mockCourierLocations: CourierLocation[] = [
  { courierId: "c1", name: "Agus Prasetyo", vehicleType: VehicleType.MOTOR, lat: -6.2088, lng: 106.8456, status: "delivering", currentOrderId: "ord-101" },
  { courierId: "c2", name: "Joko Widodo", vehicleType: VehicleType.PICKUP, lat: -6.1944, lng: 106.8229, status: "idle" },
  { courierId: "c4", name: "Dian Kusuma", vehicleType: VehicleType.MOTOR, lat: -6.2297, lng: 106.8372, status: "delivering", currentOrderId: "ord-103" },
];

// ──────────────────────────────────────────────────────────
// Finance — Withdrawal Approvals
// ──────────────────────────────────────────────────────────
export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  provider: string;
  accountNumber: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
}

export const mockWithdrawals: WithdrawalRequest[] = [
  { id: "w1", userId: "u1", userName: "Muhammad Ilham", amount: 150_000, provider: "DANA", accountNumber: "081234567890", status: "pending", requestedAt: "2026-04-28T10:30:00" },
  { id: "w2", userId: "u2", userName: "Siti Aisyah", amount: 85_000, provider: "GoPay", accountNumber: "081298765432", status: "pending", requestedAt: "2026-04-28T11:15:00" },
  { id: "w3", userId: "u3", userName: "Budi Santoso", amount: 200_000, provider: "Bank Transfer", accountNumber: "1234567890", status: "pending", requestedAt: "2026-04-28T14:00:00" },
  { id: "w4", userId: "u5", userName: "Rudi Hermawan", amount: 120_000, provider: "OVO", accountNumber: "089876543210", status: "pending", requestedAt: "2026-04-28T15:30:00" },
  { id: "w5", userId: "u1", userName: "Muhammad Ilham", amount: 75_000, provider: "DANA", accountNumber: "081234567890", status: "approved", requestedAt: "2026-04-27T09:00:00" },
];

// ──────────────────────────────────────────────────────────
// Finance — Payment Gateway Log
// ──────────────────────────────────────────────────────────
export interface GatewayTransaction {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  method: "qris";
  amount: number;
  status: "success" | "failed";
  createdAt: string;
}

export const mockGatewayLogs: GatewayTransaction[] = [
  { id: "g1", orderId: "ord-095", userId: "u3", userName: "Budi Santoso", method: "qris", amount: 25_000, status: "success", createdAt: "2026-04-28T16:20:00" },
  { id: "g2", orderId: "ord-098", userId: "u4", userName: "Dewi Lestari", method: "qris", amount: 42_000, status: "failed", createdAt: "2026-04-28T17:10:00" },
  { id: "g3", orderId: "ord-100", userId: "u6", userName: "Nurul Hidayah", method: "qris", amount: 18_500, status: "success", createdAt: "2026-04-28T18:45:00" },
  { id: "g4", orderId: "ord-102", userId: "u2", userName: "Siti Aisyah", method: "qris", amount: 55_000, status: "failed", createdAt: "2026-04-28T19:30:00" },
  { id: "g5", orderId: "ord-105", userId: "u5", userName: "Rudi Hermawan", method: "qris", amount: 31_200, status: "success", createdAt: "2026-04-29T08:15:00" },
];

// ──────────────────────────────────────────────────────────
// Scanner — QR Verification Results
// ──────────────────────────────────────────────────────────
export interface ScanResult {
  orderId: string;
  matched: boolean;
  orderStatus: OrderStatus;
  userName: string;
  courierName: string;
  wasteItems: { type: string; weightKg: number }[];
  scannedAt: string;
}

export function mockVerifyQR(qrString: string): ScanResult {
  // Simulate: jika QR mengandung "ord-" → matched, selain itu → not matched
  if (qrString.startsWith("ord-")) {
    return {
      orderId: qrString,
      matched: true,
      orderStatus: OrderStatus.TRIAGE,
      userName: "Muhammad Ilham",
      courierName: "Agus Prasetyo",
      wasteItems: [
        { type: "Plastik PET", weightKg: 3.2 },
        { type: "Kardus", weightKg: 5.8 },
      ],
      scannedAt: new Date().toISOString(),
    };
  }
  return {
    orderId: qrString,
    matched: false,
    orderStatus: OrderStatus.CANCELLED,
    userName: "-",
    courierName: "-",
    wasteItems: [],
    scannedAt: new Date().toISOString(),
  };
}
