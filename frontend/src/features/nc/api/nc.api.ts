import { http } from "../../../lib/http";

export type NcStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "VALIDATED";
export type NcPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type NC = {
  _id: string;
  projectId: string;

  title: string;
  description?: string;

  status: NcStatus;
  priority: NcPriority;

  assignedTo?: string | null;

  planId?: string | null;
  planVersionId?: string | null;
  annotationId?: string | null;

  attachments?: string[];

  createdBy?: string;
  updatedBy?: string;

  createdAt: string;
  updatedAt: string;

  isDeleted?: boolean;
};

export type CreateNcDto = {
  projectId: string;
  title: string;
  description?: string;
  priority?: NcPriority;

  assignedTo?: string | null;

  planId?: string;
  planVersionId?: string;
  annotationId?: string;

  attachments?: string[];
  comment?: string;
};

export async function listNcByProject(projectId: string) {
  const { data } = await http.get<NC[]>(`/nc/project/${projectId}`);
  return data;
}

export async function createNc(dto: CreateNcDto) {
  const { data } = await http.post<NC>("/nc", dto);
  return data;
}

export async function assignNc(ncId: string, assignedTo: string) {
  const { data } = await http.post<NC>(`/nc/${ncId}/assign`, { assignedTo });
  return data;
}

export async function changeNcStatus(
  ncId: string,
  status: NcStatus,
  comment?: string
) {
  const { data } = await http.post<NC>(`/nc/${ncId}/status`, {
    status,
    comment,
  });
  return data;
}

/**
 * Optional (only if you add route in backend later):
 * GET /api/nc/:ncId/history
 */
// export type NcHistoryRow = {
//   _id: string;
//   ncId: string;
//   action: string;
//   fromStatus?: string;
//   toStatus?: string;
//   userId?: any;
//   comment?: string;
//   createdAt: string;
// };
// export async function getNcHistory(ncId: string) {
//   const { data } = await http.get<NcHistoryRow[]>(`/nc/${ncId}/history`);
//   return data;
// }
