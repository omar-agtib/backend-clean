import { useQuery } from "@tanstack/react-query";
import { listPlanVersions } from "../api/plans.api";
import { planKeys } from "../api/planKeys";

export function usePlanVersions(planId?: string | null) {
  return useQuery({
    queryKey: planId ? planKeys.versions(planId) : planKeys.all,
    queryFn: () => listPlanVersions(planId as string),
    enabled: !!planId,
  });
}
