import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Menu, X, LayoutGrid, Search, Bell, Settings } from 'lucide-react';
import { useNotifications } from '../features/notifications/hooks/useNotifications';
import { useNotificationsRealtime } from '../features/notifications/hooks/useNotificationsRealtime';
import { useAuthStore } from '../store/auth.store';
import { useProjectStore } from '../store/projectStore';
import { token } from '../lib/token';
import ToastHost from '../components/ToastHost';
import ThemeToggle from '../components/ThemeToggle';
import LanguageToggle from '../components/LanguageToggle';
import Dropdown from '../components/Dropdown';
import { cn } from '../lib/cn';

export default function AppLayout() {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const activeProjectId = useProjectStore((s) => s.activeProjectId);
  const activeProjectName = useProjectStore((s) => s.activeProjectName);

  // Real-time notifications
  useNotificationsRealtime(user?._id || null);

  const notificationsQuery = useNotifications({ limit: 100 });
  const unreadCount = useMemo(() => {
    const list = notificationsQuery.data || [];
    return list.filter((x) => !x.isRead).length;
  }, [notificationsQuery.data]);

  const handleLogout = () => {
    token.clear();
    clear();
    navigate('/login', { replace: true });
  };

  // Navigation items
  const navItems = [
    { to: '/app', label: 'Dashboard', icon: LayoutGrid },
    { to: '/app/projects', label: 'Projects', icon: null },
    { to: '/app/search', label: 'Search', icon: Search },
  ];

  const userMenuItems = [
    {
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      onClick: () => {
        // TODO: Navigate to settings
      },
    },
    {
      label: 'Logout',
      icon: null,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <ToastHost />

      {/* Top Navigation Bar - Enterprise Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="h-16 px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-4">
          {/* Left: Logo & Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate('/app')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
            >
              <div className="h-10 w-10 rounded-lg bg-primary text-primary-fg flex items-center justify-center font-bold text-lg flex-shrink-0">
                C
              </div>
              <div className="hidden sm:block min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">
                  Chantier
                </div>
                {activeProjectId && (
                  <div className="text-xs text-muted-fg truncate">
                    {activeProjectName || 'Project'}
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-fg hover:text-foreground'
                  )
                }
                end
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 justify-end">
            {/* Notifications Bell */}
            <button
              onClick={() => navigate('/app/notifications')}
              className="relative h-10 w-10 rounded-md hover:bg-muted transition-colors duration-200 flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-error text-white text-xs flex items-center justify-center font-semibold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Toggle */}
            <LanguageToggle />

            {/* User Menu */}
            <Dropdown
              trigger={
                <div className="h-10 w-10 rounded-md bg-muted hover:bg-muted/80 transition-colors duration-200 flex items-center justify-center text-sm font-semibold cursor-pointer">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              }
              items={userMenuItems}
              align="right"
            />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden h-10 w-10 rounded-md hover:bg-muted transition-colors duration-200 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileNavOpen && (
          <div className="md:hidden border-t border-border bg-card/50 backdrop-blur-sm">
            <nav className="px-3 py-2 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200',
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-foreground hover:bg-muted'
                    )
                  }
                  end
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
