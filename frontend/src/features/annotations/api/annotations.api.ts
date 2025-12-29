// src/features/annotations/api/annotations.api.ts
import { http } from "../../../lib/http";

export type AnnotationType = "DRAW" | "PIN" | "TEXT";

export type Annotation = {
  _id: string;
  projectId: string;
  planVersionId: string;
  type: AnnotationType;
  geometry: any; // we store { xPct, yPct, page } for pins (recommended)
  content?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAnnotationDto = {
  planVersionId: string;
  type: AnnotationType;
  geometry: any;
  content?: string;
  clientId?: string;
};

export async function listAnnotationsByVersion(planVersionId: string) {
  const { data } = await http.get<Annotation[]>(
    `/annotations/${planVersionId}`
  );
  return data;
}

export async function createAnnotationApi(dto: CreateAnnotationDto) {
  const { data } = await http.post<Annotation>("/annotations", dto);
  return data;
}

// If your backend route differs, change it here:
export async function updateAnnotationApi(annotationId: string, patch: any) {
  const { data } = await http.patch<Annotation>(
    `/annotations/${annotationId}`,
    patch
  );
  return data;
}

export async function deleteAnnotationApi(annotationId: string) {
  const { data } = await http.delete<{ message: string; annotationId: string }>(
    `/annotations/${annotationId}`
  );
  return data;
}
