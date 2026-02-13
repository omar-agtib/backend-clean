// src/features/tools/hooks/useAssignTool.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignToolApi } from "../api/tools.api";
import { toolKeys } from "../api/toolKeys";

export function useAssignTool(projectId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: assignToolApi,
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
