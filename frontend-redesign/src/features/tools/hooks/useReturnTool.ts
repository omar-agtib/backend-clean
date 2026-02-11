// src/features/tools/hooks/useReturnTool.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { returnToolApi } from "../api/tools.api";
import { toolKeys } from "../api/toolKeys";

export function useReturnTool(projectId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: returnToolApi,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: toolKeys.available() });
      await qc.invalidateQueries({ queryKey: toolKeys.inventory() });
      await qc.invalidateQueries({
        queryKey: toolKeys.activeAssignedByProject(projectId),
      });
      await qc.invalidateQueries({
        queryKey: toolKeys.assignmentsByProject(projectId),
      });
    },
  });
}
