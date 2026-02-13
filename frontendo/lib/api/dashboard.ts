import { apiClient } from "./client";
import { DashboardStats } from "@/types";

// For global user dashboard
export async function getDashboardOverview(): Promise<DashboardStats> {
  const response = await apiClient.get<DashboardStats>(
    "/api/dashboard/overview",
  );
  return response.data;
}

// For project-specific dashboard
export async function getProjectDashboard(
  projectId: string,
): Promise<DashboardStats> {
  const response = await apiClient.get<DashboardStats>(
    `/api/dashboard/project/${projectId}`,
  );
  return response.data;
}
