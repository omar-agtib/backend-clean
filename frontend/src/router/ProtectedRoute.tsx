import { Navigate } from "react-router-dom";
import { useAuth } from "../modules/auth/auth.store";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthed } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
