// src/features/progress/hooks/useDeleteMilestone.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMilestone } from "../api/progress.api";
import { progressKeys } from "../api/progressKeys";

export function useDeleteMilestone(projectId?: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (milestoneId: string) => deleteMilestone(milestoneId),
    onSuccess: () => {
      if (!projectId) return;
      qc.invalidateQueries({
        queryKey: progressKeys.milestonesByProject(projectId),
      });
      qc.invalidateQueries({
        queryKey: progressKeys.summaryByProject(projectId),
      });
    },
  });
}
