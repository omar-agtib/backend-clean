"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, Target } from "lucide-react";

interface ProgressChartProps {
  data: {
    milestonesTotal: number;
    milestonesCompleted: number;
    milestonesCompletionRate: number;
    toolsAssigned: number;
    invoicesPaid: number;
    invoicesTotal: number;
  };
}

export function ProgressChart({ data }: ProgressChartProps) {
  const metrics = [
    {
      label: "Milestones Completion",
      value: data.milestonesCompletionRate || 0,
      count: `${data.milestonesCompleted} / ${data.milestonesTotal}`,
      icon: Target,
      color: "text-purple-600",
    },
    {
      label: "Tools Assigned",
      value:
        data.milestonesTotal > 0
          ? (data.toolsAssigned / data.milestonesTotal) * 100
          : 0,
      count: `${data.toolsAssigned} tools`,
      icon: Clock,
      color: "text-blue-600",
    },
    {
      label: "Invoices Paid",
      value:
        data.invoicesTotal > 0
          ? (data.invoicesPaid / data.invoicesTotal) * 100
          : 0,
      count: `${data.invoicesPaid} / ${data.invoicesTotal}`,
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Progress Metrics</h3>
      <div className="space-y-6">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
                <span className="text-sm font-medium">{metric.label}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {metric.count}
              </span>
            </div>
            <Progress value={metric.value} className="h-2" />
            <p className="text-xs text-right text-muted-foreground">
              {Math.round(metric.value)}%
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
