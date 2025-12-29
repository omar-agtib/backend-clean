import { useEffect, useMemo, useState } from "react";
import SectionCard from "../../../components/SectionCard";
import EmptyState from "../../../components/EmptyState";
import PlanPreview from "./PlanPreview";

import { usePlans } from "../hooks/usePlans";
import { usePlanVersions } from "../hooks/usePlanVersions";
import { useCreatePlan } from "../hooks/useCreatePlan";
import CreatePlanModal from "./CreatePlanModal";

export default function PlansPanel({ projectId }: { projectId: string }) {
  const plansQ = usePlans(projectId);
  const create = useCreatePlan(projectId);

  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const versionsQ = usePlanVersions(activePlanId);
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);

  const plans = plansQ.data || [];
  const versions = versionsQ.data || [];

  // auto-select first plan
  useEffect(() => {
    if (!activePlanId && plans.length > 0) setActivePlanId(plans[0]._id);
  }, [plans, activePlanId]);

  // auto-select latest version
  useEffect(() => {
    if (versions.length > 0) {
      const latest = [...versions].sort(
        (a, b) => b.versionNumber - a.versionNumber
      )[0];
      setActiveVersionId(latest._id);
    } else {
      setActiveVersionId(null);
    }
  }, [versions]);

  const previewVersion = useMemo(
    () => versions.find((v) => v._id === activeVersionId) || null,
    [versions, activeVersionId]
  );

  if (plansQ.isLoading) {
    return <div className="h-40 bg-slate-200 animate-pulse rounded-2xl" />;
  }

  if (plansQ.isError) {
    return (
      <EmptyState
        title="Failed to load plans"
        subtitle={
          (plansQ.error as any)?.response?.data?.message ||
          (plansQ.error as Error).message
        }
      />
    );
  }

  async function onCreate(dto: {
    projectId: string;
    name: string;
    description?: string;
  }) {
    const p = await create.mutateAsync(dto);
    setCreateOpen(false);

    // auto-open created plan
    setActivePlanId(p._id);
    setActiveVersionId(null);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Left side */}
      <div className="lg:col-span-2 space-y-4">
        <SectionCard
          title="Plans"
          right={
            <button
              onClick={() => setCreateOpen(true)}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 px-3 py-2 text-xs font-semibold text-white"
            >
              + New Plan
            </button>
          }
        >
          {!plans.length ? (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
              No plans yet. Create the first plan.
            </div>
          ) : (
            <div className="space-y-2">
              {plans.map((p) => (
                <button
                  key={p._id}
                  onClick={() => {
                    setActivePlanId(p._id);
                    setActiveVersionId(null);
                  }}
                  className={[
                    "w-full text-left rounded-xl border px-4 py-3 transition",
                    p._id === activePlanId
                      ? "border-slate-900 bg-slate-50"
                      : "border-slate-200 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div className="font-semibold text-slate-900">
                    {p.name || p.title}
                  </div>
                  {p.description ? (
                    <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {p.description}
                    </div>
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Versions">
          {!activePlanId ? (
            <div className="text-sm text-slate-600">
              Select a plan to view versions.
            </div>
          ) : versionsQ.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-slate-200 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : versionsQ.isError ? (
            <div className="text-sm text-red-700">
              {(versionsQ.error as any)?.response?.data?.message ||
                (versionsQ.error as Error).message}
            </div>
          ) : versions.length === 0 ? (
            <div className="text-sm text-slate-600">No versions yet.</div>
          ) : (
            <div className="space-y-2">
              {[...versions]
                .sort((a, b) => b.versionNumber - a.versionNumber)
                .map((v) => (
                  <button
                    key={v._id}
                    onClick={() => setActiveVersionId(v._id)}
                    className={[
                      "w-full text-left rounded-xl border px-4 py-3 transition",
                      v._id === activeVersionId
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <div className="font-medium text-slate-900">
                      Version #{v.versionNumber}
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-1">
                      {v.file?.originalName || v.file?.publicId}
                    </div>
                  </button>
                ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Right side */}
      <div className="lg:col-span-3">
        <PlanPreview file={previewVersion?.file || null} />
      </div>

      {createOpen && (
        <CreatePlanModal
          projectId={projectId}
          onClose={() => setCreateOpen(false)}
          onCreate={onCreate}
          isPending={create.isPending}
          errorMessage={
            create.isError
              ? (create.error as any)?.response?.data?.message ||
                (create.error as Error).message
              : null
          }
        />
      )}
    </div>
  );
}
