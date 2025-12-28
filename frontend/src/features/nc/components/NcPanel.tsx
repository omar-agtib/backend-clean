import { useMemo, useState } from "react";
import { useNcList } from "../hooks/useNcList";
import { useCreateNc } from "../hooks/useCreateNc";
import { useAssignNc } from "../hooks/useAssignNc";
import { useChangeNcStatus } from "../hooks/useChangeNcStatus";
import type { NC } from "../api/nc.api";
import { NcPriorityBadge, NcStatusBadge } from "./NcBadge";
import CreateNcModal from "./CreateNcModal";
import NcRowActions from "./NcRowActions";

export default function NcPanel({ projectId }: { projectId: string }) {
  const q = useNcList(projectId);
  const create = useCreateNc(projectId);
  const assign = useAssignNc(projectId);
  const changeStatus = useChangeNcStatus(projectId);

  const [openCreate, setOpenCreate] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const list = q.data || [];
    const s = search.trim().toLowerCase();
    if (!s) return list;
    return list.filter(
      (n) =>
        n.title.toLowerCase().includes(s) ||
        (n.description || "").toLowerCase().includes(s) ||
        (n.status || "").toLowerCase().includes(s)
    );
  }, [q.data, search]);

  const busy = create.isPending || assign.isPending || changeStatus.isPending;

  function prettyTime(iso: string) {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  }

  if (q.isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 rounded-xl bg-slate-200 animate-pulse" />
        <div className="h-28 rounded-2xl bg-slate-200 animate-pulse" />
        <div className="h-28 rounded-2xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  if (q.isError) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-6">
        <div className="font-semibold text-red-800">Failed to load NCs</div>
        <div className="text-red-700 text-sm mt-1">
          {(q.error as any)?.response?.data?.message ||
            (q.error as Error).message}
        </div>
      </div>
    );
  }

  const list = filtered;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-2xl font-extrabold text-slate-900">
            Non-Conformities
          </div>
          <div className="text-sm text-slate-500">
            Create, assign, and move status (workflow rules enforced by backend)
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search NC..."
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

      {/* Empty */}
      {list.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="font-semibold text-slate-900">No NCs found</div>
          <div className="text-sm text-slate-600 mt-1">
            Create one to start tracking quality issues.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((nc: NC) => (
            <div
              key={nc._id}
              className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-[220px]">
                  <div className="font-extrabold text-slate-900">
                    {nc.title}
                  </div>
                  {nc.description ? (
                    <div className="text-sm text-slate-600 mt-1">
                      {nc.description}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400 mt-1">
                      No description
                    </div>
                  )}

                  <div className="text-xs text-slate-400 mt-2">
                    Updated: {prettyTime(nc.updatedAt)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <NcStatusBadge status={nc.status} />
                  <NcPriorityBadge priority={nc.priority} />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-slate-700 mb-2">
                  <span className="font-semibold">AssignedTo:</span>{" "}
                  <span className="text-slate-600">{nc.assignedTo || "—"}</span>
                </div>

                <NcRowActions
                  nc={nc}
                  busy={busy}
                  onAssign={(assignedTo) =>
                    assign.mutateAsync({ ncId: nc._id, assignedTo })
                  }
                  onStatus={(status, comment) =>
                    changeStatus.mutateAsync({ ncId: nc._id, status, comment })
                  }
                />

                {(assign.isError || changeStatus.isError) && (
                  <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                    {(assign.error as any)?.response?.data?.message ||
                      (changeStatus.error as any)?.response?.data?.message ||
                      (assign.error as Error)?.message ||
                      (changeStatus.error as Error)?.message}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {openCreate && (
        <CreateNcModal
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
            await create.mutateAsync(dto);
            setOpenCreate(false);
          }}
        />
      )}
    </div>
  );
}
