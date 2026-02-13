// src/features/annotations/hooks/useUpdateAnnotation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAnnotation } from "../api/annotations.api";
import { annotationKeys } from "../api/annotationKeys";

export function useUpdateAnnotation(planVersionId?: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (p: {
      annotationId: string;
      geometry?: { x: number; y: number; page?: number };
      content?: string;
      type?: "DRAW" | "PIN" | "TEXT";
    }) =>
      updateAnnotation(p.annotationId, {
        geometry: p.geometry,
        content: p.content,
        type: p.type,
      }),
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
