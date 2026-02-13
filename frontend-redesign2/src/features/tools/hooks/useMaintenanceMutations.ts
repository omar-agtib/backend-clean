// src/features/tools/hooks/useMaintenanceMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeMaintenanceApi, startMaintenanceApi } from "../api/tools.api";
import { toolKeys } from "../api/toolKeys";

export function useStartMaintenance(projectId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: startMaintenanceApi,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: toolKeys.inventory() });
      await qc.invalidateQueries({ queryKey: toolKeys.available() });
      await qc.invalidateQueries({
        queryKey: toolKeys.maintenanceByProject(projectId),
      });
    },
  });
}

export function useCompleteMaintenance(projectId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: completeMaintenanceApi,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: toolKeys.inventory() });
      await qc.invalidateQueries({ queryKey: toolKeys.available() });
      await qc.invalidateQueries({
        queryKey: toolKeys.maintenanceByProject(projectId),
      });
    },
  });
}
