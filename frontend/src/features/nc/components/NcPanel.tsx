// src/features/nc/components/NcPanel.tsx
import { useMemo, useState } from "react";
import EmptyState from "../../../components/EmptyState";

import NcCard from "./NcCard";
import NcAssignModal, { type MemberForSelect } from "./NcAssignModal";
import NcStatusModal from "./NcStatusModal";
import NcDrawer from "./NcDrawer";

import { useNcList } from "../hooks/useNcList";
import { useCreateNc } from "../hooks/useCreateNc";
import { useAssignNc } from "../hooks/useAssignNc";
import { useChangeNcStatus } from "../hooks/useChangeNcStatus";
import { useNcRealtime } from "../hooks/useNcRealtime";

import { useProjectMembers } from "../../projects/hooks/useProjectMembers";
import type { Nc, NcStatus, NcPriority } from "../api/nc.api";
import NcCreateModal from "./CreateNcModal";

type StatusFilter = NcStatus | "ALL";
type PriorityFilter = NcPriority | "ALL";

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-1.5 rounded-full text-xs font-semibold border transition",
        active
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function resolveAssignedLabel(nc: Nc, membersMap: Record<string, string>) {
  const a = (nc as any)?.assignedTo;

  if (!a) return "—";

  // populated user object (best)
  if (typeof a === "object") {
    return a.name || a.email || a._id || "—";
  }

  // string id fallback -> map
  if (typeof a === "string") return membersMap[a] || a;

  return "—";
}

export default function NcPanel({ projectId }: { projectId: string }) {
  // realtime
  useNcRealtime(projectId);

  const q = useNcList(projectId);
  const create = useCreateNc();
  const assign = useAssignNc(projectId);
  const change = useChangeNcStatus(projectId);

  const { members, membersMap } = useProjectMembers(projectId);

  const membersForSelect: MemberForSelect[] = useMemo(() => {
    return members.map((m) => ({
      userId: m.user._id,
      label: m.user.name || m.user.email || m.user._id,
      role: m.role,
    }));
  }, [members]);

  const [search, setSearch] = useState("");

  // filters
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("ALL");

  // Modals + drawer state
  const [createOpen, setCreateOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selected, setSelected] = useState<Nc | null>(null);

  const counts = useMemo(() => {
    const list = q.data || [];
    const byStatus: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    for (const x of list) {
      byStatus[x.status] = (byStatus[x.status] || 0) + 1;
      byPriority[x.priority] = (byPriority[x.priority] || 0) + 1;
    }
    return { byStatus, byPriority, total: list.length };
  }, [q.data]);

  const filtered = useMemo(() => {
    let list = q.data || [];

    const s = search.trim().toLowerCase();
    if (s) {
      list = list.filter(
        (x) =>
          x.title.toLowerCase().includes(s) ||
          (x.description || "").toLowerCase().includes(s)
      );
    }

    if (statusFilter !== "ALL") {
      list = list.filter((x) => x.status === statusFilter);
    }

    if (priorityFilter !== "ALL") {
      list = list.filter((x) => x.priority === priorityFilter);
    }

    return list;
  }, [q.data, search, statusFilter, priorityFilter]);

  if (q.isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 rounded-xl bg-slate-200 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-slate-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (q.isError) {
    return (
      <EmptyState
        title="Failed to load NC"
        subtitle={
          (q.error as any)?.response?.data?.message ||
          (q.error as Error).message
        }
        action={
          <button
            onClick={() => q.refetch()}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Retry
          </button>
        }
      />
    );
  }

  function openNc(nc: Nc) {
    setSelected(nc);
    setDrawerOpen(true);
  }

  async function doCreate(p: {
    title: string;
    description?: string;
    priority?: NcPriority;
  }) {
    await create.mutateAsync({
      projectId,
      title: p.title,
      description: p.description,
      priority: p.priority,
    });
    setCreateOpen(false);
  }

  async function doAssign(userId: string) {
    if (!selected) return;
    await assign.mutateAsync({ ncId: selected._id, assignedTo: userId });
    setAssignOpen(false);
  }

  async function doChangeStatus(status: NcStatus, comment?: string) {
    if (!selected) return;
    await change.mutateAsync({ ncId: selected._id, status, comment });
    setStatusOpen(false);
  }

  const list = filtered;

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-xl font-extrabold text-slate-900">NC</div>
          <div className="text-sm text-slate-500">
            Track non-conformities (create, assign, status)
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
            onClick={() => setCreateOpen(true)}
            className="shrink-0 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
          >
            + New
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Chip
          active={statusFilter === "ALL"}
          label={`All (${counts.total})`}
          onClick={() => setStatusFilter("ALL")}
        />
        <Chip
          active={statusFilter === "OPEN"}
          label={`Open (${counts.byStatus.OPEN || 0})`}
          onClick={() => setStatusFilter("OPEN")}
        />
        <Chip
          active={statusFilter === "IN_PROGRESS"}
          label={`In Progress (${counts.byStatus.IN_PROGRESS || 0})`}
          onClick={() => setStatusFilter("IN_PROGRESS")}
        />
        <Chip
          active={statusFilter === "RESOLVED"}
          label={`Resolved (${counts.byStatus.RESOLVED || 0})`}
          onClick={() => setStatusFilter("RESOLVED")}
        />
        <Chip
          active={statusFilter === "VALIDATED"}
          label={`Validated (${counts.byStatus.VALIDATED || 0})`}
          onClick={() => setStatusFilter("VALIDATED")}
        />

        <div className="w-full h-px bg-slate-100 my-1" />

        <Chip
          active={priorityFilter === "ALL"}
          label="Priority: All"
          onClick={() => setPriorityFilter("ALL")}
        />
        {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((p) => (
          <Chip
            key={p}
            active={priorityFilter === p}
            label={`${p} (${counts.byPriority[p] || 0})`}
            onClick={() => setPriorityFilter(p)}
          />
        ))}
      </div>

      {/* List */}
      {list.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="font-semibold text-slate-900">No NC found</div>
          <div className="text-sm text-slate-600 mt-1">
            Try changing filters or create a new NC.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((nc) => (
            <NcCard
              key={nc._id}
              nc={nc}
              onOpen={() => openNc(nc)}
              assignedLabel={resolveAssignedLabel(nc, membersMap)}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      <NcCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={doCreate}
        isPending={create.isPending}
        errorMessage={
          create.isError
            ? (create.error as any)?.response?.data?.message ||
              (create.error as Error).message
            : undefined
        }
      />

      {/* Drawer (with history inside) */}
      <NcDrawer
        open={drawerOpen}
        nc={selected}
        onClose={() => setDrawerOpen(false)}
        onAssignClick={() => setAssignOpen(true)}
        onStatusClick={() => setStatusOpen(true)}
      />

      {/* Assign modal */}
      <NcAssignModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        members={membersForSelect}
        onAssign={doAssign}
        isPending={assign.isPending}
        errorMessage={
          assign.isError
            ? (assign.error as any)?.response?.data?.message ||
              (assign.error as Error).message
            : undefined
        }
      />

      {/* Status modal */}
      <NcStatusModal
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        current={(selected?.status || "OPEN") as NcStatus}
        onChange={doChangeStatus}
        isPending={change.isPending}
        errorMessage={
          change.isError
            ? (change.error as any)?.response?.data?.message ||
              (change.error as Error).message
            : undefined
        }
      />
    </div>
  );
}
