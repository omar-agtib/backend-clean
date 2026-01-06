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
    <div className="card p-4">
      <div className="text-sm font-semibold text-mutedForeground">{label}</div>
      <div className="mt-2 text-2xl font-extrabold">{value}</div>
      {hint ? (
        <div className="mt-1 text-xs text-mutedForeground">{hint}</div>
      ) : null}
    </div>
  );
}
