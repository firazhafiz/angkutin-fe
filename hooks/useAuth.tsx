'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { LoginRequest, RegisterRequest } from '@/types/auth';
import { storage } from '@/lib/storage';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (payload: LoginRequest) => Promise<AuthUser>;
  register: (payload: RegisterRequest) => Promise<AuthUser>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore session dari localStorage atau gunakan MOCK ADMIN untuk bypass
  useEffect(() => {
    const savedUser = storage.getUser<AuthUser>();
    const savedToken = storage.getToken();
    
    if (savedUser && savedToken) {
      setUser({ ...savedUser, token: savedToken });
    } else {
      // AUTO-LOGIN MOCK ADMIN (Bypass)
      const mockAdmin: AuthUser = {
        id: 'admin-001',
        name: 'Super Admin',
        email: 'admin@angkutin.id',
        role: 'admin',
        token: 'bypass-token'
      };
      setUser(mockAdmin);
      storage.setUser(mockAdmin);
      storage.setToken(mockAdmin.token);
    }
  }, []);

  const login = useCallback(async (payload: LoginRequest): Promise<AuthUser> => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.login(payload);
      const authUser: AuthUser = {
        id: result.user.id,
        name: result.user.fullname || result.user.email,
        email: result.user.email,
        role: result.user.role, // Pastikan role disertakan
        token: result.token,
      };
      storage.setToken(authUser.token);
      storage.setUser(authUser);
      setUser(authUser);
      return authUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login gagal';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterRequest): Promise<AuthUser> => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.register(payload);
      const authUser: AuthUser = {
        id: result.user.id,
        name: result.user.fullname || result.user.email,
        email: result.user.email,
        role: result.user.role,
        token: result.token,
      };
      storage.setToken(authUser.token);
      storage.setUser(authUser);
      setUser(authUser);
      return authUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registrasi gagal';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Backend logout gagal — tetap clear di client
    }
    storage.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth harus digunakan di dalam <AuthProvider>');
  }
  return ctx;
}
