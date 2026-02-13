"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "@/lib/api/dashboard";
import { StatCard } from "@/components/dashboard/stat-card";
import { LoadingState } from "@/components/common/loading-state";
import {
  FolderOpen,
  CheckCircle2,
  Wrench,
  Package,
  AlertCircle,
  BarChart3,
} from "lucide-react";

export default function DashboardPage() {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardOverview,
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Get an overview of your project management platform
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          subtitle={`${stats.activeProjects} active`}
          icon={FolderOpen}
          href="/projects"
        />
        <StatCard
          title="Active Milestones"
          value={stats.completedProjects}
          subtitle="Completed milestones"
          icon={CheckCircle2}
          href="/progress"
        />
        <StatCard
          title="Tools in Inventory"
          value={stats.totalTools}
          subtitle={`${stats.toolsInUse} in use`}
          icon={Wrench}
          href="/tools"
        />
        <StatCard
          title="Stock Items"
          value={stats.totalStock}
          subtitle={`${stats.lowStockItems} low stock`}
          icon={Package}
          href="/stock"
        />
        <StatCard
          title="Billing"
          value={`$${stats.totalBilling.toLocaleString()}`}
          subtitle={`$${stats.outstandingAmount.toLocaleString()} outstanding`}
          icon={BarChart3}
          href="/billing"
        />
        <StatCard
          title="Open Quality Issues"
          value={stats.openNCRs}
          subtitle="Non-conformities"
          icon={AlertCircle}
          href="/quality"
        />
      </div>
    </div>
  );
}
