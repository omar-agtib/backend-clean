import { api } from "../../../lib/api";

export type LoginDto = { email: string; password: string };

export type LoginResponse = {
  accessToken: string; // ← Changed from "token" to "accessToken"
  sessionId: string;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
};

export async function loginApi(dto: LoginDto) {
  const { data } = await api.post<LoginResponse>("/auth/login", dto);
  return data;
}

export async function meApi() {
  const { data } = await api.get("/auth/me");
  return data;
}
