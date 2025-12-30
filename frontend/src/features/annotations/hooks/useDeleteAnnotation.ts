// src/features/annotations/hooks/useDeleteAnnotation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAnnotation } from "../api/annotations.api";
import { annotationKeys } from "../api/annotationKeys";

export function useDeleteAnnotation(planVersionId?: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (annotationId: string) => deleteAnnotation(annotationId),
    onSuccess: async () => {
      if (planVersionId) {
        await qc.invalidateQueries({
          queryKey: annotationKeys.version(planVersionId),
        });
      } else {
        await qc.invalidateQueries({ queryKey: annotationKeys.all });
      }
    },
  });
}
