// src/features/auth/api/auth.api.ts
import { http } from "../../../lib/http";

export type LoginDto = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  name: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  sessionId?: string;
  user: AuthUser;
};

export async function loginApi(dto: LoginDto) {
  const { data } = await http.post<LoginResponse>("/auth/login", dto);
  return data;
}

export async function meApi() {
  const { data } = await http.get<AuthUser>("/auth/me");
  return data;
}
