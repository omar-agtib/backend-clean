import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlan, type CreatePlanDto } from "../api/plans.api";
import { planKeys } from "../api/planKeys";

export function useCreatePlan() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreatePlanDto) => createPlan(dto),
    onSuccess: async (_res, vars) => {
      await qc.invalidateQueries({
        queryKey: planKeys.project(vars.projectId),
      });
    },
  });
}
