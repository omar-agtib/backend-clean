"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  useSummary,
  useMilestones,
  useUpdateMilestone,
  useDeleteMilestone,
} from "@/hooks/useProgress";
import { LoadingState } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, FolderOpen, Target, TrendingUp } from "lucide-react";
import { MilestoneCard } from "@/components/progress/milestone-card";
import { CreateMilestoneDialog } from "@/components/progress/create-milestone-dialog";
import { formatDate } from "@/lib/utils/formatting";

export default function ProgressPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: summary, isLoading: summaryLoading } = useSummary(
    projectId || "",
  );
  const { data: milestones, isLoading: milestonesLoading } = useMilestones(
    projectId || "",
  );
  const updateMilestone = useUpdateMilestone();
  const deleteMilestone = useDeleteMilestone();

  const handleUpdateProgress = async (
    milestoneId: string,
    progress: number,
  ) => {
    await updateMilestone.mutateAsync({ milestoneId, progress });
  };

  const handleDelete = async (milestoneId: string) => {
    if (confirm("Are you sure you want to delete this milestone?")) {
      await deleteMilestone.mutateAsync(milestoneId);
    }
  };

  if (!projectId) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="No Project Selected"
        description="Please select a project from the dropdown in the navbar to view progress"
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
            <p className="text-muted-foreground mt-2">
              Track and manage project milestones and completion
            </p>
          </div>
          <Button size="lg" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Milestone
          </Button>
        </div>

        {/* Summary Cards */}
        {summaryLoading ? (
          <LoadingState />
        ) : summary ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Milestones
                  </p>
                  <p className="text-2xl font-bold">
                    {summary.totals?.total || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">
                    {summary.totals?.completed || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {summary.completionRate || 0}%
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Completion Rate
                  </p>
                  <Progress
                    value={summary.completionRate || 0}
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>
          </div>
        ) : null}

        {/* Milestones List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Milestones</h2>
          {milestonesLoading ? (
            <LoadingState />
          ) : !milestones?.items || milestones.items.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No Milestones Yet"
              description="Create your first milestone to start tracking project progress"
              action={
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Milestone
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {milestones.items.map((milestone: any) => (
                <MilestoneCard
                  key={milestone._id}
                  milestone={milestone}
                  onUpdateProgress={handleUpdateProgress}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateMilestoneDialog
        projectId={projectId}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </>
  );
}
