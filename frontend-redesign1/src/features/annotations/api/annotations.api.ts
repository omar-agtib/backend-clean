// src/features/annotations/api/annotations.api.ts
import { http } from "../../../lib/http";

export type AnnotationType = "DRAW" | "PIN" | "TEXT";

export type Annotation = {
  _id: string;
  projectId: string;
  planVersionId: string;

  type: AnnotationType;
  geometry: {
    x: number; // normalized 0..1
    y: number; // normalized 0..1
    page?: number;
  };

  content?: string;

  createdBy: string;
  createdAt: string;
  updatedAt: string;

  clientId?: string;
};

export type CreateAnnotationDto = {
  planVersionId: string;
  type: AnnotationType;
  geometry: { x: number; y: number; page?: number };
  content?: string;
  clientId?: string;
};

export async function listAnnotationsByVersion(planVersionId: string) {
  const { data } = await http.get<Annotation[]>(
    `/annotations/${planVersionId}`
  );
  return data;
}

export async function createAnnotation(dto: CreateAnnotationDto) {
  const { data } = await http.post<Annotation>("/annotations", dto);
  return data;
}

export async function updateAnnotation(
  annotationId: string,
  patch: Partial<Pick<Annotation, "geometry" | "content" | "type">> & {
    geometry?: { x: number; y: number; page?: number };
  }
) {
  const { data } = await http.patch<Annotation>(
    `/annotations/${annotationId}`,
    patch
  );
  return data;
}

export async function deleteAnnotation(annotationId: string) {
  const { data } = await http.delete<{ message: string; annotationId: string }>(
    `/annotations/${annotationId}`
  );
  return data;
}
