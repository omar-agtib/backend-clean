// src/features/progress/hooks/useProgressSummary.ts
import { useQuery } from "@tanstack/react-query";
import { getProgressSummary } from "../api/progress.api";
import { progressKeys } from "../api/progressKeys";

export function useProgressSummary(projectId?: string | null) {
  return useQuery({
    queryKey: projectId
      ? progressKeys.summary(projectId)
      : ["progress", "summary", "no-project"],
    queryFn: () => getProgressSummary(projectId as string),
    enabled: !!projectId,
  });
}
