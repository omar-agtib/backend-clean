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
  DollarSign,
} from "lucide-react";
import { ProjectStatusChart } from "@/components/dashboard/project-status-chart";
import { InvoiceChart } from "@/components/dashboard/invoice-chart";
import { NCWorkflowChart } from "@/components/dashboard/nc-workflow-chart";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { QuickActions } from "@/components/dashboard/quick-actions";

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
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          subtitle={`${stats.activeProjects} active`}
          icon={FolderOpen}
          href="/projects"
        />
        <StatCard
          title="Milestones"
          value={stats.totals?.milestonesCompleted || 0}
          subtitle={`of ${stats.totals?.milestonesTotal || 0} completed`}
          icon={CheckCircle2}
          href="/progress"
        />
        <StatCard
          title="Tools"
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
          title="Revenue"
          value={`$${stats.totalBilling.toLocaleString()}`}
          subtitle={`$${stats.outstandingAmount.toLocaleString()} outstanding`}
          icon={DollarSign}
          href="/billing"
        />
        <StatCard
          title="Quality Issues"
          value={stats.openNCRs}
          subtitle={`${stats.totals?.ncTotal || 0} total`}
          icon={AlertCircle}
          href="/quality"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectStatusChart
          data={{
            totalProjects: stats.totalProjects,
            activeProjects: stats.activeProjects,
            completedProjects: stats.completedProjects,
          }}
        />
        <InvoiceChart data={stats.invoicesByStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NCWorkflowChart data={stats.totals} />
        <ProgressChart data={stats.totals} />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentProjects projects={stats.projects} />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
