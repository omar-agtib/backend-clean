// src/features/nc/hooks/useChangeNcStatus.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeNcStatusApi, type NcStatus } from "../api/nc.api";
import { ncKeys } from "../api/ncKeys";

export function useChangeNcStatus(projectId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (p: { ncId: string; status: NcStatus; comment?: string }) =>
      changeNcStatusApi(p.ncId, p.status, p.comment),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ncKeys.project(projectId) });
    },
  });
}
