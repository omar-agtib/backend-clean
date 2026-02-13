// src/lib/http.ts
import axios from "axios";
import { token } from "./token";

const isDev = import.meta.env.DEV;
const baseURL = isDev ? "/api" : import.meta.env.VITE_API_URL || "/api";

export const http = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

function normalizeJwt(t: string) {
  return (t || "").replace(/^Bearer\s+/i, "").trim();
}

http.interceptors.request.use((config) => {
  const t = token.get();
  if (t) {
    const raw = normalizeJwt(t);
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${raw}`;
  }
  return config;
});
