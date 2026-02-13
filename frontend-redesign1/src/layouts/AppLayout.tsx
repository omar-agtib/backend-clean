// src/layouts/AppLayout.tsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { useNotifications } from "../features/notifications/hooks/useNotifications";
import { useNotificationsRealtime } from "../features/notifications/hooks/useNotificationsRealtime";
import { useAuthStore } from "../store/auth.store";
import { useProjectStore } from "../store/projectStore";
import { token } from "../lib/token";
import ToastHost from "../components/ToastHost";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";
import NotificationBell from "../components/NotificationBell";
import UserMenu from "../components/UserMenu";
import { cn } from "../lib/cn";

function TopNavItem({
  to,
  label,
  icon: Icon,
}: {
  to: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 px-3 py-2 text-sm font-medium transition duration-200 rounded-lg relative",
          isActive
            ? "text-primary"
            : "text-foreground hover:text-primary"
        )
      }
      end
    >
      {({ isActive }) => (
        <>
          {Icon && <Icon className="h-4 w-4" />}
          <span>{label}</span>
          {isActive && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function AppLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  function logout() {
    token.clear();
    clear();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <ToastHost />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          {/* Left: Logo & Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-primary text-primaryForeground flex items-center justify-center font-bold text-lg shadow-soft flex-shrink-0">
              C
            </div>
            <div className="min-w-0 hidden sm:block">
              <div className="text-sm font-semibold text-foreground">
                Chantier
              </div>
              {activeProjectId && (
                <div className="text-xs text-mutedForeground truncate">
                  {activeProjectName || "Project"}
                </div>
              )}
            </div>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            <TopNavItem to="/app" label="Dashboard" />
            <TopNavItem to="/app/projects" label="Projects" />
            <TopNavItem to="/app/search" label="Search" />
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <NotificationBell unreadCount={unread} />
            <LanguageToggle />
            <ThemeToggle />
            <UserMenu
              email={user?.email}
              name={user?.name}
              onLogout={logout}
            />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-card border border-border hover:bg-muted transition duration-200"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border px-4 py-3 bg-card">
            <nav className="grid gap-2">
              <NavLink
                to="/app"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition duration-200",
                    isActive
                      ? "bg-primary text-primaryForeground"
                      : "text-foreground hover:bg-muted"
                  )
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/app/projects"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition duration-200",
                    isActive
                      ? "bg-primary text-primaryForeground"
                      : "text-foreground hover:bg-muted"
                  )
                }
              >
                Projects
              </NavLink>
              <NavLink
                to="/app/search"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition duration-200",
                    isActive
                      ? "bg-primary text-primaryForeground"
                      : "text-foreground hover:bg-muted"
                  )
                }
              >
                Search
              </NavLink>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-background">
        <Outlet />
      </main>
    </div>
  );
}
