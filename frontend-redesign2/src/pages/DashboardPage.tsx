import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useTranslation } from "react-i18next";

import EmptyState from "../components/EmptyState";
import KpiCard from "../components/KpiCard";
import SectionCard from "../components/SectionCard";
import { useProjectStore } from "../store/projectStore";
import { useDashboardOverview } from "../features/dashboard/hooks/useDashboardOverview";

function money(n: number) {
  const x = Number(n || 0);
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(x);
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setActiveProject = useProjectStore((s) => s.setActiveProject);
  const activeProjectId = useProjectStore((s) => s.activeProjectId);

  const q = useDashboardOverview();
  const [search, setSearch] = useState("");

  const filteredProjects = useMemo(() => {
    const list = q.data?.projects || [];
    const s = search.trim().toLowerCase();
    if (!s) return list;
    return list.filter((p) => (p.name || "").toLowerCase().includes(s));
  }, [q.data?.projects, search]);

  if (q.isLoading) {
    return (
      <div className="space-y-4">
        <div className="card p-5">
          <div className="h-6 w-48 bg-muted rounded-xl animate-pulse" />
          <div className="mt-3 h-4 w-72 bg-muted rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-4">
              <div className="h-4 w-24 bg-muted rounded-xl animate-pulse" />
              <div className="mt-3 h-7 w-16 bg-muted rounded-xl animate-pulse" />
              <div className="mt-2 h-3 w-28 bg-muted rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (q.isError) {
    return (
      <EmptyState
        title={t("dashboard.errorTitle")}
        subtitle={t("dashboard.errorSubtitle")}
        action={
          <button onClick={() => q.refetch()} className="btn-primary">
            {t("common.retry")}
          </button>
        }
      />
    );
  }

  const data = q.data!;
  const totals = data.totals;

  if (totals.projects === 0) {
    return (
      <EmptyState
        title={t("dashboard.noProjectsTitle")}
        subtitle={t("dashboard.noProjectsSubtitle")}
        action={
          <Link to="/app/projects" className="btn-primary">
            {t("dashboard.goToProjects")}
          </Link>
        }
      />
    );
  }

  const pieNc = [
    { name: t("dashboard.ncOpen"), value: totals.ncOpen },
    { name: t("dashboard.ncInProgress"), value: totals.ncInProgress },
    { name: t("dashboard.ncValidated"), value: totals.ncValidated },
  ];

  const barInvoices = Object.entries(data.invoicesByStatus).map(
    ([status, v]) => ({
      status,
      count: v.count,
      amount: v.totalAmount,
    })
  );

  const totalInvoiced = Object.values(data.invoicesByStatus).reduce(
    (sum, r) => sum + (r.totalAmount || 0),
    0
  );

  return (
    <div className="page-container py-6 lg:py-8">
      <div className="section">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="h1">
              {t("dashboard.title")}
            </h1>
            <p className="text-sm text-muted-fg mt-2">
              {t("dashboard.overview")} ·{" "}
              <span className="font-semibold text-foreground">
                {totals.projects}{" "}
                {t(
                  totals.projects === 1
                    ? "dashboard.project"
                    : "dashboard.projects"
                )}
              </span>
            </p>
          </div>

          <Link to="/app/projects" className="btn btn-primary whitespace-nowrap">
            {t("dashboard.manageProjects")}
          </Link>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-responsive">
          <KpiCard
            label={t("dashboard.kpiNcTotal")}
            value={totals.ncTotal}
            hint={`${t("dashboard.ncOpen")}: ${totals.ncOpen}`}
          />
          <KpiCard
            label={t("dashboard.kpiStockQty")}
            value={totals.stockTotalQty}
            hint={t("dashboard.kpiStockHint")}
          />
          <KpiCard
            label={t("dashboard.kpiToolsAssigned")}
            value={totals.toolsAssigned}
            hint={t("dashboard.kpiToolsHint")}
          />
          <KpiCard
            label={t("dashboard.kpiInvoicesPaid")}
            value={totals.invoicesPaid}
            hint={`${t("dashboard.kpiInvoicesTotal")}: ${totals.invoicesTotal}`}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-responsive">
        <SectionCard title={t("dashboard.chartNcTitle")}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieNc}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title={t("dashboard.chartInvoicesTitle")}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barInvoices}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Global Milestones */}
      <SectionCard title={t("dashboard.milestonesTitle")}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm text-mutedForeground">
            {t("dashboard.completed")}{" "}
            <span className="font-semibold text-foreground">
              {totals.milestonesCompleted}/{totals.milestonesTotal}
            </span>
          </div>

          <div className="text-sm text-mutedForeground">
            {t("dashboard.rate")}{" "}
            <span className="font-semibold text-foreground">
              {totals.milestonesCompletionRate}%
            </span>
          </div>

          <div className="text-sm text-mutedForeground">
            {t("dashboard.totalInvoiced")}{" "}
            <span className="font-semibold text-foreground">
              {money(totalInvoiced)}
            </span>
          </div>
        </div>

        <div className="mt-4 h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary"
            style={{ width: `${totals.milestonesCompletionRate}%` }}
          />
        </div>
      </SectionCard>

        {/* Projects List */}
        <SectionCard
          title={t("dashboard.projectsTitle")}
          right={
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("dashboard.searchPlaceholder")}
              className="input w-full sm:w-64 lg:w-80"
            />
          }
        >
        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted p-6 text-center">
            <div className="text-sm font-extrabold">
              {t("dashboard.noResultsTitle")}
            </div>
            <div className="mt-1 text-xs text-mutedForeground">
              {t("dashboard.noResultsSubtitle")}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((p) => {
              const isActive = activeProjectId === p._id;

              return (
                <div key={p._id} className="card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-bold text-foreground truncate">
                          {p.name}
                        </h3>
                        {isActive ? (
                          <span className="badge-primary">{t("dashboard.active")}</span>
                        ) : null}
                        <span className="badge-primary">{p.status}</span>
                      </div>

                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          className="btn-outline"
                          onClick={() =>
                            navigate(`/app/projects/${p._id}?tab=plans`)
                          }
                        >
                          {t("dashboard.openWorkspace")}
                        </button>

                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => {
                            setActiveProject({ id: p._id, name: p.name });
                            navigate(`/app/projects/${p._id}?tab=plans`);
                          }}
                        >
                          {t("dashboard.setActive")}
                        </button>
                      </div>
                    </div>

                    <div className="min-w-[280px]">
                      <div className="text-xs font-semibold text-mutedForeground uppercase tracking-wide">
                        {t("dashboard.progress")}
                      </div>
                      <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                          style={{ width: `${p.milestones.completionRate}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-mutedForeground">
                        <span className="font-semibold text-foreground">
                          {p.milestones.completed}/{p.milestones.total}
                        </span>{" "}
                        · {p.milestones.completionRate}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-xl border border-border bg-gradient-to-br from-background to-muted p-4">
                      <div className="text-xs font-semibold text-mutedForeground uppercase tracking-wide">
                        {t("dashboard.cardNcOpen")}
                      </div>
                      <div className="mt-2 text-2xl font-bold text-foreground">
                        {p.nc.open}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-gradient-to-br from-background to-muted p-4">
                      <div className="text-xs font-semibold text-mutedForeground uppercase tracking-wide">
                        {t("dashboard.cardStockQty")}
                      </div>
                      <div className="mt-2 text-2xl font-bold text-foreground">
                        {p.stock.totalQty}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-gradient-to-br from-background to-muted p-4">
                      <div className="text-xs font-semibold text-mutedForeground uppercase tracking-wide">
                        {t("dashboard.cardInvoicesPaid")}
                      </div>
                      <div className="mt-2 text-2xl font-bold text-foreground">
                        {p.invoices.paid}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-gradient-to-br from-background to-muted p-4">
                      <div className="text-xs font-semibold text-mutedForeground uppercase tracking-wide">
                        {t("dashboard.cardToolsAssigned")}
                      </div>
                      <div className="mt-2 text-2xl font-bold text-foreground">
                        {p.tools.assigned}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
