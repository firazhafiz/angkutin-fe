import api from "@/lib/api";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";

export const authService = {
  // Fungsi Login
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  // Fungsi Register
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },

  // Fungsi Logout (Client Side)
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
