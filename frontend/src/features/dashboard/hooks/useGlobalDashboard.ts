// src/features/dashboard/hooks/useGlobalDashboard.ts
import { useMemo } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { http } from "../../../lib/http";

export type Project = {
  _id: string;
  name: string;
  description?: string;
  status?: string;
};

export type ProjectDashboard = {
  projectId: string;

  nc: {
    total: number;
    open: number;
    inProgress: number;
    validated: number;
    lastUpdatedAt: string | null;
  };
  milestones: {
    total: number;
    completed: number;
    remaining: number;
    completionRate: number;
    lastUpdatedAt: string | null;
  };
  stock: { totalQty: number };
  tools: { assigned: number };
  invoices: {
    total: number;
    paid: number;
    unpaid: number;
    amounts: { totalAmount: number; paidAmount: number; unpaidAmount: number };
    byStatus: {
      DRAFT: { count: number; totalAmount: number };
      SENT: { count: number; totalAmount: number };
      PAID: { count: number; totalAmount: number };
      CANCELLED: { count: number; totalAmount: number };
    };
  };
};

async function listMyProjects() {
  const { data } = await http.get<Project[]>(`/projects`);
  return data;
}

async function getProjectDashboard(projectId: string) {
  const { data } = await http.get<ProjectDashboard>(
    `/dashboard/project/${projectId}`
  );
  return data;
}

function safeNum(n: any) {
  const x = Number(n);
  return Number.isFinite(x) ? x : 0;
}

export function useGlobalDashboard() {
  // 1) load projects
  const projectsQuery = useQuery({
    queryKey: ["projects", "mine"],
    queryFn: listMyProjects,
    staleTime: 10_000,
  });

  const projects = projectsQuery.data || [];

  // 2) dashboards per project
  const dashQueries = useQueries({
    queries: projects.map((p) => ({
      queryKey: ["dashboard", "project", p._id],
      queryFn: () => getProjectDashboard(p._id),
      enabled: !!p._id,
      staleTime: 10_000,
    })),
  });

  const isLoading =
    projectsQuery.isLoading ||
    (projects.length > 0 && dashQueries.some((q) => q.isLoading));

  const isError = projectsQuery.isError || dashQueries.some((q) => q.isError);

  const error =
    (projectsQuery.error as any) || dashQueries.find((q) => q.error)?.error;

  const dashboards = dashQueries
    .map((q) => q.data)
    .filter(Boolean) as ProjectDashboard[];

  // Map for quick lookup
  const dashByProjectId = useMemo(() => {
    const m: Record<string, ProjectDashboard> = {};
    for (const d of dashboards) m[d.projectId] = d;
    return m;
  }, [dashboards]);

  // 3) compute global aggregates
  const global = useMemo(() => {
    const agg = {
      projectsCount: projects.length,

      nc: { total: 0, open: 0, inProgress: 0, validated: 0 },

      stock: { totalQty: 0 },

      tools: { assigned: 0 },

      invoices: {
        total: 0,
        paid: 0,
        unpaid: 0,
        amounts: { totalAmount: 0, paidAmount: 0, unpaidAmount: 0 },
        byStatus: {
          DRAFT: { count: 0, totalAmount: 0 },
          SENT: { count: 0, totalAmount: 0 },
          PAID: { count: 0, totalAmount: 0 },
          CANCELLED: { count: 0, totalAmount: 0 },
        },
      },

      milestones: {
        total: 0,
        completed: 0,
        remaining: 0,
        // weighted completion rate = completed / total
        completionRate: 0,
      },
    };

    for (const d of dashboards) {
      agg.nc.total += safeNum(d.nc.total);
      agg.nc.open += safeNum(d.nc.open);
      agg.nc.inProgress += safeNum(d.nc.inProgress);
      agg.nc.validated += safeNum(d.nc.validated);

      agg.stock.totalQty += safeNum(d.stock.totalQty);
      agg.tools.assigned += safeNum(d.tools.assigned);

      agg.invoices.total += safeNum(d.invoices.total);
      agg.invoices.paid += safeNum(d.invoices.paid);
      agg.invoices.unpaid += safeNum(d.invoices.unpaid);

      agg.invoices.amounts.totalAmount += safeNum(
        d.invoices.amounts.totalAmount
      );
      agg.invoices.amounts.paidAmount += safeNum(d.invoices.amounts.paidAmount);
      agg.invoices.amounts.unpaidAmount += safeNum(
        d.invoices.amounts.unpaidAmount
      );

      for (const k of ["DRAFT", "SENT", "PAID", "CANCELLED"] as const) {
        agg.invoices.byStatus[k].count += safeNum(
          d.invoices.byStatus[k]?.count
        );
        agg.invoices.byStatus[k].totalAmount += safeNum(
          d.invoices.byStatus[k]?.totalAmount
        );
      }

      agg.milestones.total += safeNum(d.milestones.total);
      agg.milestones.completed += safeNum(d.milestones.completed);
      agg.milestones.remaining += safeNum(d.milestones.remaining);
    }

    agg.milestones.completionRate =
      agg.milestones.total === 0
        ? 0
        : Math.round((agg.milestones.completed / agg.milestones.total) * 100);

    return agg;
  }, [dashboards, projects.length]);

  return {
    projectsQuery,
    projects,
    dashboards,
    dashByProjectId,
    global,
    isLoading,
    isError,
    error,
    refetch: () => {
      projectsQuery.refetch();
      dashQueries.forEach((q) => q.refetch?.());
    },
  };
}
