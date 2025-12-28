import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadPlanVersion } from "../api/plans.api";
import { planKeys } from "../api/planKeys";

export function useUploadPlanVersion(projectId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, file }: { planId: string; file: File }) =>
      uploadPlanVersion(planId, file),
    onSuccess: async (_res, vars) => {
      await qc.invalidateQueries({ queryKey: planKeys.project(projectId) });
      await qc.invalidateQueries({ queryKey: planKeys.versions(vars.planId) });
    },
  });
}
