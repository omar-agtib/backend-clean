// src/features/annotations/api/annotationKeys.ts
export const annotationKeys = {
  all: ["annotations"] as const,
  version: (planVersionId: string) =>
    ["annotations", "version", planVersionId] as const,
};
