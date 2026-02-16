"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface NCWorkflowChartProps {
  data: {
    ncTotal: number;
    ncOpen: number;
    ncInProgress: number;
    ncValidated: number;
  };
}

const COLORS = {
  Open: "#ef4444",
  "In Progress": "#3b82f6",
  Resolved: "#8b5cf6",
  Validated: "#10b981",
};

export function NCWorkflowChart({ data }: NCWorkflowChartProps) {
  const chartData = [
    { status: "Open", count: data.ncOpen, color: COLORS.Open },
    {
      status: "In Progress",
      count: data.ncInProgress,
      color: COLORS["In Progress"],
    },
    { status: "Validated", count: data.ncValidated, color: COLORS.Validated },
  ];

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Quality Issues Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="status" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="count" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
