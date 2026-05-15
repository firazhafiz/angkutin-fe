import {
  UserRole,
  OrderStatus,
  VehicleType,
  ScheduleType,
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
  district?: string;
  village?: string;
  addressDetail: string;
  lat?: number;
  lng?: number;
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
  scheduleType: ScheduleType;
  scheduledAt?: string; // null = instant
  notes?: string;
  estimatedVolume?: number; // from AR scan (liters)
  recommendedVehicle?: VehicleType;
  createdAt: string;
  updatedAt: string;
}

export interface OrderOffer {
  id: string;
  orderId: string;
  courierId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  expiresAt: string;
  createdAt: string;
}

export interface CourierMatch {
  courier: CourierProfile;
  distanceKm: number;
  etaMinutes: number;
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

export interface WeighingSimulation {
  orderId: string;
  mutuKg: number;
  residuKg: number;
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
  name: string;
  category: WasteCategory;
  unitPrice: number;
  createdAt: string;
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
