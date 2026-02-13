// src/features/annotations/hooks/useAnnotationsByVersion.ts
import { useQuery } from "@tanstack/react-query";
import { listAnnotationsByVersion } from "../api/annotations.api";
import { annotationKeys } from "../api/annotationKeys";

export function useAnnotationsByVersion(planVersionId?: string | null) {
  return useQuery({
    queryKey: planVersionId
      ? annotationKeys.version(planVersionId)
      : annotationKeys.all,
    queryFn: () => listAnnotationsByVersion(planVersionId as string),
    enabled: !!planVersionId,
  });
}
