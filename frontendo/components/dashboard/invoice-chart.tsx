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
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils/formatting";

interface InvoiceChartProps {
  data: {
    DRAFT: { count: number; totalAmount: number };
    SENT: { count: number; totalAmount: number };
    PAID: { count: number; totalAmount: number };
    CANCELLED: { count: number; totalAmount: number };
  };
}

export function InvoiceChart({ data }: InvoiceChartProps) {
  const chartData = [
    {
      status: "Draft",
      count: data.DRAFT.count,
      amount: data.DRAFT.totalAmount,
    },
    { status: "Sent", count: data.SENT.count, amount: data.SENT.totalAmount },
    { status: "Paid", count: data.PAID.count, amount: data.PAID.totalAmount },
    {
      status: "Cancelled",
      count: data.CANCELLED.count,
      amount: data.CANCELLED.totalAmount,
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Invoice Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === "amount") return formatCurrency(value);
              return value;
            }}
          />
          <Legend />
          <Bar dataKey="count" fill="#3b82f6" name="Count" />
          <Bar dataKey="amount" fill="#10b981" name="Amount" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
