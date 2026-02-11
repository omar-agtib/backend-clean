import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "../api/dashboardKeys";
import { getDashboardOverview } from "../api/dashboard.api";

export function useDashboardOverview() {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: getDashboardOverview,
    staleTime: 15_000,
  });
}
