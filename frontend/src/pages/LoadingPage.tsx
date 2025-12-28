import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { token } from "../lib/token";
import { useMe } from "../features/auth/hooks/useMe";
import LogoMark from "../components/LogoMark";

export default function LoadingPage() {
  const navigate = useNavigate();
  const hasToken = !!token.get();
  const me = useMe();

  useEffect(() => {
    if (!hasToken) {
      navigate("/login", { replace: true });
      return;
    }

    if (me.isSuccess) {
      navigate("/projects", { replace: true });
      return;
    }

    if (me.isError) {
      token.clear();
      navigate("/login", { replace: true });
    }
  }, [hasToken, me.isSuccess, me.isError, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <LogoMark className="h-14 w-14 text-slate-900" />
        <div className="text-slate-700 font-semibold">Loading…</div>
      </div>
    </div>
  );
}
