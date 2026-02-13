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
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      {children}
    </div>
  );
}
