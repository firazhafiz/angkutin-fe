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
