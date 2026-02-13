// src/routes/PublicOnly.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function PublicOnly() {
  const token = useAuthStore((s) => s.token);

  if (token) return <Navigate to="/app" replace />;

  return <Outlet />;
}
