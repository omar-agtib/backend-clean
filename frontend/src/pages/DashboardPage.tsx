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
        <div className="h-10 w-64 rounded-xl bg-slate-200 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-slate-200 animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-80 rounded-2xl bg-slate-200 animate-pulse" />
          <div className="h-80 rounded-2xl bg-slate-200 animate-pulse" />
        </div>
        <div className="h-80 rounded-2xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  if (q.isError) {
    return (
      <EmptyState
        title="Dashboard failed"
        subtitle={
          (q.error as any)?.response?.data?.message ||
          (q.error as Error).message
        }
        action={
          <button
            onClick={() => q.refetch()}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Retry
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
        title="No projects yet"
        subtitle="Create your first project to start tracking progress, stock, tools, and billing."
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

  const pieNc = [
    { name: "Open", value: totals.ncOpen },
    { name: "In Progress", value: totals.ncInProgress },
    { name: "Validated", value: totals.ncValidated },
  ];

  const barInvoices = Object.entries(data.invoicesByStatus).map(
    ([status, v]) => ({
      status,
      count: v.count,
      amount: v.totalAmount,
    })
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600 mt-1">
            Global overview ·{" "}
            <span className="font-medium text-slate-900">
              {totals.projects} project{totals.projects === 1 ? "" : "s"}
            </span>
          </p>
        </div>

        <Link
          to="/app/projects"
          className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900"
        >
          Manage Projects
        </Link>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          label="NC Total"
          value={totals.ncTotal}
          hint={`Open: ${totals.ncOpen}`}
        />
        <KpiCard
          label="Stock Qty"
          value={totals.stockTotalQty}
          hint="Total quantity"
        />
        <KpiCard
          label="Tools Assigned"
          value={totals.toolsAssigned}
          hint="Active assignments"
        />
        <KpiCard
          label="Invoices Paid"
          value={totals.invoicesPaid}
          hint={`Total: ${totals.invoicesTotal}`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Non-Conformities (Global Status)">
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

        <SectionCard title="Invoices by Status (Global Amount)">
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
      <SectionCard title="Milestones (Global Progress)">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm text-slate-700">
            Completed:{" "}
            <span className="font-semibold text-slate-900">
              {totals.milestonesCompleted}/{totals.milestonesTotal}
            </span>
          </div>

          <div className="text-sm text-slate-700">
            Rate:{" "}
            <span className="font-semibold text-slate-900">
              {totals.milestonesCompletionRate}%
            </span>
          </div>

          <div className="text-sm text-slate-700">
            Total invoiced:{" "}
            <span className="font-semibold text-slate-900">
              {money(
                Object.values(data.invoicesByStatus).reduce(
                  (sum, r) => sum + (r.totalAmount || 0),
                  0
                )
              )}
            </span>
          </div>
        </div>

        <div className="mt-3 h-3 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-slate-900"
            style={{ width: `${totals.milestonesCompletionRate}%` }}
          />
        </div>
      </SectionCard>

      {/* Projects List */}
      <SectionCard
        title="Projects"
        right={
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-72 max-w-[55vw] rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        }
      >
        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <div className="text-sm font-semibold text-slate-900">
              No projects found
            </div>
            <div className="mt-1 text-xs text-slate-600">
              Try a different search.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProjects.map((p) => {
              const isActive = activeProjectId === p._id;

              return (
                <div
                  key={p._id}
                  className={[
                    "rounded-2xl border bg-white p-4",
                    isActive ? "border-slate-900" : "border-slate-200",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="text-base font-extrabold text-slate-900">
                        {p.name}
                        {isActive ? (
                          <span className="ml-2 inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-xs font-bold text-white">
                            ACTIVE
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        Status:{" "}
                        <span className="font-semibold text-slate-900">
                          {p.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-900"
                        onClick={() =>
                          navigate(`/app/projects/${p._id}?tab=plans`)
                        }
                      >
                        Open Workspace
                      </button>

                      <button
                        type="button"
                        className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                        onClick={() => {
                          setActiveProject({ id: p._id, name: p.name });
                          navigate(`/app/projects/${p._id}?tab=plans`);
                        }}
                      >
                        Set Active
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="rounded-2xl border border-slate-200 p-3">
                      <div className="text-xs font-semibold text-slate-500">
                        Progress
                      </div>
                      <div className="mt-1 text-xl font-extrabold text-slate-900">
                        {p.milestones.completionRate}%
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-slate-900"
                          style={{
                            width: `${p.milestones.completionRate}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-3">
                      <div className="text-xs font-semibold text-slate-500">
                        NC Open
                      </div>
                      <div className="mt-1 text-xl font-extrabold text-slate-900">
                        {p.nc.open}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-3">
                      <div className="text-xs font-semibold text-slate-500">
                        Stock Qty
                      </div>
                      <div className="mt-1 text-xl font-extrabold text-slate-900">
                        {p.stock.totalQty}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-3">
                      <div className="text-xs font-semibold text-slate-500">
                        Tools Assigned
                      </div>
                      <div className="mt-1 text-xl font-extrabold text-slate-900">
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
