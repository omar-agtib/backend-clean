// src/features/progress/hooks/useMilestoneSummary.ts
import { useQuery } from "@tanstack/react-query";
import { getMilestoneSummary } from "../api/progress.api";
import { progressKeys } from "../api/progressKeys";

export function useMilestoneSummary(projectId?: string | null) {
  return useQuery({
    queryKey: projectId
      ? progressKeys.summaryByProject(projectId)
      : ["progress", "summary", "no-project"],
    queryFn: () => getMilestoneSummary(projectId as string),
    enabled: !!projectId,
  });
}
