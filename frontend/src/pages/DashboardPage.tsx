// src/pages/DashboardPage.tsx
import { Link } from "react-router-dom";
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
import { useProjectDashboard } from "../features/dashboard/hooks/useProjectDashboard";
import { useProjectStore } from "../store/projectStore";

export default function DashboardPage() {
  const activeProjectId = useProjectStore((s) => s.activeProjectId);
  const activeProjectName = useProjectStore((s) => s.activeProjectName);

  // ✅ IMPORTANT: pass projectId as optional, no "!"
  const dash = useProjectDashboard(activeProjectId);

  // ✅ if no project selected → show CTA
  if (!activeProjectId) {
    return (
      <EmptyState
        title="No project selected"
        subtitle="Select a project first (Projects page) then come back here."
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

  if (dash.isLoading) {
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
      </div>
    );
  }

  if (dash.isError) {
    return (
      <EmptyState
        title="Dashboard failed"
        subtitle={
          (dash.error as any)?.response?.data?.message ||
          (dash.error as Error).message
        }
        action={
          <button
            onClick={() => dash.refetch()}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Retry
          </button>
        }
      />
    );
  }

  const data = dash.data!;

  const pieNc = [
    { name: "Open", value: data.nc.open },
    { name: "In Progress", value: data.nc.inProgress },
    { name: "Validated", value: data.nc.validated },
  ];

  const barInvoices = Object.entries(data.invoices.byStatus || {}).map(
    ([status, v]) => ({
      status,
      count: v.count,
      amount: v.totalAmount,
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600 mt-1">
            Project ·{" "}
            <span className="font-medium">
              {activeProjectName || data.projectId}
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          label="NC Total"
          value={data.nc.total}
          hint={`Open: ${data.nc.open}`}
        />
        <KpiCard
          label="Stock Qty"
          value={data.stock.totalQty}
          hint="Total quantity"
        />
        <KpiCard
          label="Tools Assigned"
          value={data.tools.assigned}
          hint="Active assignments"
        />
        <KpiCard
          label="Invoices Paid"
          value={data.invoices.paid}
          hint={`Total: ${data.invoices.total}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Non-Conformities (Status)">
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

        <SectionCard title="Invoices by Status (Amount)">
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

      <SectionCard title="Milestones Progress">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-700">
            Completed:{" "}
            <span className="font-semibold text-slate-900">
              {data.milestones.completed}/{data.milestones.total}
            </span>
          </div>
          <div className="text-sm text-slate-700">
            Rate:{" "}
            <span className="font-semibold text-slate-900">
              {data.milestones.completionRate}%
            </span>
          </div>
        </div>

        <div className="mt-3 h-3 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-slate-900"
            style={{ width: `${data.milestones.completionRate}%` }}
          />
        </div>
      </SectionCard>
    </div>
  );
}
