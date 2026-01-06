// src/layouts/AppLayout.tsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useNotifications } from "../features/notifications/hooks/useNotifications";
import { useNotificationsRealtime } from "../features/notifications/hooks/useNotificationsRealtime";
import { useAuthStore } from "../store/auth.store";
import { useProjectStore } from "../store/projectStore";
import { token } from "../lib/token";
import ToastHost from "../components/ToastHost";

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
      <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-semibold bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-900/60 dark:text-slate-500">
        <span>{label}</span>
        {badge && badge > 0 ? (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-extrabold">
            {badge}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition",
          "dark:text-slate-100",
          isActive
            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
            : "bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-900/60 dark:hover:bg-slate-900",
        ].join(" ")
      }
    >
      <span>{label}</span>
      {badge && badge > 0 ? (
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-extrabold">
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

  // badge
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
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* ✅ global toasts */}
      <ToastHost />

      <div className="mx-auto max-w-7xl px-4 py-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-3">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 dark:bg-slate-950 dark:border-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-extrabold">Chantier</div>
                <div className="text-xs text-slate-500 mt-1 dark:text-slate-400">
                  {user?.name ? `Signed in as ${user.name}` : "Workspace"}
                </div>

                <div className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {projectLabel}
                </div>

                {!activeProjectId ? (
                  <div className="text-xs text-slate-500 mt-1 dark:text-slate-400">
                    Open a project to activate the workspace.
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-900"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <AppNavItem to="/app/search" label="Search" />
            <AppNavItem to="/app" label="Dashboard" />
            <AppNavItem to="/app/projects" label="Projects" />
            <AppNavItem
              to="/app/notifications"
              label="Notifications"
              badge={unread}
            />
          </nav>
        </aside>

        {/* Main */}
        <main className="lg:col-span-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
