// src/layouts/AppLayout.tsx
import { NavLink, Outlet } from "react-router-dom";
import { useMemo } from "react";
import { useNotifications } from "../features/notifications/hooks/useNotifications";
import { useNotificationsRealtime } from "../features/notifications/hooks/useNotificationsRealtime";
import { useAuthStore } from "../store/auth.store";
import { useProjectStore } from "../store/projectStore";

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
      <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-semibold bg-slate-100 text-slate-400 cursor-not-allowed">
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
          isActive
            ? "bg-slate-900 text-white"
            : "bg-slate-100 hover:bg-slate-200 text-slate-900",
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
  const user = useAuthStore((s) => s.user);

  const activeProjectId = useProjectStore((s) => s.activeProjectId);
  const activeProjectName = useProjectStore((s) => s.activeProjectName);

  // realtime notifications
  useNotificationsRealtime(user?._id || null);

  // fetch notifications (for badge)
  const q = useNotifications({ limit: 100 });

  const unread = useMemo(() => {
    const list = q.data || [];
    return list.filter((x) => !x.isRead).length;
  }, [q.data]);

  const projectLabel = activeProjectId
    ? `Active: ${activeProjectName || activeProjectId}`
    : "No active project";

  // ✅ Option A: sidebar links go to the project workspace tab
  const stockTo = activeProjectId
    ? `/app/projects/${activeProjectId}?tab=stock`
    : "#";
  const toolsTo = activeProjectId
    ? `/app/projects/${activeProjectId}?tab=tools`
    : "#";
  const billingTo = activeProjectId
    ? `/app/projects/${activeProjectId}?tab=billing`
    : "#";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-3">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="text-lg font-extrabold text-slate-900">
              Chantier
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {user?.name ? `Signed in as ${user.name}` : "Workspace"}
            </div>

            <div className="mt-2 text-xs font-semibold text-slate-700">
              {projectLabel}
            </div>

            {!activeProjectId ? (
              <div className="text-xs text-slate-500 mt-1">
                Open a project to activate the workspace.
              </div>
            ) : null}
          </div>

          <nav className="space-y-2">
            <AppNavItem to="/app" label="Dashboard" />
            <AppNavItem to="/app/projects" label="Projects" />
            <AppNavItem
              to="/app/notifications"
              label="Notifications"
              badge={unread}
            />
            <AppNavItem to="/app/search" label="Search" />

            {/* ✅ Option A: go to workspace tabs */}
            <AppNavItem
              to={stockTo}
              label="Stock"
              disabled={!activeProjectId}
            />
            <AppNavItem
              to={toolsTo}
              label="Tools"
              disabled={!activeProjectId}
            />
            <AppNavItem
              to={billingTo}
              label="Billing"
              disabled={!activeProjectId}
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
