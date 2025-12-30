// src/layouts/AppLayout.tsx
import { NavLink, Outlet } from "react-router-dom";
import { useMemo } from "react";
import { useNotifications } from "../features/notifications/hooks/useNotifications";
import { useNotificationsRealtime } from "../features/notifications/hooks/useNotificationsRealtime";
import { useAuthStore } from "../store/auth.store"; // if you don't have it, tell me + paste your auth store

function AppNavItem({
  to,
  label,
  badge,
}: {
  to: string;
  label: string;
  badge?: number;
}) {
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
  // ✅ assuming you keep auth user in a zustand store
  const user = useAuthStore((s) => s.user); // { _id, name, ... } typical

  // realtime notifications
  useNotificationsRealtime(user?._id || null);

  // fetch notifications (for badge)
  const q = useNotifications({ limit: 100 });

  const unread = useMemo(() => {
    const list = q.data || [];
    return list.filter((x) => !x.isRead).length;
  }, [q.data]);

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
          </div>

          <nav className="space-y-2">
            <AppNavItem to="/app" label="Dashboard" />
            <AppNavItem to="/app/projects" label="Projects" />
            <AppNavItem
              to="/app/notifications"
              label="Notifications"
              badge={unread}
            />
            <AppNavItem to="/app/stock" label="Stock" />
            <AppNavItem to="/app/tools" label="Tools" />
            <AppNavItem to="/app/billing" label="Billing" />
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
