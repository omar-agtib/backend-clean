// src/features/tools/hooks/useCreateTool.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createToolApi } from "../api/tools.api";
import { toolKeys } from "../api/toolKeys";

export function useCreateTool() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createToolApi,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: toolKeys.inventory() });
      await qc.invalidateQueries({ queryKey: toolKeys.available() });
    },
  });
}
