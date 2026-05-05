import axios from "axios";

// Instance axios untuk komunikasi ke Backend
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://angkutin-be.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "ngrok-skip-browser-warning": "69420", // Header sakti buat bypass warning ngrok
  },
});

// Interceptor untuk menyisipkan token JWT secara otomatis
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani error global (misal: token expired)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika error 401 (Unauthorized) dan bukan request refresh token itu sendiri
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Panggil endpoint refresh token
        // Sesuaikan endpoint ini dengan BE (biasanya /auth/refresh atau /auth/refresh-token)
        const response = await axios.post("https://angkutin-be.vercel.app/api/auth/refresh", {
          refresh_token: refreshToken
        });

        const { access_token, refresh_token: newRefreshToken } = response.data.data;

        // Simpan token baru
        localStorage.setItem("token", access_token);
        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken);
        }

        // Update header Authorization di request asal dan ulangi
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Jika refresh gagal, logout user
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        
        if (typeof window !== "undefined" && !window.location.pathname.includes("/auth")) {
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
