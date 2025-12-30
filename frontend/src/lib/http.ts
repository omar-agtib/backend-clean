// src/lib/http.ts
import axios from "axios";
import { token } from "./token";

/**
 * In development:
 * - use "/api" so requests go to Vite (5173) and are proxied to backend (3001)
 * - this avoids CORS entirely
 *
 * In production:
 * - set VITE_API_URL to your backend URL like "https://api.yoursite.com/api"
 *   or keep it as "/api" if your production frontend server also proxies.
 */
const isDev = import.meta.env.DEV;

const baseURL = isDev ? "/api" : import.meta.env.VITE_API_URL || "/api";

export const http = axios.create({
  baseURL,
  // keep true only if you use cookies. harmless otherwise.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request (if exists)
http.interceptors.request.use((config) => {
  const t = token.get();
  if (t) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});
