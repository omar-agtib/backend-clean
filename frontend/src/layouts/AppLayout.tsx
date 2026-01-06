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
      <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm text-mutedForeground bg-muted border border-border cursor-not-allowed">
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
          "flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition border",
          isActive
            ? "bg-primary text-primaryForeground border-transparent"
            : "bg-card border-border hover:bg-muted"
        )
      }
      end
    >
      <span>{label}</span>
      {badge && badge > 0 ? (
        <span
          className={cn(
            "chip border-transparent",
            "bg-black/10 text-current",
            "dark:bg-white/10"
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
    <div className="min-h-screen bg-background">
      <ToastHost />

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-2xl bg-primary text-primaryForeground grid place-items-center shadow-soft">
              <span className="font-bold">C</span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-tight truncate">
                Chantier
              </div>
              <div className="text-xs text-mutedForeground truncate">
                {projectLabel}
              </div>
              {!activeProjectId ? (
                <div className="text-xs text-mutedForeground mt-1">
                  Open a project to activate the workspace.
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <button className="btn-ghost" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="card p-4">
            <div className="text-xs text-mutedForeground mb-3">Navigation</div>

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

            <div className="mt-4 pt-4 border-t border-border">
              <div className="text-xs text-mutedForeground">
                Signed in as{" "}
                <span className="text-foreground font-medium">
                  {user?.email || user?.name || "User"}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="lg:col-span-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
