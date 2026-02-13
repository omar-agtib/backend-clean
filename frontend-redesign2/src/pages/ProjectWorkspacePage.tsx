import { useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  CheckSquare,
  AlertCircle,
  Package,
  Wrench,
  DollarSign,
} from 'lucide-react';

import EmptyState from '../components/EmptyState';
import WorkspaceSidebar from '../components/WorkspaceSidebar';
import PlansPanel from '../features/plans/components/PlansPanel';
import NcPanel from '../features/nc/components/NcPanel';
import ProgressPanel from '../features/progress/components/ProgressPanel';

import { useProjectStore } from '../store/projectStore';

// reuse same pages used by sidebar routes
import StockPage from './StockPage';
import ToolsPage from './ToolsPage';
import BillingPage from './BillingPage';

type TabKey = 'plans' | 'nc' | 'progress' | 'stock' | 'tools' | 'billing';

const SIDEBAR_TABS = [
  { id: 'plans', label: 'Plans', icon: <FileText className="h-4 w-4" /> },
  { id: 'progress', label: 'Progress', icon: <CheckSquare className="h-4 w-4" /> },
  { id: 'nc', label: 'Non-Conformities', icon: <AlertCircle className="h-4 w-4" /> },
  { id: 'stock', label: 'Stock', icon: <Package className="h-4 w-4" /> },
  { id: 'tools', label: 'Tools', icon: <Wrench className="h-4 w-4" /> },
  { id: 'billing', label: 'Billing', icon: <DollarSign className="h-4 w-4" /> },
];

export default function ProjectWorkspacePage() {
  const { t } = useTranslation();
  const location = useLocation();
  const params = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    const raw = (q.get('tab') || 'plans') as TabKey;
    const allowed: TabKey[] = [
      'plans',
      'nc',
      'progress',
      'stock',
      'tools',
      'billing',
    ];
    return allowed.includes(raw) ? raw : 'plans';
  }, [location.search]);

  const [activeTab, setActiveTab] = useState<TabKey>(tab);
  if (activeTab !== tab) setActiveTab(tab);

  if (!projectId) {
    return (
      <EmptyState
        title={t('workspace.noProjectSelectedTitle')}
        subtitle={t('workspace.noProjectSelectedSubtitle')}
        action={
          <Link to="/app/projects" className="btn btn-primary">
            {t('workspace.goToProjects')}
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex h-screen flex-col md:flex-row bg-background">
      {/* Workspace Sidebar */}
      <WorkspaceSidebar
        projectName={projectName}
        projectId={projectId}
        tabs={SIDEBAR_TABS as any}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="page-container py-6 lg:py-8">
          <div className="section">
            {/* Project Header */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="h1">
                    {projectName || t('workspace.title')}
                  </h1>
                  <p className="text-sm text-muted-fg mt-2">
                    {t('workspace.subtitle')}
                    <span className="mx-2">•</span>
                    <span className="font-medium text-foreground">
                      {t('workspace.projectIdLabel')} {projectId}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Link
                    to="/app/projects"
                    className="btn btn-outline justify-center sm:justify-start"
                  >
                    {t('workspace.changeProject')}
                  </Link>

                  {routeProjectId && storeProjectId !== routeProjectId ? (
                    <button
                      className="btn btn-primary justify-center"
                      type="button"
                      onClick={() =>
                        setActiveProject({ id: projectId, name: projectName })
                      }
                    >
                      {t('workspace.setActive')}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'plans' && <PlansPanel projectId={projectId} />}
            {activeTab === 'nc' && <NcPanel projectId={projectId} />}
            {activeTab === 'progress' && <ProgressPanel projectId={projectId} />}
            {activeTab === 'stock' && <StockPage />}
            {activeTab === 'tools' && <ToolsPage />}
            {activeTab === 'billing' && <BillingPage />}
          </div>
        </div>
      </main>
    </div>
  );
}
