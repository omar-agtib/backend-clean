import { apiClient } from "./client";
import type { Plan, PlanVersion, Annotation, PaginatedResponse } from "@/types";

export const planningApi = {
  // ✅ Plans - Match backend routes
  getPlans: async (projectId: string, params?: Record<string, any>) => {
    const response = await apiClient.get<Plan[]>(
      `/api/plans/project/${projectId}`,
      { params },
    );
    // Backend returns array, wrap in pagination format for frontend
    return {
      items: response.data,
      total: response.data.length,
      page: 1,
      pageSize: response.data.length,
      totalPages: 1,
    };
  },

  getPlan: async (planId: string) => {
    const response = await apiClient.get<Plan>(`/api/plans/${planId}`);
    return response.data;
  },

  createPlan: async (data: { projectId: string; name: string }) => {
    const response = await apiClient.post<Plan>("/api/plans", data);
    return response.data;
  },

  updatePlan: async (planId: string, data: Partial<Plan>) => {
    const response = await apiClient.put<Plan>(`/api/plans/${planId}`, data);
    return response.data;
  },

  deletePlan: async (planId: string) => {
    const response = await apiClient.delete(`/api/plans/${planId}`);
    return response.data;
  },

  // ✅ Plan Versions - Match backend routes
  getPlanVersions: async (planId: string) => {
    const response = await apiClient.get<PlanVersion[]>(
      `/api/plans/${planId}/versions`,
    );
    return response.data;
  },

  uploadPlanVersion: async (planId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<PlanVersion>(
      `/api/plans/${planId}/versions/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  deletePlanVersion: async (versionId: string) => {
    const response = await apiClient.delete(`/api/plans/versions/${versionId}`);
    return response.data;
  },

  restorePlanVersion: async (versionId: string) => {
    const response = await apiClient.post(
      `/api/plans/versions/${versionId}/restore`,
    );
    return response.data;
  },

  setCurrentVersion: async (versionId: string) => {
    const response = await apiClient.post(
      `/api/plans/versions/${versionId}/set-current`,
    );
    return response.data;
  },

  getVersionSignedUrl: async (versionId: string, expiresInSec = 3600) => {
    const response = await apiClient.get<{ url: string; expiresInSec: number }>(
      `/api/plans/versions/${versionId}/signed-url`,
      { params: { expiresInSec } },
    );
    return response.data;
  },

  // ✅ Annotations - Match backend routes
  getAnnotations: async (planVersionId: string) => {
    const response = await apiClient.get<Annotation[]>(
      `/api/annotations/${planVersionId}`,
    );
    return response.data;
  },

  createAnnotation: async (data: Partial<Annotation>) => {
    const response = await apiClient.post<Annotation>("/api/annotations", data);
    return response.data;
  },

  updateAnnotation: async (annotationId: string, data: Partial<Annotation>) => {
    const response = await apiClient.patch<Annotation>(
      `/api/annotations/${annotationId}`,
      data,
    );
    return response.data;
  },

  deleteAnnotation: async (annotationId: string) => {
    const response = await apiClient.delete(`/api/annotations/${annotationId}`);
    return response.data;
  },
};
