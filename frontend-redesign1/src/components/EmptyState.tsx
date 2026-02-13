import type React from "react";

export default function EmptyState({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card p-8 text-center">
      <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-muted grid place-items-center">
        <div className="h-5 w-5 rounded-full bg-foreground/10" />
      </div>

      <h2 className="text-lg font-extrabold">{title}</h2>
      {subtitle ? (
        <p className="mt-1 text-sm text-mutedForeground">{subtitle}</p>
      ) : null}

      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
