// src/features/projects/api/projectMembers.api.ts
import { http } from "../../../lib/http";

export type ProjectMember = {
  userId: { _id: string; name: string; email: string; role: string } | string;
  role: string;
};

export type ProjectResponse = {
  _id: string;
  name: string;
  description?: string;
  owner?: { _id: string; name: string; email: string; role: string } | string;
  members: ProjectMember[];
};

export async function getProject(projectId: string) {
  const { data } = await http.get<ProjectResponse>(`/projects/${projectId}`);
  return data;
}
