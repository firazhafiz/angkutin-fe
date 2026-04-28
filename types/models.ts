import {
  UserRole,
  OrderStatus,
  VehicleType,
  PaymentMethod,
  WasteCategory,
  TransactionType,
  CancellationReason,
} from "./enums";

// ==================== USER ====================
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

// ==================== ADDRESS ====================
export interface Address {
  id: string;
  userId: string;
  label: string; // "Rumah", "Kos", "Kantor"
  fullAddress: string;
  lat: number;
  lng: number;
  isPrimary: boolean;
}

// ==================== ORDER ====================
export interface Order {
  id: string;
  userId: string;
  courierId?: string;
  addressId: string;
  address?: Address;
  status: OrderStatus;
  scheduledAt?: string; // null = instant
  notes?: string;
  estimatedVolume?: number; // from AR scan (liters)
  recommendedVehicle?: VehicleType;
  createdAt: string;
  updatedAt: string;
}

// ==================== TRIAGE / WEIGHING ====================
export interface WasteItem {
  id: string;
  orderId: string;
  category: WasteCategory;
  type?: string; // e.g. "Plastik PET", "Kardus", etc.
  weightKg: number;
  pricePerKg: number;
  subtotal: number;
  photoUrl?: string; // proof photo for residu
}

export interface TriageResult {
  orderId: string;
  mutuItems: WasteItem[];
  residuItems: WasteItem[];
  totalMutuValue: number; // credit
  totalResiduCost: number; // debit
  netBalance: number; // mutu - residu (positive = user earns)
}

// ==================== PAYMENT ====================
export interface PaymentInfo {
  orderId: string;
  method: PaymentMethod;
  amount: number;
  walletDeduction?: number;
  gatewayAmount?: number;
  status: "pending" | "success" | "failed" | "timeout";
  expiredAt: string; // SLA timeout
}

// ==================== WALLET ====================
export interface WalletSummary {
  balance: number;
  totalEarnings: number;
  totalSpent: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  orderId?: string;
  createdAt: string;
}

// ==================== COURIER ====================
export interface CourierProfile extends User {
  vehicleType: VehicleType;
  vehiclePlate: string;
  isOnline: boolean;
  rating: number;
  totalDeliveries: number;
}

export interface CourierMission {
  order: Order;
  distanceKm: number;
  estimatedArrival: string;
  cancellationReason?: CancellationReason;
}

// ==================== ADMIN ====================
export interface PricingRule {
  id: string;
  wasteType: string;
  category: WasteCategory;
  pricePerKg: number;
  updatedAt: string;
}

export interface AnalyticsSummary {
  totalOrders: number;
  totalRevenue: number;
  totalMutuKg: number;
  totalResiduKg: number;
  activeCouriers: number;
  pendingWithdrawals: number;
}
