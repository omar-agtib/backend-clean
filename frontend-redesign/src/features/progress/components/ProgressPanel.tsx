// src/features/progress/components/ProgressPanel.tsx
import { useMemo, useState } from "react";
import SectionCard from "../../../components/SectionCard";
import EmptyState from "../../../components/EmptyState";

import { useMilestonesByProject } from "../hooks/useMilestonesByProject";
import { useMilestoneSummary } from "../hooks/useMilestoneSummary";
import { useCreateMilestone } from "../hooks/useCreateMilestone";
import { useUpdateMilestoneProgress } from "../hooks/useUpdateMilestoneProgress";
import { useDeleteMilestone } from "../hooks/useDeleteMilestone";
import { useProgressRealtime } from "../hooks/useProgressRealtime";

import type { Milestone } from "../api/progress.api";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function ProgressPanel({ projectId }: { projectId: string }) {
  // realtime
  useProgressRealtime(projectId);

  const listQ = useMilestonesByProject(projectId);
  const sumQ = useMilestoneSummary(projectId);

  const createM = useCreateMilestone(projectId);
  const updateM = useUpdateMilestoneProgress(projectId);
  const delM = useDeleteMilestone(projectId);

  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");

  const milestones = listQ.data || [];

  const ordered = useMemo(() => {
    return [...milestones].sort((a, b) => {
      const ac = a.completed ? 1 : 0;
      const bc = b.completed ? 1 : 0;
      if (ac !== bc) return ac - bc; // incomplete first
      return (a.createdAt || "").localeCompare(b.createdAt || "");
    });
  }, [milestones]);

  async function submitCreate() {
    const n = name.trim();
    if (!n) return;

    await createM.mutateAsync({ projectId, name: n });
    setName("");
    setCreateOpen(false);
  }

  async function setProgress(m: Milestone, p: number) {
    await updateM.mutateAsync({
      milestoneId: m._id,
      progress: clamp(p, 0, 100),
    });
  }

  async function remove(m: Milestone) {
    await delM.mutateAsync(m._id);
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600">Milestones</div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {sumQ.data ? sumQ.data.totals.total : sumQ.isLoading ? "…" : 0}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600">Completed</div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {sumQ.data ? sumQ.data.totals.completed : sumQ.isLoading ? "…" : 0}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Remaining:{" "}
            {sumQ.data ? sumQ.data.totals.remaining : sumQ.isLoading ? "…" : 0}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600">Completion</div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {sumQ.data
              ? `${sumQ.data.completionRate}%`
              : sumQ.isLoading
              ? "…"
              : "0%"}
          </div>

          <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-slate-900"
              style={{ width: `${sumQ.data?.completionRate ?? 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* List */}
      <SectionCard
        title="Milestones"
        right={
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white"
          >
            + Add milestone
          </button>
        }
      >
        {listQ.isLoading ? (
          <div className="h-28 rounded-xl bg-slate-200 animate-pulse" />
        ) : listQ.isError ? (
          <EmptyState
            title="Failed to load milestones"
            subtitle={
              (listQ.error as any)?.response?.data?.message ||
              (listQ.error as Error).message
            }
            action={
              <button
                type="button"
                onClick={() => listQ.refetch()}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Retry
              </button>
            }
          />
        ) : ordered.length === 0 ? (
          <div className="text-sm text-slate-600">
            No milestones yet. Click{" "}
            <span className="font-semibold">+ Add milestone</span>.
          </div>
        ) : (
          <div className="space-y-2">
            {ordered.map((m) => (
              <div
                key={m._id}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-extrabold text-slate-900 truncate">
                        {m.name}
                      </div>
                      {m.completed ? (
                        <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-xs font-extrabold">
                          DONE
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-50 text-slate-700 border border-slate-200 px-2 py-0.5 text-xs font-extrabold">
                          {m.progress}%
                        </span>
                      )}
                    </div>

                    <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-slate-900"
                        style={{ width: `${m.progress}%` }}
                      />
                    </div>

                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      {[0, 25, 50, 75, 100].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setProgress(m, p)}
                          disabled={updateM.isPending}
                          className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-900 disabled:opacity-60"
                        >
                          {p}%
                        </button>
                      ))}

                      <input
                        type="number"
                        min={0}
                        max={100}
                        defaultValue={m.progress}
                        onBlur={(e) => {
                          const v = Number(e.target.value);
                          if (Number.isNaN(v)) return;
                          setProgress(m, v);
                        }}
                        className="w-24 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-slate-900"
                        title="Type progress then click outside"
                      />
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => remove(m)}
                      disabled={delM.isPending}
                      className="rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 text-xs font-bold text-red-700 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {(createM.isError || updateM.isError || delM.isError) && (
          <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {(createM.error as any)?.response?.data?.message ||
              (updateM.error as any)?.response?.data?.message ||
              (delM.error as any)?.response?.data?.message ||
              (createM.error as Error)?.message ||
              (updateM.error as Error)?.message ||
              (delM.error as Error)?.message}
          </div>
        )}
      </SectionCard>

      {/* Create modal */}
      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setCreateOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-extrabold text-slate-900">
                  Add milestone
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  Example: Foundation, Plumbing, Painting...
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Concrete foundation"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitCreate}
                  disabled={createM.isPending || !name.trim()}
                  className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-900 text-white disabled:opacity-60"
                >
                  {createM.isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
