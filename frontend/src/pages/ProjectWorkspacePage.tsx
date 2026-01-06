// src/pages/ProjectWorkspacePage.tsx
import { useMemo, useState } from "react";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import EmptyState from "../components/EmptyState";
import PlansPanel from "../features/plans/components/PlansPanel";
import NcPanel from "../features/nc/components/NcPanel";
import ProgressPanel from "../features/progress/components/ProgressPanel";

import { useProjectStore } from "../store/projectStore";

// reuse same pages used by sidebar routes
import StockPage from "./StockPage";
import ToolsPage from "./ToolsPage";
import BillingPage from "./BillingPage";

type TabKey = "plans" | "nc" | "progress" | "stock" | "tools" | "billing";

function TabPill({
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
        "whitespace-nowrap rounded-xl px-3 py-2 text-sm font-bold transition border",
        isActive
          ? "bg-primary text-primaryForeground border-transparent"
          : "bg-card border-border hover:bg-muted",
      ].join(" ")}
      end
    >
      {label}
    </NavLink>
  );
}

export default function ProjectWorkspacePage() {
  const { t } = useTranslation();
  const location = useLocation();
  const params = useParams();

  // route param (source of truth)
  const routeProjectId = params.projectId;

  // store (fallback)
  const storeProjectId = useProjectStore((s) => s.activeProjectId);
  const storeProjectName = useProjectStore((s) => s.activeProjectName);
  const setActiveProject = useProjectStore((s) => s.setActiveProject);

  // use route first, fallback to store
  const projectId = routeProjectId || storeProjectId;
  const projectName = storeProjectName;

  // tab from query string
  const tab = useMemo<TabKey>(() => {
    const q = new URLSearchParams(location.search);
    const raw = (q.get("tab") || "plans") as TabKey;
    const allowed: TabKey[] = [
      "plans",
      "nc",
      "progress",
      "stock",
      "tools",
      "billing",
    ];
    return allowed.includes(raw) ? raw : "plans";
  }, [location.search]);

  const [activeTab, setActiveTab] = useState<TabKey>(tab);
  if (activeTab !== tab) setActiveTab(tab);

  if (!projectId) {
    return (
      <EmptyState
        title={t("workspace.noProjectSelectedTitle")}
        subtitle={t("workspace.noProjectSelectedSubtitle")}
        action={
          <Link to="/app/projects" className="btn-primary">
            {t("workspace.goToProjects")}
          </Link>
        }
      />
    );
  }

  // tabs stay inside /app/projects/:projectId
  const base = `/app/projects/${projectId}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold truncate">
              {projectName || t("workspace.title")}
            </h1>
            <p className="mt-1 text-sm text-mutedForeground">
              {t("workspace.subtitle")}
              <span className="mx-2">•</span>
              <span className="font-semibold text-foreground">
                {t("workspace.projectIdLabel")} {projectId}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/app/projects" className="btn-outline">
              {t("workspace.changeProject")}
            </Link>

            {/* optional: “set active” when route project differs */}
            {routeProjectId && storeProjectId !== routeProjectId ? (
              <button
                className="btn-primary"
                type="button"
                onClick={() =>
                  setActiveProject({ id: projectId, name: projectName })
                }
              >
                {t("workspace.setActive")}
              </button>
            ) : null}
          </div>
        </div>

        {/* Tabs (sticky inside page) */}
        <div className="mt-4 -mx-2 px-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <TabPill
              to={`${base}?tab=plans`}
              label={t("workspace.tabs.plans")}
              isActive={activeTab === "plans"}
              onClick={() => setActiveTab("plans")}
            />
            <TabPill
              to={`${base}?tab=nc`}
              label={t("workspace.tabs.nc")}
              isActive={activeTab === "nc"}
              onClick={() => setActiveTab("nc")}
            />
            <TabPill
              to={`${base}?tab=progress`}
              label={t("workspace.tabs.progress")}
              isActive={activeTab === "progress"}
              onClick={() => setActiveTab("progress")}
            />
            <TabPill
              to={`${base}?tab=stock`}
              label={t("workspace.tabs.stock")}
              isActive={activeTab === "stock"}
              onClick={() => setActiveTab("stock")}
            />
            <TabPill
              to={`${base}?tab=tools`}
              label={t("workspace.tabs.tools")}
              isActive={activeTab === "tools"}
              onClick={() => setActiveTab("tools")}
            />
            <TabPill
              to={`${base}?tab=billing`}
              label={t("workspace.tabs.billing")}
              isActive={activeTab === "billing"}
              onClick={() => setActiveTab("billing")}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === "plans" && <PlansPanel projectId={projectId} />}

      {activeTab === "nc" && <NcPanel projectId={projectId} />}

      {activeTab === "progress" && <ProgressPanel projectId={projectId} />}

      {/* reuse real pages */}
      {activeTab === "stock" && <StockPage />}
      {activeTab === "tools" && <ToolsPage />}
      {activeTab === "billing" && <BillingPage />}
    </div>
  );
}
