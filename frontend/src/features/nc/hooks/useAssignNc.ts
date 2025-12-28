import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignNc } from "../api/nc.api";
import { ncKeys } from "../api/ncKeys";

export function useAssignNc(projectId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ ncId, assignedTo }: { ncId: string; assignedTo: string }) =>
      assignNc(ncId, assignedTo),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ncKeys.project(projectId) });
    },
  });
}
