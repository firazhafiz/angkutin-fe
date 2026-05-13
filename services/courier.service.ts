import api from "@/lib/api";
import { CourierApiResponse, CourierUpdateStatusResponse } from "@/types/courier";

export const courierService = {
  // Get Courier Profile
  async getProfile(): Promise<{ status: string; message: string; data: CourierApiResponse }> {
    const response = await api.get("/couriers/profile");
    return response.data;
  },

  // Update Courier Online Status
  async updateStatus(isOnline: boolean): Promise<{ status: string; message: string; data: CourierUpdateStatusResponse }> {
    const response = await api.patch("/couriers/status", { isOnline });
    return response.data;
  },
};
