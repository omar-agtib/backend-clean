// src/features/annotations/hooks/useCreateAnnotation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAnnotation,
  type CreateAnnotationDto,
} from "../api/annotations.api";
import { annotationKeys } from "../api/annotationKeys";

export function useCreateAnnotation(planVersionId?: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateAnnotationDto) => createAnnotation(dto),
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
