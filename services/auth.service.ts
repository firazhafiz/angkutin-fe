import api from "@/lib/api";
import {
  LoginRequest,
  LoginResponse,
  LoginData,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";

export const authService = {
  // Fungsi Login
  async login(data: LoginRequest): Promise<LoginData> {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data.data;
  },

  // Fungsi Register
  async register(data: RegisterRequest): Promise<RegisterResponse["data"]> {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data.data;
  },

  // Fungsi Logout (Client Side)
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  },
};
