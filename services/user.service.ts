import api from "@/lib/api";

export interface UserProfileUpdate {
  name?: string;
  phone?: string;
}

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
};
