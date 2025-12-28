import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNc, type CreateNcDto } from "../api/nc.api";
import { ncKeys } from "../api/ncKeys";

export function useCreateNc(projectId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateNcDto) => createNc(dto),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ncKeys.project(projectId) });
    },
  });
}
