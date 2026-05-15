// ==================== API RESPONSE ====================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== AUTH ====================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "courier";
}

export interface AuthResponse {
  token: string;
  user: import("./models").User;
}

// ==================== ORDER ====================
export interface CreateOrderRequest {
  addressId: string;
  scheduledAt?: string;
  notes?: string;
  estimatedVolume?: number;
  recommendedVehicle?: string;
}

// ==================== TRIAGE ====================
export interface SubmitTriageRequest {
  orderId: string;
  mutuItems: { type: string; weightKg: number }[];
  residuItems: { weightKg: number; photoUrl: string }[];
}

// ==================== PAYMENT ====================
export interface ProcessPaymentRequest {
  orderId: string;
  method: "wallet" | "qris" | "va";
}

// ==================== ADMIN ====================
export interface CreateCourierRequest {
  userId?: string;
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  vehicleType: import("./enums").VehicleType;
  vehiclePlate?: string;
}

export interface UpdateCourierRequest {
  vehicleType?: import("./enums").VehicleType;
  isOnline?: boolean;
  currentLat?: number;
  currentLng?: number;
  vehiclePlate?: string;
}

export interface CreateWasteTypeRequest {
  name: string;
  unitPrice: number;
  category: "MUTU" | "RESIDU";
}

export interface UpdateWasteTypeRequest {
  name?: string;
  unitPrice?: number;
  category?: "MUTU" | "RESIDU";
}


export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone: string | null;
  isVerified: boolean;
  photoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    orders: number;
  };
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  status?: "ACTIVE" | "SUSPENDED";
}

// ==================== FINANCE ====================
export interface AdminTransaction {
  id: string;
  walletId: string;
  type: string;
  amount: number;
  referenceType: string;
  referenceId: string;
  status: string;
  description: string;
  createdAt: string;
  wallet: {
    id: string;
    userId: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

export interface AdminWithdrawal {
  id: string;
  userId: string;
  amount: number;
  method: string;
  accountNumber: string;
  accountName: string;
  status: string;
  externalId: string | null;
  failureReason: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface RejectWithdrawalRequest {
  reason: string;
}

export interface AdminFleetLocation {
  courierId: string;
  name: string;
  isOnline: boolean;
  currentLat: number | null;
  currentLng: number | null;
  currentOrderId: string | null;
}

// ==================== ANALYTICS ====================
export interface AdminAnalyticsSummary {
  totalOrders: number;
  totalRevenue: number;
  totalMutuKg: number;
  totalResiduKg: number;
  activeCouriers: number;
  pendingWithdrawals: number;
}

export interface BarChartDataPoint {
  date: string;
  mutu: number;
  residu: number;
}

export interface AreaChartDataPoint {
  date: string;
  revenue: number;
  beban: number;
}

export interface AdminAnalyticsChartResponse {
  barChart: BarChartDataPoint[];
  areaChart: AreaChartDataPoint[];
}

// ==================== NOTIFICATIONS ====================
export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  createdAt: string;
}



