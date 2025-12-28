import { http } from "../../../lib/http";

export type DashboardResponse = {
  projectId: string;
  nc: { total: number; open: number; inProgress: number; validated: number };
  milestones: {
    total: number;
    completed: number;
    remaining: number;
    completionRate: number;
  };
  stock: { totalQty: number };
  tools: { assigned: number };
  invoices: {
    total: number;
    paid: number;
    unpaid: number;
    byStatus: Record<string, { count: number; totalAmount: number }>;
  };
};

export async function getProjectDashboard(projectId: string) {
  const { data } = await http.get<DashboardResponse>(
    `/dashboard/project/${projectId}`
  );
  return data;
}
