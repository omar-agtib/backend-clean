// src/features/dashboard/api/dashboard.api.ts
import { http } from "../../../lib/http";

export type DashboardOverviewProject = {
  _id: string;
  name: string;
  status: string;

  nc: { total: number; open: number; inProgress: number; validated: number };
  milestones: { total: number; completed: number; completionRate: number };
  stock: { totalQty: number };
  tools: { assigned: number };
  invoices: {
    total: number;
    paid: number;
    unpaid: number;
    totalAmount: number;
  };
};

export type DashboardOverviewResponse = {
  totals: {
    projects: number;

    ncTotal: number;
    ncOpen: number;
    ncInProgress: number;
    ncValidated: number;

    milestonesTotal: number;
    milestonesCompleted: number;
    milestonesCompletionRate: number;

    stockTotalQty: number;
    toolsAssigned: number;

    invoicesTotal: number;
    invoicesPaid: number;
    invoicesUnpaid: number;
  };

  invoicesByStatus: Record<
    "DRAFT" | "SENT" | "PAID" | "CANCELLED",
    { count: number; totalAmount: number }
  >;

  projects: DashboardOverviewProject[];
};

export async function getDashboardOverview() {
  const { data } = await http.get<DashboardOverviewResponse>(
    "/dashboard/overview"
  );
  return data;
}
