import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { token } from "../lib/token";
import { useMe } from "../features/auth/hooks/useMe";
import SiteLoader from "../components/SiteLoader";

export default function BootPage() {
  const navigate = useNavigate();
  const hasToken = !!token.get();
  const me = useMe(); // enabled only when token exists

  useEffect(() => {
    // No token => go login
    if (!hasToken) {
      navigate("/login", { replace: true });
      return;
    }

    // Token exists:
    if (me.isSuccess) {
      // ✅ logged => go dashboard home
      navigate("/app", { replace: true });
      return;
    }

    if (me.isError) {
      // token invalid => clear and go login
      token.clear();
      navigate("/login", { replace: true });
      return;
    }
  }, [hasToken, me.isSuccess, me.isError, navigate]);

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
