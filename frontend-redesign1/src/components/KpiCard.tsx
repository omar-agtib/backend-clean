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
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="text-xs font-semibold text-mutedForeground uppercase tracking-wide">
        {label}
      </div>
      <div className="mt-3 text-3xl font-bold text-foreground">{value}</div>
      {hint ? (
        <div className="mt-2 text-xs text-mutedForeground">{hint}</div>
      ) : null}
    </div>
  );
}
