export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  isVerified: boolean;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginData {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: LoginData;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role: string;
}

export interface RegisterResponse {
  status: string;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ProfileResponse {
  status: string;
  message: string;
  data: User;
}
