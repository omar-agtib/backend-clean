function Block({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`} />
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Block className="h-10 w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Block className="h-28" />
        <Block className="h-28" />
        <Block className="h-28" />
        <Block className="h-28" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Block className="h-80" />
        <Block className="h-80" />
      </div>
    </div>
  );
}
