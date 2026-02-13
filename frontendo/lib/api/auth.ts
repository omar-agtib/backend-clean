import { apiClient } from "./client";

export interface User {
  id: string; // ✅ Changed from _id to match backend
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface AuthResponse {
  accessToken: string; // ✅ Changed from token to match backend
  user: User;
  sessionId?: string;
  refreshToken?: string;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });
  return response.data;
}

export async function register(
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/api/auth/register", {
    email,
    password,
    name,
  });
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/api/auth/logout");
}

export async function refreshToken(): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/api/auth/refresh");
  return response.data;
}

export async function getProfile(): Promise<User> {
  const response = await apiClient.get<User>("/api/auth/me");
  return response.data;
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  const response = await apiClient.put<User>("/api/auth/profile", data);
  return response.data;
}
