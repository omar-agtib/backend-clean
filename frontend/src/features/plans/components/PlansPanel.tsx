import { useMemo, useState } from "react";
import { usePlans } from "../hooks/usePlans";
import { useCreatePlan } from "../hooks/useCreatePlan";
import PlanCard from "./PlanCard";
import CreatePlanModal from "./CreatePlanModal";
import PlanVersionsPanel from "./PlanVersionsPanel";

export default function PlansPanel({ projectId }: { projectId: string }) {
  const q = usePlans(projectId);
  const create = useCreatePlan(projectId);

  const [openCreate, setOpenCreate] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const list = useMemo(() => {
    const items = q.data || [];
    const s = search.trim().toLowerCase();
    if (!s) return items;
    return items.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        (p.description || "").toLowerCase().includes(s)
    );
  }, [q.data, search]);

  if (q.isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 rounded-xl bg-slate-200 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 rounded-2xl bg-slate-200 animate-pulse" />
          <div className="h-32 rounded-2xl bg-slate-200 animate-pulse" />
        </div>
        <div className="h-64 rounded-2xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  if (q.isError) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-6">
        <div className="font-semibold text-red-800">Failed to load plans</div>
        <div className="text-red-700 text-sm mt-1">
          {(q.error as any)?.response?.data?.message ||
            (q.error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-2xl font-extrabold text-slate-900">Plans</div>
          <div className="text-sm text-slate-500">
            Create plans and upload versions (PDF/DWG/etc)
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plans..."
            className="w-full sm:w-80 rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
          <button
            onClick={() => setOpenCreate(true)}
            className="shrink-0 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
          >
            + New
          </button>
        </div>
      </div>

      {/* List */}
      {list.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="font-semibold text-slate-900">No plans found</div>
          <div className="text-sm text-slate-600 mt-1">
            Create one to start uploading versions.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((p) => (
            <PlanCard
              key={p._id}
              plan={p}
              isSelected={p._id === selectedPlanId}
              onOpen={() => setSelectedPlanId(p._id)}
            />
          ))}
        </div>
      )}

      {/* Versions panel */}
      {selectedPlanId ? (
        <PlanVersionsPanel projectId={projectId} planId={selectedPlanId} />
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 text-sm text-slate-600">
          Select a plan to view / upload versions.
        </div>
      )}

      {/* Create modal */}
      {openCreate && (
        <CreatePlanModal
          projectId={projectId}
          onClose={() => setOpenCreate(false)}
          isPending={create.isPending}
          errorMessage={
            create.isError
              ? (create.error as any)?.response?.data?.message ||
                (create.error as Error).message
              : null
          }
          onCreate={async (dto) => {
            const plan = await create.mutateAsync(dto);
            setOpenCreate(false);
            setSelectedPlanId(plan._id);
          }}
        />
      )}
    </div>
  );
}
