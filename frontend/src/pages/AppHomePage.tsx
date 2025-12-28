export default function AppHomePage() {
  return (
    <div className="grid gap-4">
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Next: we’ll plug this into /api/dashboard/project/:projectId
        </p>
      </div>
    </div>
  );
}
