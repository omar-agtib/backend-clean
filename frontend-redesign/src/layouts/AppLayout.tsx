"use client";

// src/layouts/AppLayout.tsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useNotifications } from "../features/notifications/hooks/useNotifications";
import { useNotificationsRealtime } from "../features/notifications/hooks/useNotificationsRealtime";
import { useAuthStore } from "../store/auth.store";
import { useProjectStore } from "../store/projectStore";
import { token } from "../lib/token";
import ToastHost from "../components/ToastHost";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";
import { cn } from "../lib/cn";

function AppNavItem({
  to,
  label,
  badge,
  disabled,
}: {
  to: string;
  label: string;
  badge?: number;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-mutedForeground bg-muted border border-border cursor-not-allowed">
        <span>{label}</span>
        {badge && badge > 0 ? <span className="chip">{badge}</span> : null}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all border",
          isActive
            ? "bg-primary text-primaryForeground border-transparent shadow-md"
            : "bg-card border-border hover:bg-muted hover:border-primary/20",
        )
      }
      end
    >
      <span>{label}</span>
      {badge && badge > 0 ? (
        <span
          className={cn(
            "chip border-transparent text-xs font-bold",
            "bg-black/20 text-current",
            "dark:bg-white/15",
          )}
        >
          {badge}
        </span>
      ) : null}
    </NavLink>
  );
}

export default function AppLayout() {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const activeProjectId = useProjectStore((s) => s.activeProjectId);
  const activeProjectName = useProjectStore((s) => s.activeProjectName);

  // realtime notifications
  useNotificationsRealtime(user?._id || null);

  // unread badge
  const q = useNotifications({ limit: 100 });
  const unread = useMemo(() => {
    const list = q.data || [];
    return list.filter((x) => !x.isRead).length;
  }, [q.data]);

  const projectLabel = activeProjectId
    ? `Active: ${activeProjectName || activeProjectId}`
    : "No active project";

  function logout() {
    token.clear();
    clear();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ToastHost />

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/70">
        <div className="h-16 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-accent text-primaryForeground grid place-items-center shadow-lg flex-shrink-0">
              <span className="font-bold text-lg">C</span>
            </div>
            <div className="min-w-0">
              <div className="text-base font-bold leading-tight truncate">
                Chantier
              </div>
              <div className="text-xs text-mutedForeground truncate">
                {projectLabel}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
            <button className="btn-ghost text-sm" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <div className="px-6 py-8 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="card-elevated p-6 sticky top-24">
                <div className="text-xs font-bold text-mutedForeground mb-4 uppercase tracking-wide">
                  Navigation
                </div>

                <nav className="grid gap-2">
                  <AppNavItem to="/app" label="Dashboard" />
                  <AppNavItem to="/app/projects" label="Projects" />
                  <AppNavItem to="/app/search" label="Search" />
                  <AppNavItem
                    to="/app/notifications"
                    label="Notifications"
                    badge={unread}
                  />
                </nav>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="text-xs text-mutedForeground">
                    Signed in as
                  </div>
                  <div className="text-sm font-semibold text-foreground mt-1 truncate">
                    {user?.email || user?.name || "User"}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main */}
            <main className="lg:col-span-3">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
