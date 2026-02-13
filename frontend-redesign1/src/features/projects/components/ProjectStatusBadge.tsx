import { useTranslation } from "react-i18next";

export default function ProjectStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();

  const key = status || "UNKNOWN";

  const styles: Record<string, string> = {
    PLANNING: "bg-muted text-mutedForeground border-border",
    ACTIVE:
      "bg-[hsl(var(--primary)/0.12)] text-foreground border-[hsl(var(--primary)/0.25)]",
    COMPLETED:
      "bg-[rgba(34,197,94,0.12)] text-foreground border-[rgba(34,197,94,0.25)]",
    ARCHIVED: "bg-muted text-mutedForeground border-border",
    UNKNOWN: "bg-muted text-mutedForeground border-border",
  };

  const cls = styles[key] || styles.UNKNOWN;

  return (
    <span
      className={[
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border",
        cls,
      ].join(" ")}
    >
      {t(`projects.status.${key}`, { defaultValue: key })}
    </span>
  );
}
