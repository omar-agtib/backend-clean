// src/features/progress/api/progress.api.ts
import { http } from "../../../lib/http";

export type Milestone = {
  _id: string;
  projectId: string;

  name: string;
  progress: number; // 0..100
  completed: boolean;

  createdAt?: string;
  updatedAt?: string;

  isDeleted?: boolean;
};

export type MilestoneSummary = {
  projectId: string;
  totals: { total: number; completed: number; remaining: number };
  completionRate: number;
  lastUpdatedAt: string | null;
};

export async function listMilestonesByProject(projectId: string) {
  const { data } = await http.get<Milestone[]>(
    `/progress/project/${projectId}`
  );
  return data;
}

export async function getMilestoneSummary(projectId: string) {
  const { data } = await http.get<MilestoneSummary>(
    `/progress/project/${projectId}/summary`
  );
  return data;
}

export async function createMilestone(payload: {
  projectId: string;
  name: string;
}) {
  const { data } = await http.post<Milestone>("/progress", payload);
  return data;
}

export async function updateMilestoneProgress(payload: {
  milestoneId: string;
  progress: number;
}) {
  const { data } = await http.patch<Milestone>(
    `/progress/milestone/${payload.milestoneId}`,
    { progress: payload.progress }
  );
  return data;
}

export async function deleteMilestone(milestoneId: string) {
  const { data } = await http.delete<Milestone>(
    `/progress/milestone/${milestoneId}`
  );
  return data;
}
