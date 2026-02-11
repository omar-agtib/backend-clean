'use client';

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t("dashboard.title")}
          </h1>
          <p className="text-base text-mutedForeground mt-2">
            {t("dashboard.overview")} · 
            <span className="font-semibold text-foreground ml-1">
              {totals.projects}{" "}
              {t(
                totals.projects === 1
                  ? "dashboard.project"
                  : "dashboard.projects"
              )}
            </span>
          </p>
        </div>

        <Link to="/app/projects" className="btn-primary">
          {t("dashboard.manageProjects")}
        </Link>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title={t("dashboard.chartNcTitle")} className="card-elevated">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieNc}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  innerRadius={40}
                  paddingAngle={2}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title={t("dashboard.chartInvoicesTitle")} className="card-elevated">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barInvoices}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="status" stroke="hsl(var(--muted-fg))" />
                <YAxis stroke="hsl(var(--muted-fg))" />
                <Tooltip />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Global Milestones */}
      <SectionCard title={t("dashboard.milestonesTitle")} className="card-elevated">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <div className="text-xs font-bold text-mutedForeground uppercase tracking-wide">
              {t("dashboard.completed")}
            </div>
            <div className="mt-2 text-3xl font-bold text-primary">
              {totals.milestonesCompleted}
              <span className="text-sm font-semibold text-mutedForeground ml-2">
                / {totals.milestonesTotal}
              </span>
            </div>
          </div>

          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <div className="text-xs font-bold text-mutedForeground uppercase tracking-wide">
              {t("dashboard.rate")}
            </div>
            <div className="mt-2 text-3xl font-bold text-accent">
              {totals.milestonesCompletionRate}%
            </div>
          </div>

          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <div className="text-xs font-bold text-mutedForeground uppercase tracking-wide">
              {t("dashboard.totalInvoiced")}
            </div>
            <div className="mt-2 text-3xl font-bold text-success">
              {money(totalInvoiced)}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-mutedForeground font-semibold">Progress</span>
            <span className="text-xs text-foreground font-bold">{totals.milestonesCompletionRate}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{ width: `${totals.milestonesCompletionRate}%` }}
            />
          </div>
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
            className="input"
          />
        }
        className="card-elevated"
      >
        {filteredProjects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
            <div className="text-base font-bold text-foreground">
              {t("dashboard.noResultsTitle")}
            </div>
            <div className="mt-2 text-sm text-mutedForeground">
              {t("dashboard.noResultsSubtitle")}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredProjects.map((p) => {
              const isActive = activeProjectId === p._id;

              return (
                <div key={p._id} className="bg-muted/10 border border-border rounded-xl p-6 hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-bold text-foreground">
                          {p.name}
                        </h3>
                        {isActive ? (
                          <span className="chip bg-success/20 border-success/30 text-success font-bold">
                            {t("dashboard.active")}
                          </span>
                        ) : null}
                        <span className="chip bg-primary/20 border-primary/30 text-primary font-bold">
                          {p.status}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-3 flex-wrap">
                        <button
                          type="button"
                          className="btn-outline text-sm"
                          onClick={() =>
                            navigate(`/app/projects/${p._id}?tab=plans`)
                          }
                        >
                          {t("dashboard.openWorkspace")}
                        </button>

                        <button
                          type="button"
                          className="btn-primary text-sm"
                          onClick={() => {
                            setActiveProject({ id: p._id, name: p.name });
                            navigate(`/app/projects/${p._id}?tab=plans`);
                          }}
                        >
                          {t("dashboard.setActive")}
                        </button>
                      </div>
                    </div>

                    <div className="w-full md:w-80">
                      <div className="text-xs font-bold text-mutedForeground uppercase tracking-wide mb-2">
                        {t("dashboard.progress")}
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                          style={{ width: `${p.milestones.completionRate}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-mutedForeground flex justify-between">
                        <span className="font-semibold text-foreground">
                          {p.milestones.completed}/{p.milestones.total}
                        </span>
                        <span>{p.milestones.completionRate}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-lg border border-border bg-primary/5 p-4">
                      <div className="text-xs font-bold text-mutedForeground uppercase tracking-wide">
                        {t("dashboard.cardNcOpen")}
                      </div>
                      <div className="mt-2 text-2xl font-bold text-primary">
                        {p.nc.open}
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-accent/5 p-4">
                      <div className="text-xs font-bold text-mutedForeground uppercase tracking-wide">
                        {t("dashboard.cardStockQty")}
                      </div>
                      <div className="mt-2 text-2xl font-bold text-accent">
                        {p.stock.totalQty}
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-success/5 p-4">
                      <div className="text-xs font-bold text-mutedForeground uppercase tracking-wide">
                        {t("dashboard.cardInvoicesPaid")}
                      </div>
                      <div className="mt-2 text-2xl font-bold text-success">
                        {p.invoices.paid}
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-warning/5 p-4">
                      <div className="text-xs font-bold text-mutedForeground uppercase tracking-wide">
                        {t("dashboard.cardToolsAssigned")}
                      </div>
                      <div className="mt-2 text-2xl font-bold text-warning">
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
  );
}
