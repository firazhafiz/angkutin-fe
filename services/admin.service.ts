import api from "./api";
import { 
  ApiResponse, 
  CreateCourierRequest, 
  UpdateCourierRequest, 
  CreateWasteTypeRequest,
  UpdateWasteTypeRequest,
  UserProfile,
  UpdateUserRequest,
  AdminTransaction,
  AdminWithdrawal,
  RejectWithdrawalRequest,
  AdminFleetLocation,
  AdminAnalyticsSummary,
  AdminAnalyticsChartResponse,
  AdminNotification
} from "@/types/api";
import { CourierProfile, PricingRule } from "@/types/models";

export const adminService = {
  // --- Couriers ---
  getCouriers: async (): Promise<ApiResponse<CourierProfile[]>> => {
    const response = await api.get("/admin/couriers");
    return response.data;
  },

  getCourierDetail: async (id: string): Promise<ApiResponse<CourierProfile>> => {
    const response = await api.get(`/admin/couriers/${id}`);
    return response.data;
  },

  createCourier: async (data: CreateCourierRequest): Promise<ApiResponse<CourierProfile>> => {
    const response = await api.post("/admin/couriers", data);
    return response.data;
  },

  updateCourier: async (id: string, data: UpdateCourierRequest): Promise<ApiResponse<CourierProfile>> => {
    const response = await api.patch(`/admin/couriers/${id}`, data);
    return response.data;
  },

  deleteCourier: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/admin/couriers/${id}`);
    return response.data;
  },

  // --- Waste Types ---
  getWasteTypes: async (): Promise<ApiResponse<PricingRule[]>> => {
    const response = await api.get("/waste-types");
    return response.data;
  },

  createWasteType: async (data: CreateWasteTypeRequest): Promise<ApiResponse<PricingRule>> => {
    const response = await api.post("/waste-types", data);
    return response.data;
  },

  updateWasteType: async (id: string, data: UpdateWasteTypeRequest): Promise<ApiResponse<PricingRule>> => {
    const response = await api.patch(`/waste-types/${id}`, data);
    return response.data;
  },

  deleteWasteType: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/waste-types/${id}`);
    return response.data;
  },

  // --- Users ---
  getAllUsers: async (): Promise<ApiResponse<UserProfile[]>> => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserRequest): Promise<ApiResponse<UserProfile>> => {
    console.log(`[adminService] Calling PATCH /admin/users/${id} with data:`, data);
    const response = await api.patch(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // --- Finance ---
  getTransactions: async (): Promise<ApiResponse<AdminTransaction[]>> => {
    const response = await api.get("/admin/finance/transactions");
    return response.data;
  },

  getWithdrawals: async (): Promise<ApiResponse<AdminWithdrawal[]>> => {
    const response = await api.get("/admin/withdrawals");
    return response.data;
  },

  approveWithdrawal: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/admin/withdrawals/${id}/approve`);
    return response.data;
  },

  rejectWithdrawal: async (id: string, data: RejectWithdrawalRequest): Promise<ApiResponse<void>> => {
    const response = await api.post(`/admin/withdrawals/${id}/reject`, data);
    return response.data;
  },

  // --- Fleet ---
  getFleetLocations: async (): Promise<ApiResponse<AdminFleetLocation[]>> => {
    const response = await api.get("/admin/fleet/locations");
    return response.data;
  },

  // --- Analytics ---
  getAnalyticsSummary: async (): Promise<ApiResponse<AdminAnalyticsSummary>> => {
    const response = await api.get("/admin/analytics/summary");
    return response.data;
  },

  getAnalyticsCharts: async (range: '7d' | '30d' = '7d'): Promise<ApiResponse<AdminAnalyticsChartResponse>> => {
    const response = await api.get("/admin/analytics/charts", { params: { range } });
    return response.data;
  },

  // --- Notifications ---
  getNotifications: async (): Promise<ApiResponse<AdminNotification[]>> => {
    const response = await api.get("/admin/notifications");
    return response.data;
  },

  markNotificationAsRead: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.patch(`/admin/notifications/${id}/read`);
    return response.data;
  },

  markAllNotificationsAsRead: async (): Promise<ApiResponse<void>> => {
    const response = await api.patch("/admin/notifications/read-all");
    return response.data;
  },
};


