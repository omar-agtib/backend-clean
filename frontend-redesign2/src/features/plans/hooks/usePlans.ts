import { useQuery } from "@tanstack/react-query";
import { listPlansByProject } from "../api/plans.api";
import { planKeys } from "../api/planKeys";

export function usePlans(projectId?: string | null) {
  return useQuery({
    queryKey: projectId ? planKeys.project(projectId) : planKeys.all,
    queryFn: () => listPlansByProject(projectId as string),
    enabled: !!projectId,
  });
}
