import { http } from "../../../lib/http";

export type Plan = {
  _id: string;
  projectId: string;

  title: string;
  description?: string;

  createdBy?: string;
  updatedBy?: string;

  createdAt: string;
  updatedAt: string;

  isDeleted?: boolean;
};

export type PlanVersion = {
  _id: string;
  planId: string;
  projectId: string;

  versionNumber: number;

  file: {
    url: string;
    publicId: string;
    bytes?: number;
    resourceType?: string;
    originalName?: string;
  };

  createdBy: string;

  createdAt: string;
  updatedAt: string;

  isDeleted?: boolean;
};

export type CreatePlanDto = {
  projectId: string;
  title: string;
  description?: string;
};

export async function listPlansByProject(projectId: string) {
  const { data } = await http.get<Plan[]>(`/plans/project/${projectId}`);
  return data;
}

export async function createPlan(dto: CreatePlanDto) {
  const { data } = await http.post<Plan>("/plans", dto);
  return data;
}

export async function listPlanVersions(planId: string) {
  const { data } = await http.get<PlanVersion[]>(`/plans/${planId}/versions`);
  return data;
}

/**
 * Upload a new version for a plan.
 * Backend usually expects multipart/form-data with field "file".
 * If your backend expects another field name, change "file" below.
 */
export async function uploadPlanVersion(planId: string, file: File) {
  const form = new FormData();
  form.append("file", file);

  const { data } = await http.post<PlanVersion>(
    `/plans/${planId}/versions`,
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data;
}
