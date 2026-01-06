// src/pages/LoginPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../features/auth/hooks/useLogin";
import { token } from "../lib/token";
import LogoMark from "../components/LogoMark";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";

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

  const errorMessage =
    (login.error as any)?.response?.data?.message ||
    (login.error as Error | undefined)?.message ||
    t("auth.loginError");

  return (
    <div className="min-h-screen bg-background">
      {/* Top small bar */}
      <div className="mx-auto max-w-5xl px-4 py-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary text-primaryForeground grid place-items-center shadow-soft">
            <LogoMark className="h-8 w-8" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-extrabold leading-tight">Chantier</div>
            <div className="text-xs text-mutedForeground">
              {t("auth.loginSubtitle")}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* Card */}
      <div className="mx-auto max-w-md px-4 pb-10">
        <div className="card p-6">
          <h1 className="text-xl font-extrabold">{t("auth.loginTitle")}</h1>
          <p className="text-sm text-mutedForeground mt-1">
            {t("auth.loginSubtitle")}
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <div>
              <label className="text-sm font-semibold">{t("auth.email")}</label>
              <input
                className="input mt-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                type="email"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                {t("auth.password")}
              </label>
              <input
                className="input mt-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

            {login.isError ? (
              <div className="rounded-2xl border border-border bg-muted px-3 py-2 text-sm">
                <div className="font-bold text-danger">
                  {t("auth.loginError")}
                </div>
                <div className="text-mutedForeground mt-1 break-words">
                  {errorMessage}
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={login.isPending}
              className="btn-primary w-full"
            >
              {login.isPending ? t("auth.loggingIn") : t("auth.login")}
            </button>
          </form>
        </div>

        <div className="mt-4 text-center text-xs text-mutedForeground">
          {t("auth.hint")}
        </div>
      </div>
    </div>
  );
}
