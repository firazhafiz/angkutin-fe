import api from "@/lib/api";

export interface UserProfileUpdate {
  name?: string;
  phone?: string;
}

export interface UserAddress {
  id: string;
  userId: string;
  label: string;
  district: string;
  village: string;
  addressDetail: string;
  isPrimary: boolean;
}

export interface UserAddressInput extends Omit<UserAddress, "id" | "userId"> {}

export const userService = {
  // Update Profile (Nama & Phone)
  async updateProfile(data: UserProfileUpdate) {
    const response = await api.patch("/users/profile", data);
    return response.data;
  },

  // Upload Profile Picture
  async uploadProfilePic(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/users/profile-pic", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get Current Profile
  async getProfile() {
    const response = await api.get("/users/profile");
    return response.data;
  },

  // Get User Login Sessions
  async getSessions() {
    try {
      const response = await api.get("/users/sessions");
      return response.data;
    } catch (error) {
      // Jika endpoint belum ada di BE, return data kosong agar tidak crash
      return { data: [] };
    }
  },

  // Get Addresses
  async getAddresses() {
    const response = await api.get("/users/addresses");
    return response.data;
  },

  // Add Address
  async addAddress(data: UserAddressInput) {
    const response = await api.post("/users/addresses", data);
    return response.data;
  },

  // Update Address
  async updateAddress(id: string, data: UserAddressInput) {
    const response = await api.patch(`/users/addresses/${id}`, data);
    return response.data;
  },

  // Delete Address
  async deleteAddress(id: string) {
    const response = await api.delete(`/users/addresses/${id}`);
    return response.data;
  },
};
