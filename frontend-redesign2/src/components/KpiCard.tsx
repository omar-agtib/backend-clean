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
    <div className="card card-hover p-4 sm:p-6">
      <div className="text-xs font-semibold text-muted-fg uppercase tracking-wide">
        {label}
      </div>
      <div className="mt-3 text-2xl sm:text-3xl font-bold text-foreground">
        {value}
      </div>
      {hint ? (
        <div className="mt-2 text-xs text-muted-fg">
          {hint}
        </div>
      ) : null}
    </div>
  );
}
