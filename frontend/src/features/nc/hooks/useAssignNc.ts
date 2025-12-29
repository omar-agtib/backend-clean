// src/features/nc/hooks/useAssignNc.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignNcApi } from "../api/nc.api";
import { ncKeys } from "../api/ncKeys";

export function useAssignNc(projectId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (p: { ncId: string; assignedTo: string }) =>
      assignNcApi(p.ncId, p.assignedTo),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ncKeys.project(projectId) });
    },
  });
}
