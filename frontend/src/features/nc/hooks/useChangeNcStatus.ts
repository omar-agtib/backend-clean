import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeNcStatus, type NcStatus } from "../api/nc.api";
import { ncKeys } from "../api/ncKeys";

export function useChangeNcStatus(projectId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      ncId,
      status,
      comment,
    }: {
      ncId: string;
      status: NcStatus;
      comment?: string;
    }) => changeNcStatus(ncId, status, comment),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ncKeys.project(projectId) });
    },
  });
}
