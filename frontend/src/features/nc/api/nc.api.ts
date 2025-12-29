// src/features/nc/api/nc.api.ts
import { http } from "../../../lib/http";

export type NcStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "VALIDATED";
export type NcPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type Nc = {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  status: NcStatus;
  priority: NcPriority;
  assignedTo?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateNcDto = {
  projectId: string;
  title: string;
  description?: string;
  priority?: NcPriority;
};

export async function listNcByProject(projectId: string) {
  const { data } = await http.get<Nc[]>(`/nc/project/${projectId}`);
  return data;
}

export async function createNcApi(dto: CreateNcDto) {
  const { data } = await http.post<Nc>("/nc", dto);
  return data;
}

export async function assignNcApi(ncId: string, assignedTo: string) {
  const { data } = await http.post<Nc>(`/nc/${ncId}/assign`, { assignedTo });
  return data;
}

export async function changeNcStatusApi(
  ncId: string,
  status: NcStatus,
  comment?: string
) {
  const { data } = await http.post<Nc>(`/nc/${ncId}/status`, {
    status,
    comment,
  });
  return data;
}
