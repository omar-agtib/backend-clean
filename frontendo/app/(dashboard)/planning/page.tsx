"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePlans, useDeletePlan } from "@/hooks/usePlanning";
import { LoadingState } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FolderOpen, FileText } from "lucide-react";
import { PlanCard } from "@/components/planning/plan-card";
import { CreatePlanDialog } from "@/components/planning/create-plan-dialog";

export default function PlanningPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading } = usePlans(projectId || "", { search });
  const deletePlan = useDeletePlan();

  const handleDeletePlan = async (planId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this plan? All versions will be deleted.",
      )
    ) {
      await deletePlan.mutateAsync(planId);
    }
  };

  if (!projectId) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="No Project Selected"
        description="Please select a project from the dropdown in the navbar to view and manage plans"
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Planning</h1>
            <p className="text-muted-foreground mt-2">
              Manage project plans, versions, and annotations
            </p>
          </div>
          <Button size="lg" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Plan
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : !data?.items || data.items.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Plans Yet"
            description="Create your first plan to start managing project documentation"
            action={
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Plan
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((plan: any) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                onDelete={handleDeletePlan}
              />
            ))}
          </div>
        )}
      </div>

      <CreatePlanDialog
        projectId={projectId}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </>
  );
}
