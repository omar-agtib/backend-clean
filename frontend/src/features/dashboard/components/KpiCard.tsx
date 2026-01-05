// src/features/dashboard/components/KpiCard.tsx
import type { ReactNode } from "react";

export default function KpiCard({
  title,
  value,
  sub,
  icon,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-slate-600">{title}</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
          {sub ? (
            <div className="mt-1 text-xs text-slate-500">{sub}</div>
          ) : null}
        </div>
        {icon ? (
          <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
