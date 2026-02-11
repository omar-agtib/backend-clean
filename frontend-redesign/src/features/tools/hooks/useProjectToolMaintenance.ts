// src/features/tools/hooks/useProjectToolMaintenance.ts
import { useQuery } from "@tanstack/react-query";
import { listMaintenanceByProjectApi } from "../api/tools.api";
import { toolKeys } from "../api/toolKeys";

export function useMaintenanceHistory(projectId?: string | null) {
  return useQuery({
    queryKey: projectId
      ? toolKeys.maintenanceByProject(projectId)
      : toolKeys.all,
    queryFn: () => listMaintenanceByProjectApi(projectId as string),
    enabled: !!projectId,
  });
}
