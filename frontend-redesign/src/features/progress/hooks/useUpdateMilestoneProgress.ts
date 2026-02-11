// src/features/progress/hooks/useUpdateMilestoneProgress.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMilestoneProgress } from "../api/progress.api";
import { progressKeys } from "../api/progressKeys";

export function useUpdateMilestoneProgress(projectId?: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: { milestoneId: string; progress: number }) =>
      updateMilestoneProgress(payload),
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
