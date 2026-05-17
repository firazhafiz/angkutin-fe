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
import { PrismaDecimal } from "@/lib/decimal";

// ==================== GENERIC API RESPONSE ====================
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

// ==================== USER ====================
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  photoUrl?: string | null;
  createdAt: string;
}

// ==================== ADDRESS ====================
/** Address as returned by BE (coordinates in Prisma Decimal format) */
export interface Address {
  id: string;
  userId: string;
  label: string; // "Home", "Kos", "Kantor"
  district?: string;
  village?: string;
  addressDetail: string;
  latitude: PrismaDecimal | number | null;
  longitude: PrismaDecimal | number | null;
  isPrimary: boolean;
}

// ==================== AI SCAN RESULT ====================
export interface AiResult {
  id: string;
  orderId: string | null;
  volumeEstimation: number;
  recommendedVehicle: VehicleType;
  confidenceScore: number;
  createdAt: string;
}

// ==================== ORDER ====================
/** Order as returned by BE */
export interface Order {
  id: string;
  userId: string;
  courierId: string | null;
  addressId: string;
  status: OrderStatus;
  scheduleType: ScheduleType;
  scheduledAt: string | null;
  note: string | null; // BE uses singular "note"
  totalCredit: number;
  totalDebit: number | null;
  netTotal: number | null;
  paymentStatus: string | null;
  createdAt: string;
  // Nested relations
  address?: Address;
  wasteItems?: WasteItem[];
  residuals?: ResidualItem[];
  payments?: PaymentRecord[];
  aiResults?: AiResult[];
  statusHistory?: StatusHistoryEntry[];
  courier?: CourierWithUser | null;
  user?: { id: string; name: string; phone: string; photoUrl?: string | null };
  pointTransactions?: PointTransaction[];
}

export interface PointTransaction {
  id: string;
  userId: string;
  orderId: string | null;
  points: number;
  mutuWeight: number | null;
  description: string | null;
  createdAt: string;
}

// ==================== STATUS HISTORY ====================
export interface StatusHistoryEntry {
  id: string;
  orderId: string;
  status: OrderStatus;
  note: string | null;
  photoUrl: string | null;
  createdAt: string;
}

// ==================== COURIER (as nested in Order response) ====================
export interface CourierWithUser {
  id: string;
  userId: string;
  vehicleType: VehicleType;
  vehiclePlate: string;
  isOnline: boolean;
  currentLat: PrismaDecimal | number | null;
  currentLng: PrismaDecimal | number | null;
  user?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    role?: string;
    photoUrl?: string | null;
  };
}

// ==================== ORDER OFFER ====================
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
  wasteTypeId?: string;
  weight: number;
  price: number;
  subtotal: number;
  wasteType?: WasteType;
  // Legacy compat fields (mapped from BE)
  category?: WasteCategory;
  type?: string;
  weightKg?: number;
  pricePerKg?: number;
  photoUrl?: string;
}

/** Waste type from BE GET /waste-types */
export interface WasteType {
  id: string;
  name: string;
  category: "MUTU" | "RESIDU";
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
}

/** Residual item from BE order response */
export interface ResidualItem {
  id: string;
  orderId: string;
  weight: number;
  pricePerKg: number;
  subtotal: number;
  photoUrl: string;
}

/** Payment record from BE */
export interface PaymentRecord {
  id: string;
  orderId: string;
  userId: string;
  externalId: string;
  gatewayId: string | null;
  amount: number;
  method: string;
  status: string;
  invoiceUrl: string | null;
  expiredAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Weighing summary from BE GET /orders/:id/weighing-summary */
export interface WeighingSummary {
  orderId: string;
  status: string;
  courier: { id: string; name: string; phone: string; vehicleType: string };
  mutuItems: Array<{
    id: string; wasteTypeName: string; category: string;
    weight: number; pricePerKg: number; subtotal: number;
  }>;
  residuals: Array<{
    id: string; weight: number; pricePerKg: number;
    subtotal: number; photoUrl: string;
  }>;
  summary: {
    totalMutuWeight: number; totalResidualWeight: number; totalWeight: number;
    totalCredit: number; totalDebit: number; netTotal: number;
    userReceives: number; userPays: number;
    formattedCredit: string; formattedDebit: string; formattedNetTotal: string;
    formattedUserReceives: string; formattedUserPays: string;
    paymentRequired: boolean; paymentStatus: string | null;
  };
  payment: PaymentRecord | null;
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
