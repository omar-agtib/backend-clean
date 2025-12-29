// src/features/annotations/hooks/useUpdateAnnotation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAnnotationApi } from "../api/annotations.api";
import { annotationKeys } from "../api/annotationKeys";

export function useUpdateAnnotation(planVersionId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (p: { annotationId: string; patch: any }) =>
      updateAnnotationApi(p.annotationId, p.patch),
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: annotationKeys.version(planVersionId),
      });
    },
  });
}
