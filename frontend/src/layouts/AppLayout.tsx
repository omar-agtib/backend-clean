import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { token } from "../lib/token";
import { useMe } from "../features/auth/hooks/useMe";
import LogoMark from "../components/LogoMark";
import { useProjectStore } from "../store/projectStore";

function Item({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "px-3 py-2 rounded-xl text-sm font-medium transition",
          isActive
            ? "bg-slate-900 text-white"
            : "text-slate-700 hover:bg-slate-100",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

export default function AppLayout() {
  const navigate = useNavigate();
  const me = useMe();

  const activeProjectName = useProjectStore((s) => s.activeProjectId);
  const clearActiveProject = useProjectStore((s) => s.clearActiveProject);

  function logout() {
    token.clear();
    clearActiveProject();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoMark className="h-9 w-9 text-slate-900" />
            <div className="leading-tight">
              <div className="font-bold text-slate-900">Chantier Platform</div>
              <div className="text-xs text-slate-500">
                {activeProjectName
                  ? `Project: ${activeProjectName}`
                  : me.data?.email || "No project selected"}
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <Item to="/app" label="Dashboard" />
            <Item to="/app/projects" label="Projects" />
            <Item to="/app/stock" label="Stock" />
            <Item to="/app/tools" label="Tools" />
            <Item to="/app/billing" label="Billing" />
            <button
              onClick={logout}
              className="ml-2 px-3 py-2 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
