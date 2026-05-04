export interface User {
  id: string;
  fullname: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role: string;
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: User;
}
