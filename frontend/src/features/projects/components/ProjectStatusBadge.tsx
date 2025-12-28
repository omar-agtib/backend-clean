const MAP: Record<string, { label: string; cls: string }> = {
  PLANNING: {
    label: "Planning",
    cls: "bg-slate-100 text-slate-700 border-slate-200",
  },
  ACTIVE: {
    label: "Active",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  COMPLETED: {
    label: "Completed",
    cls: "bg-blue-50 text-blue-700 border-blue-200",
  },
  ARCHIVED: {
    label: "Archived",
    cls: "bg-zinc-50 text-zinc-600 border-zinc-200",
  },
};

export default function ProjectStatusBadge({ status }: { status: string }) {
  const s = MAP[status] || {
    label: status,
    cls: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${s.cls}`}
    >
      {s.label}
    </span>
  );
}
