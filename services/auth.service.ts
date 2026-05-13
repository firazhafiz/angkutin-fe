import api from "@/lib/api";
import Cookies from "js-cookie";
import {
  LoginRequest,
  LoginResponse,
  LoginData,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
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
    Cookies.remove("token");
    Cookies.remove("user_role");
  },

  // Google Login/Register
  async loginWithGoogle(idToken: string): Promise<LoginData> {
    const response = await api.post<LoginResponse>("/auth/google", { idToken });
    return response.data.data;
  },

  // Forgot Password
  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await api.post<ForgotPasswordResponse>("/auth/forgot-password", data);
    return response.data;
  },

  // Reset Password
  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const response = await api.post<ResetPasswordResponse>("/auth/reset-password", data);
    return response.data;
  },
};
