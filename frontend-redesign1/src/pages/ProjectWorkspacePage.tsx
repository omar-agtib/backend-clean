// src/pages/ProjectWorkspacePage.tsx
import { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FileText,
  CheckSquare,
  AlertCircle,
  Package,
  Wrench,
  DollarSign,
} from "lucide-react";

import EmptyState from "../components/EmptyState";
import ProjectSidebar from "../components/ProjectSidebar";
import PlansPanel from "../features/plans/components/PlansPanel";
import NcPanel from "../features/nc/components/NcPanel";
import ProgressPanel from "../features/progress/components/ProgressPanel";

import { useProjectStore } from "../store/projectStore";

// reuse existing pages
import StockPage from "./StockPage";
import ToolsPage from "./ToolsPage";
import BillingPage from "./BillingPage";

type TabKey = "plans" | "nc" | "progress" | "stock" | "tools" | "billing";

export default function ProjectWorkspacePage() {
  const { t } = useTranslation();
  const location = useLocation();
  const params = useParams();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // -------------------------------
  // Project source of truth
  // -------------------------------
  const routeProjectId = params.projectId;

  const storeProjectId = useProjectStore((s) => s.activeProjectId);
  const storeProjectName = useProjectStore((s) => s.activeProjectName);
  const setActiveProject = useProjectStore((s) => s.setActiveProject);

  const projectId = routeProjectId || storeProjectId;
  const projectName = storeProjectName;

  // -------------------------------
  // Tab from query string
  // -------------------------------
  const tabFromQuery = useMemo<TabKey>(() => {
    const q = new URLSearchParams(location.search);
    const raw = q.get("tab") as TabKey | null;

    const allowed: TabKey[] = [
      "plans",
      "nc",
      "progress",
      "stock",
      "tools",
      "billing",
    ];

    return raw && allowed.includes(raw) ? raw : "plans";
  }, [location.search]);

  const [activeTab, setActiveTab] = useState<TabKey>(tabFromQuery);

  // Sync URL tab -> state
  useEffect(() => {
    setActiveTab(tabFromQuery);
  }, [tabFromQuery]);

  // -------------------------------
  // Sidebar Tabs
  // -------------------------------
  const sidebarTabs = [
    { id: "plans", label: t("workspace.tabs.plans"), icon: FileText },
    { id: "progress", label: t("workspace.tabs.progress"), icon: CheckSquare },
    { id: "nc", label: t("workspace.tabs.nc"), icon: AlertCircle },
    { id: "stock", label: t("workspace.tabs.stock"), icon: Package },
    { id: "tools", label: t("workspace.tabs.tools"), icon: Wrench },
    { id: "billing", label: t("workspace.tabs.billing"), icon: DollarSign },
  ] as const;

  // -------------------------------
  // No project selected
  // -------------------------------
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

  // -------------------------------
  // Render Tab Content
  // -------------------------------
  const renderTabContent = () => {
    switch (activeTab) {
      case "plans":
        return <PlansPanel projectId={projectId} />;

      case "nc":
        return <NcPanel projectId={projectId} />;

      case "progress":
        return <ProgressPanel projectId={projectId} />;

      case "stock":
        return <StockPage />;

      case "tools":
        return <ToolsPage />;

      case "billing":
        return <BillingPage />;

      default:
        return null;
    }
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="flex h-[calc(100vh-73px)] -mx-4">
      {/* Sidebar */}
      <ProjectSidebar
        projectId={projectId}
        projectName={projectName}
        tabs={sidebarTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={sidebarCollapsed}
        onCollapseChange={setSidebarCollapsed}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {projectName || t("workspace.title")}
                </h1>

                <p className="mt-2 text-sm text-mutedForeground">
                  {t("workspace.subtitle")}
                  <span className="mx-2">•</span>
                  <span className="font-medium text-foreground">
                    {t("workspace.projectIdLabel")} {projectId}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Link to="/app/projects" className="btn-outline">
                  {t("workspace.changeProject")}
                </Link>

                {routeProjectId && storeProjectId !== routeProjectId && (
                  <button
                    className="btn-primary"
                    type="button"
                    onClick={() =>
                      setActiveProject({ id: projectId, name: projectName })
                    }
                  >
                    {t("workspace.setActive")}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
