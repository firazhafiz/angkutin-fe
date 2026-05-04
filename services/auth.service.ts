// services/auth.service.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: string; 
  token: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role : string;
}

export interface LoginPayload {
  email: string;
  password: string;
  role?: string; 
}

// ──────────────────────────────────────────────────────────
// Base URL — atur di file .env.local:
//   NEXT_PUBLIC_API_BASE=https://api.angkutin.com
// ──────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '/api';

// Helper internal: kirim request & lempar error jika gagal
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });

  if (!res.ok) {
    // Coba baca pesan error dari backend
    const text = await res.text();
    let message = text;
    try {
      const json = JSON.parse(text);
      message = json.message ?? text;
    } catch {
      // teks biasa, bukan JSON — tidak apa-apa
    }
    throw new Error(message || `Request gagal: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ──────────────────────────────────────────────────────────
// REGISTER: POST /auth/register
// ──────────────────────────────────────────────────────────
export const register = async (payload: RegisterPayload): Promise<User> => {
  const data = await request<{ user: User; token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  // Gabungkan user + token menjadi satu objek User
  return { ...data.user, token: data.token };
};

// ──────────────────────────────────────────────────────────4
// LOGIN: POST /auth/login
// ──────────────────────────────────────────────────────────
export const login = async (payload: LoginPayload): Promise<User> => {
  // ── MOCK LOGIN FOR DEVELOPMENT ──
  if (payload.email === 'admin@angkutin.id' && payload.password === 'admin123') {
    return {
      id: 'admin-001',
      name: 'Super Admin',
      email: 'admin@angkutin.id',
      role: 'admin',
      token: 'mock-admin-token',
    } as any;
  }

  const data = await request<{ user: User; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return { ...data.user, token: data.token };
};

// ──────────────────────────────────────────────────────────
// LOGOUT: POST /auth/logout
// ──────────────────────────────────────────────────────────
export const logout = async (): Promise<void> => {
  await request<void>('/auth/logout', { method: 'POST' });
};

// ──────────────────────────────────────────────────────────
// ME: GET /auth/me — ambil user yang sedang login
// ──────────────────────────────────────────────────────────
export const me = async (): Promise<User> => {
  return request<User>('/auth/me', { method: 'GET' });
};
