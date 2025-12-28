import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "../api/dashboardKeys";
import { getProjectDashboard } from "../api/dashboard.api";

export function useDashboard(projectId: string | null) {
  return useQuery({
    queryKey: projectId ? dashboardKeys.project(projectId) : dashboardKeys.all,
    queryFn: () => getProjectDashboard(projectId as string),
    enabled: !!projectId,
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  });
}
