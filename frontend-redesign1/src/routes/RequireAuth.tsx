// src/components/RequireAuth.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { token } from "../lib/token";

export default function RequireAuth() {
  const loc = useLocation();
  const hasToken = !!token.get();

  if (!hasToken) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }

  return <Outlet />;
}
