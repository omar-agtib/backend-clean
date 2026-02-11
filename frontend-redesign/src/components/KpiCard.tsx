export default function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="card-elevated p-6 bg-gradient-to-br from-card to-muted/5">
      <div className="text-xs font-bold text-mutedForeground uppercase tracking-wide">{label}</div>
      <div className="mt-3 text-4xl font-bold text-foreground">{value}</div>
      {hint ? (
        <div className="mt-3 text-sm text-mutedForeground">{hint}</div>
      ) : null}
    </div>
  );
}
