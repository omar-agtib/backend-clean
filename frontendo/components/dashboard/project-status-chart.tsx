"use client";

import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface ProjectStatusChartProps {
  data: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
  };
}

const COLORS = {
  PLANNING: "#3b82f6", // blue
  ACTIVE: "#10b981", // green
  COMPLETED: "#8b5cf6", // purple
  ARCHIVED: "#6b7280", // gray
};

export function ProjectStatusChart({ data }: ProjectStatusChartProps) {
  const chartData = [
    { name: "Active", value: data.activeProjects, color: COLORS.ACTIVE },
    {
      name: "Completed",
      value: data.completedProjects,
      color: COLORS.COMPLETED,
    },
    {
      name: "Other",
      value: data.totalProjects - data.activeProjects - data.completedProjects,
      color: COLORS.PLANNING,
    },
  ].filter((item) => item.value > 0);

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Project Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
