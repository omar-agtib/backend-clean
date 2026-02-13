import type React from "react";

export default function SectionCard({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="card card-hover p-4 sm:p-6">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="h3">
          {title}
        </h2>
        {right ? (
          <div className="shrink-0 w-full sm:w-auto">
            {right}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}
