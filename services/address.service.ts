import api from "@/lib/api";
import type { ApiResponse, Address } from "@/types/models";

export interface AddressInput {
  label: string;
  district?: string;
  village?: string;
  addressDetail: string;
  latitude?: number;
  longitude?: number;
  isPrimary?: boolean;
}

export const addressService = {
  /** Get user's addresses — GET /api/users/addresses */
  async getAddresses(): Promise<ApiResponse<Address[]>> {
    const response = await api.get("/users/addresses");
    return response.data;
  },

  /** Get primary/default address */
  async getDefaultAddress(): Promise<Address | null> {
    const result = await addressService.getAddresses();
    const addresses = result.data || [];
    return addresses.find((a) => a.isPrimary) || addresses[0] || null;
  },

  /** Create new address — POST /api/users/addresses */
  async createAddress(data: AddressInput): Promise<ApiResponse<Address>> {
    const response = await api.post("/users/addresses", data);
    return response.data;
  },

  /** Update address — PATCH /api/users/addresses/:id */
  async updateAddress(id: string, data: Partial<AddressInput>): Promise<ApiResponse<Address>> {
    const response = await api.patch(`/users/addresses/${id}`, data);
    return response.data;
  },

  /** Delete address — DELETE /api/users/addresses/:id */
  async deleteAddress(id: string) {
    const response = await api.delete(`/users/addresses/${id}`);
    return response.data;
  },
};
