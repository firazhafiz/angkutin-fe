import api from "@/lib/api";
import type { ApiResponse, Order, AiResult } from "@/types/models";

// ==================== REQUEST TYPES ====================
export interface AiAnalyzeRequest {
  imageUrl: string;
  manualHint?: string;
}

export interface CreateOrderRequest {
  addressId: string;
  scheduleType: "INSTANT" | "SCHEDULED";
  scheduledAt?: string | null; // ISO string, only if SCHEDULED
  note?: string;
  aiResultId: string; // Links to AI scan result
}

// ==================== ORDER SERVICE ====================
export const orderService = {
  /**
   * AI Analyze — simulate waste photo analysis
   * POST /api/orders/ai-analyze
   */
  async aiAnalyze(data: AiAnalyzeRequest): Promise<ApiResponse<AiResult>> {
    const response = await api.post("/orders/ai-analyze", data);
    return response.data;
  },

  /**
   * Create Order
   * POST /api/orders
   */
  async createOrder(data: CreateOrderRequest): Promise<ApiResponse<Order>> {
    const response = await api.post("/orders", data);
    return response.data;
  },

  /**
   * Get All Orders (filtered by role via JWT)
   * GET /api/orders
   */
  async getOrders(status?: string): Promise<ApiResponse<Order[]>> {
    const params = status ? { status } : {};
    const response = await api.get("/orders", { params });
    return response.data;
  },

  /**
   * Get Order Detail
   * GET /api/orders/:id
   * Note: BE returns data as array, we normalize to single object
   */
  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    const response = await api.get(`/orders/${id}`);
    const raw = response.data;

    // BE returns array for single item — normalize
    if (Array.isArray(raw.data)) {
      return { ...raw, data: raw.data[0] || null };
    }
    return raw;
  },

  /**
   * Get Order Status Timeline
   * GET /api/orders/:id/timeline
   */
  async getTimeline(id: string) {
    const response = await api.get(`/orders/${id}/timeline`);
    return response.data;
  },

  /**
   * Cancel Order (user side, before weighing)
   * POST /api/orders/:id/cancel
   */
  async cancelOrder(id: string, reason?: string) {
    const response = await api.post(`/orders/${id}/cancel`, { reason });
    return response.data;
  },

  /**
   * Get Latest Courier Location (fallback/polling)
   * GET /api/orders/:id/tracking
   */
  async getTracking(id: string) {
    const response = await api.get(`/orders/${id}/tracking`);
    return response.data;
  },

  /**
   * Get Full Tracking History
   * GET /api/orders/:id/tracking/history
   */
  async getTrackingHistory(id: string) {
    const response = await api.get(`/orders/${id}/tracking/history`);
    return response.data;
  },

  /**
   * Get Waste Types (pricing)
   * GET /api/waste-types
   */
  async getWasteTypes() {
    const response = await api.get("/waste-types");
    return response.data;
  },

  /**
   * Get Weighing Summary
   * GET /api/orders/:id/weighing-summary
   */
  async getWeighingSummary(id: string) {
    const response = await api.get(`/orders/${id}/weighing-summary`);
    return response.data;
  },

  /**
   * User confirms weighing result
   * POST /api/orders/:id/confirm
   */
  async confirmWeighing(id: string) {
    const response = await api.post(`/orders/${id}/confirm`);
    return response.data;
  },

  /**
   * User pays for order
   * POST /api/orders/:id/pay
   */
  async payOrder(id: string, method: "WALLET" | "E_WALLET") {
    const response = await api.post(`/orders/${id}/pay`, { method });
    return response.data;
  },

  /**
   * Get payment status
   * GET /api/orders/:id/payment
   */
  async getPayment(id: string) {
    const response = await api.get(`/orders/${id}/payment`);
    return response.data;
  },
};
