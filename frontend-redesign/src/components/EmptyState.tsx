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
    <div className="card-elevated p-12 text-center border-dashed border-2">
      <div className="mx-auto mb-6 h-16 w-16 rounded-xl bg-muted/30 grid place-items-center border border-border">
        <div className="h-8 w-8 rounded-full bg-primary/20" />
      </div>

      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      {subtitle ? (
        <p className="mt-3 text-base text-mutedForeground">{subtitle}</p>
      ) : null}

      {action ? <div className="mt-8 flex justify-center">{action}</div> : null}
    </div>
  );
}
