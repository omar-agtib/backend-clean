// src/features/nc/hooks/useCreateNc.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNcApi, type CreateNcDto } from "../api/nc.api";
import { ncKeys } from "../api/ncKeys";

export function useCreateNc() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateNcDto) => createNcApi(dto),
    onSuccess: async (_res, vars) => {
      await qc.invalidateQueries({ queryKey: ncKeys.project(vars.projectId) });
    },
  });
}
