// src/features/annotations/hooks/useDeleteAnnotation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAnnotationApi } from "../api/annotations.api";
import { annotationKeys } from "../api/annotationKeys";

export function useDeleteAnnotation(planVersionId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (annotationId: string) => deleteAnnotationApi(annotationId),
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: annotationKeys.version(planVersionId),
      });
    },
  });
}
