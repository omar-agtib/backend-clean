'use client';

import React from "react"

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

  const [email, setEmail] = useState("kouter@test.com");
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent text-primaryForeground grid place-items-center shadow-lg">
              <LogoMark className="h-9 w-9" />
            </div>
            <div className="min-w-0">
              <div className="text-base font-bold leading-tight">Chantier</div>
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
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="card-elevated p-8 w-full max-w-md shadow-2xl border-primary/10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              {t("auth.loginTitle")}
            </h1>
            <p className="text-sm text-mutedForeground">
              {t("auth.loginSubtitle")}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-bold text-foreground block mb-2">
                {t("auth.email")}
              </label>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="text-sm font-bold text-foreground block mb-2">
                {t("auth.password")}
              </label>
              <input
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </div>

            {login.isError ? (
              <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm">
                <div className="font-bold text-error">
                  {t("auth.loginError")}
                </div>
                <div className="text-error/80 mt-1 break-words text-xs">
                  {errorMessage}
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={login.isPending}
              className="btn-primary w-full mt-7 py-3 text-base font-bold"
            >
              {login.isPending ? t("auth.loggingIn") : t("auth.login")}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-mutedForeground">
              {t("auth.hint")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
