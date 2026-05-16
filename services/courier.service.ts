import api from "@/lib/api";
import { CourierApiResponse, CourierUpdateStatusResponse } from "@/types/courier";

export const courierService = {
  // ==================== PROFILE & STATUS ====================

  /** Get Courier Profile — GET /api/couriers/profile */
  async getProfile(): Promise<{ status: string; message: string; data: CourierApiResponse }> {
    const response = await api.get("/couriers/profile");
    return response.data;
  },

  /** Update Online/Offline Status — PATCH /api/couriers/status */
  async updateStatus(isOnline: boolean): Promise<{ status: string; message: string; data: CourierUpdateStatusResponse }> {
    const response = await api.patch("/couriers/status", { isOnline });
    return response.data;
  },

  /** Update GPS Location — PATCH /api/couriers/location */
  async updateLocation(latitude: number, longitude: number) {
    const response = await api.patch("/couriers/location", { latitude, longitude });
    return response.data;
  },

  // ==================== ORDER LIFECYCLE ====================

  /** Get orders assigned to current courier — GET /api/couriers/orders */
  async getMyOrders() {
    const response = await api.get("/couriers/orders");
    return response.data;
  },

  /** Get available (unassigned) orders — GET /api/couriers/available-orders */
  async getAvailableOrders() {
    const response = await api.get("/couriers/available-orders");
    return response.data;
  },

  /** Get order detail for courier — GET /api/couriers/orders/:id */
  async getOrderDetail(id: string) {
    const response = await api.get(`/couriers/orders/${id}`);
    return response.data;
  },

  /** Accept order — POST /api/couriers/orders/:id/accept */
  async acceptOrder(id: string) {
    const response = await api.post(`/couriers/orders/${id}/accept`, {});
    return response.data;
  },

  /** Reject order — POST /api/couriers/orders/:id/reject */
  async rejectOrder(id: string, reason: string = "Terlalu jauh") {
    const response = await api.post(`/couriers/orders/${id}/reject`, { reason });
    return response.data;
  },

  /** Courier arrived at pickup — POST /api/couriers/orders/:id/arrive */
  async arriveAtLocation(id: string) {
    const response = await api.post(`/couriers/orders/${id}/arrive`);
    return response.data;
  },

  /** Courier departs for pickup (scheduled) — POST /api/couriers/orders/:id/depart */
  async departOrder(id: string) {
    const response = await api.post(`/couriers/orders/${id}/depart`);
    return response.data;
  },

  /** Start weighing simulation — POST /api/couriers/orders/:id/start-weighing */
  async startWeighing(id: string) {
    const response = await api.post(`/couriers/orders/${id}/start-weighing`);
    return response.data;
  },

  /** Submit weighing result — POST /api/couriers/orders/:id/weigh */
  async submitWeighing(id: string, wasteTypeId: string, photo?: File) {
    const formData = new FormData();
    formData.append("wasteTypeId", wasteTypeId);
    if (photo) formData.append("photo", photo);
    const response = await api.post(`/couriers/orders/${id}/weigh`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /** Waste picked up — POST /api/couriers/orders/:id/pickup */
  async pickup(id: string) {
    const response = await api.post(`/couriers/orders/${id}/pickup`);
    return response.data;
  },

  /** Start delivery to drop point — POST /api/couriers/orders/:id/deliver */
  async startDelivery(id: string) {
    const response = await api.post(`/couriers/orders/${id}/deliver`);
    return response.data;
  },

  /** Complete order with evidence photo — POST /api/couriers/orders/:id/complete */
  async completeOrder(id: string, photo?: File) {
    const formData = new FormData();
    if (photo) formData.append("file", photo);
    const response = await api.post(`/couriers/orders/${id}/complete`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /** Update location for active order — POST /api/couriers/orders/:id/location */
  async updateOrderLocation(id: string, data: { latitude: number; longitude: number }) {
    const response = await api.post(`/couriers/orders/${id}/location`, data);
    return response.data;
  },
};
