// src/lib/http.ts
import axios from "axios";
import { token } from "./token";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const http = axios.create({
  baseURL,
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
