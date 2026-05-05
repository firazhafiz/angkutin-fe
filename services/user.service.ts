import api from "@/lib/api";
import { ProfileResponse } from "@/types/auth";

export const userService = {
  // Get current user profile
  async getProfile(): Promise<ProfileResponse> {
    const response = await api.get<ProfileResponse>("/users/profile");
    return response.data;
  },
  // Get active sessions
  async getSessions(): Promise<any> {
    const response = await api.get("/users/sessions");
    return response.data;
  },
};
