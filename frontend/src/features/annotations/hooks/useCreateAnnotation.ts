// src/features/annotations/hooks/useCreateAnnotation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAnnotationApi,
  type CreateAnnotationDto,
} from "../api/annotations.api";
import { annotationKeys } from "../api/annotationKeys";

export function useCreateAnnotation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateAnnotationDto) => createAnnotationApi(dto),
    onSuccess: async (_res, vars) => {
      await qc.invalidateQueries({
        queryKey: annotationKeys.version(vars.planVersionId),
      });
    },
  });
}
