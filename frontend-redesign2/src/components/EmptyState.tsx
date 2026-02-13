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
    <div className="card card-hover p-6 sm:p-8 lg:p-12 text-center">
      <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-muted grid place-items-center">
        <div className="h-5 w-5 rounded-full bg-foreground/20" />
      </div>

      <h2 className="h3">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 text-sm text-muted-fg max-w-md mx-auto">
          {subtitle}
        </p>
      ) : null}

      {action ? (
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-2">
          {action}
        </div>
      ) : null}
    </div>
  );
}
