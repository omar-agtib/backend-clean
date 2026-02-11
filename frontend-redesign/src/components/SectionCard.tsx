import type React from "react";
import { cn } from "../lib/cn";

export default function SectionCard({
  title,
  right,
  children,
  className,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("card p-6", className)}>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      {children}
    </div>
  );
}
