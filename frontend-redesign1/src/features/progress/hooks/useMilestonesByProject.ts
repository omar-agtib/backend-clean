// src/features/progress/hooks/useMilestonesByProject.ts
import { useQuery } from "@tanstack/react-query";
import { listMilestonesByProject } from "../api/progress.api";
import { progressKeys } from "../api/progressKeys";

export function useMilestonesByProject(projectId?: string | null) {
  return useQuery({
    queryKey: projectId
      ? progressKeys.milestonesByProject(projectId)
      : ["progress", "milestones", "no-project"],
    queryFn: () => listMilestonesByProject(projectId as string),
    enabled: !!projectId,
  });
}
