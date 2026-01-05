// src/features/progress/hooks/useCreateMilestone.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMilestone } from "../api/progress.api";
import { progressKeys } from "../api/progressKeys";

export function useCreateMilestone(projectId?: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: { projectId: string; name: string }) =>
      createMilestone(payload),
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
