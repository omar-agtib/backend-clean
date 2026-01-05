// src/pages/LoginPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../features/auth/hooks/useLogin";
import { token } from "../lib/token";
import LogoMark from "../components/LogoMark";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useLogin();

  const [email, setEmail] = useState("owner@test.com");
  const [password, setPassword] = useState("123456");

  useEffect(() => {
    if (token.get()) navigate("/", { replace: true });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login.mutateAsync({ email, password });
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-slate-900">
            <LogoMark className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{t("auth.loginTitle")}</h1>
            <p className="text-sm text-slate-500">{t("auth.loginSubtitle")}</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              {t("auth.email")}
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              {t("auth.password")}
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
            />
          </div>

          {login.isError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {(login.error as any)?.response?.data?.message ||
                (login.error as Error).message}
            </div>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full rounded-xl bg-slate-900 text-white py-2 font-semibold disabled:opacity-60"
          >
            {login.isPending ? t("auth.loggingIn") : t("auth.login")}
          </button>

          <div className="flex justify-center gap-3 pt-2 text-sm">
            <button
              type="button"
              className="text-slate-600 underline"
              onClick={() => (window.location.search = "?lang=fr")}
            >
              FR
            </button>
            <button
              type="button"
              className="text-slate-600 underline"
              onClick={() => (window.location.search = "?lang=en")}
            >
              EN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
