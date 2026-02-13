// src/features/tools/api/tools.api.ts
import { http } from "../../../lib/http";

export type Tool = {
  _id: string;
  name: string;
  serialNumber?: string;
  status: "AVAILABLE" | "ASSIGNED" | "MAINTENANCE";
  createdAt: string;
  updatedAt: string;
};

export type PopUser = {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
};

export type ToolAssignment = {
  _id: string;

  toolId: Tool | string;
  projectId: string;

  assignedTo: PopUser | string;
  assignedBy: PopUser | string;

  assignedAt: string;

  returnedAt: string | null;
  returnedBy: PopUser | string | null;

  createdAt: string;
  updatedAt: string;
};

export type ToolMaintenance = {
  _id: string;

  toolId: Tool | string;
  projectId: string;

  description: string;

  startedAt: string;
  completedAt: string | null;

  startedBy: PopUser | string;
  completedBy: PopUser | string | null;

  createdAt: string;
  updatedAt: string;
};

export async function createToolApi(dto: {
  name: string;
  serialNumber?: string;
}) {
  const { data } = await http.post<Tool>("/tools", dto);
  return data;
}

export async function listToolsApi() {
  const { data } = await http.get<Tool[]>("/tools");
  return data;
}

export async function listAvailableToolsApi() {
  const { data } = await http.get<Tool[]>("/tools/available");
  return data;
}

export async function assignToolApi(dto: {
  toolId: string;
  projectId: string;
  assignedTo: string;
}) {
  const { data } = await http.post<ToolAssignment>("/tools/assign", dto);
  return data;
}

export async function returnToolApi(dto: { toolId: string }) {
  const { data } = await http.post<{ tool: Tool; assignment: ToolAssignment }>(
    "/tools/return",
    dto
  );
  return data;
}

export async function startMaintenanceApi(dto: {
  toolId: string;
  projectId: string;
  description: string;
}) {
  const { data } = await http.post<ToolMaintenance>(
    "/tools/maintenance/start",
    dto
  );
  return data;
}

export async function completeMaintenanceApi(dto: { maintenanceId: string }) {
  const { data } = await http.post<{
    tool: Tool;
    maintenance: ToolMaintenance;
  }>("/tools/maintenance/complete", dto);
  return data;
}

export async function listAssignmentsByProjectApi(projectId: string) {
  const { data } = await http.get<ToolAssignment[]>(
    `/tools/project/${projectId}/assignments`
  );
  return data;
}

export async function listActiveAssignedByProjectApi(projectId: string) {
  const { data } = await http.get<ToolAssignment[]>(
    `/tools/project/${projectId}/assigned`
  );
  return data;
}

export async function listMaintenanceByProjectApi(projectId: string) {
  const { data } = await http.get<ToolMaintenance[]>(
    `/tools/project/${projectId}/maintenance`
  );
  return data;
}
