// src/pages/BootPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMe } from "../features/auth/hooks/useMe";
import SiteLoader from "../components/SiteLoader";
import { token } from "../lib/token";
import { useAuthStore } from "../store/auth.store";

export default function BootPage() {
  const navigate = useNavigate();

  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);

  const hasToken = !!token.get();
  const me = useMe();

  useEffect(() => {
    if (!hasToken) {
      navigate("/login", { replace: true });
      return;
    }

    if (me.isSuccess) {
      // normalize user to store shape (_id)
      setUser({
        _id: (me.data as any).id,
        name: (me.data as any).name,
        email: (me.data as any).email,
        role: (me.data as any).role,
      });
      navigate("/app", { replace: true });
      return;
    }

    if (me.isError) {
      token.clear();
      clear();
      navigate("/login", { replace: true });
      return;
    }
  }, [hasToken, me.isSuccess, me.isError, me.data, navigate, setUser, clear]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <SiteLoader
          title="Loading chantier..."
          subtitle={
            hasToken ? "Verifying your session" : "Preparing login screen"
          }
          isSpinning={me.isFetching || me.isPending}
        />
      </div>
    </div>
  );
}
