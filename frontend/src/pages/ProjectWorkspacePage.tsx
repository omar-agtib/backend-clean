// src/pages/ProjectWorkspacePage.tsx
import { useMemo, useState } from "react";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";

import EmptyState from "../components/EmptyState";
import PlansPanel from "../features/plans/components/PlansPanel";
import { useProjectStore } from "../store/projectStore";
import NcPanel from "../features/nc/components/NcPanel";

type TabKey = "plans" | "nc" | "progress" | "stock" | "tools" | "billing";

function Tab({
  to,
  label,
  isActive,
  onClick,
}: {
  to: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={[
        "px-3 py-2 rounded-xl text-sm font-semibold transition",
        isActive
          ? "bg-slate-900 text-white"
          : "bg-slate-100 hover:bg-slate-200 text-slate-900",
      ].join(" ")}
    >
      {label}
    </NavLink>
  );
}

export default function ProjectWorkspacePage() {
  const location = useLocation();
  const params = useParams();

  // ✅ route param (source of truth)
  const routeProjectId = params.projectId;

  // ✅ store (optional nice-to-have for showing name)
  const storeProjectId = useProjectStore((s) => s.activeProjectId);
  const storeProjectName = useProjectStore((s) => s.activeProjectName);

  // ✅ use route first, fallback to store
  const projectId = routeProjectId || storeProjectId;
  const projectName = storeProjectName;

  // ✅ tab from query string
  const tab: TabKey = useMemo(() => {
    const p = new URLSearchParams(location.search);
    const t = (p.get("tab") || "plans") as TabKey;
    const allowed: TabKey[] = [
      "plans",
      "nc",
      "progress",
      "stock",
      "tools",
      "billing",
    ];
    return allowed.includes(t) ? t : "plans";
  }, [location.search]);

  const [activeTab, setActiveTab] = useState<TabKey>(tab);
  if (activeTab !== tab) setActiveTab(tab);

  if (!projectId) {
    return (
      <EmptyState
        title="No project selected"
        subtitle="Go to Projects and open a project workspace."
        action={
          <Link
            to="/app/projects"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Go to Projects
          </Link>
        }
      />
    );
  }

  // ✅ IMPORTANT: tabs must stay inside /app/projects/:projectId
  const base = `/app/projects/${projectId}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Workspace</h1>
          <p className="text-sm text-slate-600 mt-1">
            Project ·{" "}
            <span className="font-medium text-slate-900">
              {projectName || projectId}
            </span>
          </p>
        </div>

        <Link
          to="/app/projects"
          className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900"
        >
          Change Project
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <Tab
          to={`${base}?tab=plans`}
          label="Plans"
          isActive={activeTab === "plans"}
          onClick={() => setActiveTab("plans")}
        />
        <Tab
          to={`${base}?tab=nc`}
          label="NC"
          isActive={activeTab === "nc"}
          onClick={() => setActiveTab("nc")}
        />
        <Tab
          to={`${base}?tab=progress`}
          label="Progress"
          isActive={activeTab === "progress"}
          onClick={() => setActiveTab("progress")}
        />
        <Tab
          to={`${base}?tab=stock`}
          label="Stock"
          isActive={activeTab === "stock"}
          onClick={() => setActiveTab("stock")}
        />
        <Tab
          to={`${base}?tab=tools`}
          label="Tools"
          isActive={activeTab === "tools"}
          onClick={() => setActiveTab("tools")}
        />
        <Tab
          to={`${base}?tab=billing`}
          label="Billing"
          isActive={activeTab === "billing"}
          onClick={() => setActiveTab("billing")}
        />
      </div>

      {/* Content */}
      {activeTab === "plans" && <PlansPanel projectId={projectId} />}

      {activeTab === "nc" && <NcPanel projectId={projectId} />}

      {activeTab === "progress" && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="font-semibold text-slate-900">
            Progress (Coming next)
          </div>
          <div className="text-sm text-slate-600 mt-1">
            Milestones list + update progress + project summary.
          </div>
        </div>
      )}

      {activeTab === "stock" && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="font-semibold text-slate-900">
            Stock (Coming next)
          </div>
          <div className="text-sm text-slate-600 mt-1">
            Products + stock items + movements + adjust IN/OUT.
          </div>
        </div>
      )}

      {activeTab === "tools" && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="font-semibold text-slate-900">
            Tools (Coming next)
          </div>
          <div className="text-sm text-slate-600 mt-1">
            Inventory + assignments + maintenance history.
          </div>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="font-semibold text-slate-900">
            Billing (Coming next)
          </div>
          <div className="text-sm text-slate-600 mt-1">
            Invoices list + create + pay + summary.
          </div>
        </div>
      )}
    </div>
  );
}
