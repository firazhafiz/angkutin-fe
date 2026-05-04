import axios from "axios";

// Instance axios untuk komunikasi ke Backend
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
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
  (error) => {
    if (error.response?.status === 401) {
      // Logic logout atau redirect jika token tidak valid
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
