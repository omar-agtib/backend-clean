// src/features/nc/components/NcCard.tsx
import { useTranslation } from "react-i18next";
import type { Nc } from "../api/nc.api";

function badgeClasses(status: string) {
  const base = "chip font-extrabold border";

  if (status === "OPEN")
    return `${base} bg-[rgba(239,68,68,0.12)] border-[rgba(239,68,68,0.25)]`;
  if (status === "IN_PROGRESS")
    return `${base} bg-[rgba(245,158,11,0.14)] border-[rgba(245,158,11,0.25)]`;
  if (status === "RESOLVED")
    return `${base} bg-[hsl(var(--primary)/0.12)] border-[hsl(var(--primary)/0.25)]`;
  if (status === "VALIDATED")
    return `${base} bg-[rgba(34,197,94,0.12)] border-[rgba(34,197,94,0.25)]`;

  return `${base} bg-muted border-border`;
}

export default function NcCard({
  nc,
  onOpen,
  assignedLabel,
}: {
  nc: Nc;
  onOpen: () => void;
  assignedLabel?: string;
}) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onOpen}
      className={[
        "text-left w-full rounded-2xl border border-border bg-card p-4 transition",
        "hover:bg-muted hover:shadow-sm",
      ].join(" ")}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-extrabold text-foreground truncate">
            {nc.title}
          </div>
          <div className="text-sm text-mutedForeground mt-1 line-clamp-2">
            {nc.description || t("nc.card.noDescription")}
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-2">
          <span className={badgeClasses(nc.status)}>{nc.status}</span>
          <div className="text-xs text-mutedForeground">{nc.priority}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-mutedForeground flex-wrap">
        <div>
          {t("nc.card.assigned")}:{" "}
          <span className="text-foreground font-semibold">
            {assignedLabel || "—"}
          </span>
        </div>
        <div>{new Date(nc.updatedAt).toLocaleString()}</div>
      </div>
    </button>
  );
}
