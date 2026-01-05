// src/pages/ToolsPage.tsx
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import { useProjectStore } from "../store/projectStore";

import { useToolInventory } from "../features/tools/hooks/useToolInventory";
import { useAvailableTools } from "../features/tools/hooks/useAvailableTools";
import {
  useActiveAssignedTools,
  useAssignmentsHistory,
} from "../features/tools/hooks/useProjectToolAssignments";
import { useMaintenanceHistory } from "../features/tools/hooks/useProjectToolMaintenance";

import { useCreateTool } from "../features/tools/hooks/useCreateTool";
import { useAssignTool } from "../features/tools/hooks/useAssignTool";
import { useReturnTool } from "../features/tools/hooks/useReturnTool";
import {
  useCompleteMaintenance,
  useStartMaintenance,
} from "../features/tools/hooks/useMaintenanceMutations";

import type {
  Tool,
  ToolAssignment,
  ToolMaintenance,
} from "../features/tools/api/tools.api";

// ✅ members picker
import { useProjectMembers } from "../features/projects/hooks/useProjectMembers";

function TabButton({
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
      type="button"
      onClick={onClick}
      className={[
        "rounded-xl px-3 py-2 text-sm font-semibold transition",
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 hover:bg-slate-200 text-slate-900",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export default function ToolsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const activeProjectName = useProjectStore((s) => s.activeProjectName);

  // Queries
  const invQ = useToolInventory();
  const availQ = useAvailableTools();

  const activeAssignedQ = useActiveAssignedTools(projectId);
  const historyQ = useAssignmentsHistory(projectId);
  const maintenanceQ = useMaintenanceHistory(projectId);

  // ✅ Members query (used for Assign UI + label fallback)
  const membersQ = useProjectMembers(projectId || null);
  const members = membersQ.members || [];
  const membersMap = membersQ.membersMap || {};

  // Mutations
  const createTool = useCreateTool();
  const assign = useAssignTool(projectId as string);
  const ret = useReturnTool(projectId as string);
  const startMaint = useStartMaintenance(projectId as string);
  const completeMaint = useCompleteMaintenance(projectId as string);

  const [tab, setTab] = useState<
    "inventory" | "available" | "assigned" | "history" | "maintenance"
  >("assigned");

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [toolName, setToolName] = useState("");
  const [serial, setSerial] = useState("");

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignToolId, setAssignToolId] = useState<string>("");
  const [assignedToId, setAssignedToId] = useState<string>("");

  const [maintOpen, setMaintOpen] = useState(false);
  const [maintToolId, setMaintToolId] = useState<string>("");
  const [maintDesc, setMaintDesc] = useState("");

  const inventory = invQ.data || [];
  const available = availQ.data || [];
  const activeAssigned = activeAssignedQ.data || [];
  const history = historyQ.data || [];
  const maint = maintenanceQ.data || [];

  const header = useMemo(() => {
    if (!projectId) return "Tools";
    return `Tools — ${activeProjectName || projectId}`;
  }, [projectId, activeProjectName]);

  function renderError(err: any) {
    return err?.response?.data?.message || (err as Error)?.message || "Error";
  }

  function labelUser(u: any) {
    const id =
      typeof u === "string"
        ? u
        : u?._id || u?.id || u?.userId || u?.assignedTo || "";
    if (!id) return "Unknown user";

    // Prefer populated user
    if (typeof u === "object" && u) {
      return u?.name || u?.email || membersMap[id] || id;
    }

    // fallback to membersMap
    return membersMap[id] || id;
  }

  async function submitCreate() {
    if (!toolName.trim()) return;

    await createTool.mutateAsync({
      name: toolName.trim(),
      serialNumber: serial.trim() || undefined,
    });

    setToolName("");
    setSerial("");
    setCreateOpen(false);
  }

  async function submitAssign() {
    if (!projectId) return;
    if (!assignToolId) return;
    if (!assignedToId) return;

    await assign.mutateAsync({
      toolId: assignToolId,
      projectId,
      assignedTo: assignedToId,
    });

    setAssignToolId("");
    setAssignedToId("");
    setAssignOpen(false);
  }

  async function submitMaintenance() {
    if (!projectId) return;
    if (!maintToolId || !maintDesc.trim()) return;

    await startMaint.mutateAsync({
      toolId: maintToolId,
      projectId,
      description: maintDesc.trim(),
    });

    setMaintToolId("");
    setMaintDesc("");
    setMaintOpen(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-2xl font-extrabold text-slate-900">{header}</div>
          <div className="text-sm text-slate-500">
            Inventory + assignments + maintenance
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => setCreateOpen(true)}
          >
            + New Tool
          </button>

          <button
            type="button"
            className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900"
            onClick={() => setAssignOpen(true)}
          >
            Assign Tool
          </button>

          <button
            type="button"
            className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900"
            onClick={() => setMaintOpen(true)}
          >
            Start Maintenance
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <TabButton
          active={tab === "assigned"}
          label={`Assigned (${activeAssigned.length})`}
          onClick={() => setTab("assigned")}
        />
        <TabButton
          active={tab === "history"}
          label={`History (${history.length})`}
          onClick={() => setTab("history")}
        />
        <TabButton
          active={tab === "maintenance"}
          label={`Maintenance (${maint.length})`}
          onClick={() => setTab("maintenance")}
        />
        <TabButton
          active={tab === "available"}
          label={`Available (${available.length})`}
          onClick={() => setTab("available")}
        />
        <TabButton
          active={tab === "inventory"}
          label={`Inventory (${inventory.length})`}
          onClick={() => setTab("inventory")}
        />
      </div>

      {/* Assigned */}
      {tab === "assigned" && (
        <SectionCard title="Active assigned tools">
          {activeAssignedQ.isLoading ? (
            <div className="h-24 rounded-2xl bg-slate-200 animate-pulse" />
          ) : activeAssignedQ.isError ? (
            <div className="text-sm text-red-700">
              {renderError(activeAssignedQ.error)}
            </div>
          ) : activeAssigned.length === 0 ? (
            <div className="text-sm text-slate-600">
              No active assigned tools.
            </div>
          ) : (
            <div className="space-y-2">
              {activeAssigned.map((a: ToolAssignment) => {
                const tool = a.toolId as Tool;
                return (
                  <div
                    key={a._id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">
                        {tool?.name || "Tool"}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Assigned to: {labelUser(a.assignedTo)}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {new Date(a.assignedAt).toLocaleString()}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="rounded-xl bg-slate-900 hover:bg-slate-800 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                      disabled={ret.isPending}
                      onClick={() =>
                        ret.mutate({
                          toolId: (tool as any)?._id || String(a.toolId),
                        })
                      }
                      title="Return tool"
                    >
                      {ret.isPending ? "Returning..." : "Return"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {ret.isError ? (
            <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {renderError(ret.error)}
            </div>
          ) : null}
        </SectionCard>
      )}

      {/* History */}
      {tab === "history" && (
        <SectionCard title="Assignment history">
          {historyQ.isLoading ? (
            <div className="h-24 rounded-2xl bg-slate-200 animate-pulse" />
          ) : historyQ.isError ? (
            <div className="text-sm text-red-700">
              {renderError(historyQ.error)}
            </div>
          ) : history.length === 0 ? (
            <div className="text-sm text-slate-600">No assignments yet.</div>
          ) : (
            <div className="space-y-2">
              {history.map((a: ToolAssignment) => {
                const tool = a.toolId as Tool;
                const returned = !!a.returnedAt;

                return (
                  <div
                    key={a._id}
                    className="rounded-xl border border-slate-200 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-slate-900">
                        {tool?.name || "Tool"}
                      </div>
                      <span
                        className={[
                          "text-xs font-semibold rounded-full px-2 py-1",
                          returned
                            ? "bg-slate-100 text-slate-700"
                            : "bg-slate-900 text-white",
                        ].join(" ")}
                      >
                        {returned ? "Returned" : "Active"}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-2">
                      To: {labelUser(a.assignedTo)} · By:{" "}
                      {labelUser(a.assignedBy)}
                    </div>

                    <div className="text-xs text-slate-400 mt-1">
                      Assigned: {new Date(a.assignedAt).toLocaleString()}
                      {a.returnedAt
                        ? ` · Returned: ${new Date(
                            a.returnedAt
                          ).toLocaleString()}`
                        : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      )}

      {/* Maintenance */}
      {tab === "maintenance" && (
        <SectionCard title="Maintenance history">
          {maintenanceQ.isLoading ? (
            <div className="h-24 rounded-2xl bg-slate-200 animate-pulse" />
          ) : maintenanceQ.isError ? (
            <div className="text-sm text-red-700">
              {renderError(maintenanceQ.error)}
            </div>
          ) : maint.length === 0 ? (
            <div className="text-sm text-slate-600">
              No maintenance records.
            </div>
          ) : (
            <div className="space-y-2">
              {maint.map((m: ToolMaintenance) => {
                const tool = m.toolId as Tool;
                const done = !!m.completedAt;

                return (
                  <div
                    key={m._id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-3"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">
                        {tool?.name || "Tool"}
                      </div>
                      <div className="text-sm text-slate-700 mt-1">
                        {m.description}
                      </div>
                      <div className="text-xs text-slate-400 mt-2">
                        Started: {new Date(m.startedAt).toLocaleString()}
                        {m.completedAt
                          ? ` · Completed: ${new Date(
                              m.completedAt
                            ).toLocaleString()}`
                          : ""}
                      </div>
                    </div>

                    {!done ? (
                      <button
                        type="button"
                        className="rounded-xl bg-slate-900 hover:bg-slate-800 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                        disabled={completeMaint.isPending}
                        onClick={() =>
                          completeMaint.mutate({ maintenanceId: m._id })
                        }
                        title="Complete maintenance"
                      >
                        {completeMaint.isPending ? "Completing..." : "Complete"}
                      </button>
                    ) : (
                      <span className="text-xs font-semibold rounded-full bg-slate-100 text-slate-700 px-2 py-1">
                        Completed
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {startMaint.isError ? (
            <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {renderError(startMaint.error)}
            </div>
          ) : null}

          {completeMaint.isError ? (
            <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {renderError(completeMaint.error)}
            </div>
          ) : null}
        </SectionCard>
      )}

      {/* Available */}
      {tab === "available" && (
        <SectionCard title="Available tools (inventory)">
          {availQ.isLoading ? (
            <div className="h-24 rounded-2xl bg-slate-200 animate-pulse" />
          ) : availQ.isError ? (
            <div className="text-sm text-red-700">
              {renderError(availQ.error)}
            </div>
          ) : available.length === 0 ? (
            <div className="text-sm text-slate-600">No available tools.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {available.map((t: Tool) => (
                <div
                  key={t._id}
                  className="rounded-xl border border-slate-200 p-3"
                >
                  <div className="font-semibold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    SN: {t.serialNumber || "—"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* Inventory */}
      {tab === "inventory" && (
        <SectionCard title="All tools (inventory)">
          {invQ.isLoading ? (
            <div className="h-24 rounded-2xl bg-slate-200 animate-pulse" />
          ) : invQ.isError ? (
            <div className="text-sm text-red-700">
              {renderError(invQ.error)}
            </div>
          ) : inventory.length === 0 ? (
            <div className="text-sm text-slate-600">No tools yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {inventory.map((t: Tool) => (
                <div
                  key={t._id}
                  className="rounded-xl border border-slate-200 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-slate-900">{t.name}</div>
                    <span className="text-xs font-semibold rounded-full bg-slate-100 text-slate-700 px-2 py-1">
                      {t.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    SN: {t.serialNumber || "—"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* CREATE TOOL MODAL */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setCreateOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-extrabold text-slate-900">
                  Create Tool
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  Add a tool to inventory
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
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Hammer"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Serial number (optional)
                </label>
                <input
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="SN-001"
                />
              </div>

              {createTool.isError ? (
                <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                  {renderError(createTool.error)}
                </div>
              ) : null}

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
                  disabled={createTool.isPending || !toolName.trim()}
                  className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-900 text-white disabled:opacity-60"
                >
                  {createTool.isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN TOOL MODAL (UPDATED WITH MEMBERS PICKER) */}
      {assignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setAssignOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-extrabold text-slate-900">
                  Assign Tool
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  Pick a tool + member
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAssignOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Tool
                </label>
                <select
                  value={assignToolId}
                  onChange={(e) => setAssignToolId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  <option value="">Select tool</option>
                  {available.map((t: Tool) => (
                    <option key={t._id} value={t._id}>
                      {t.name} {t.serialNumber ? `(${t.serialNumber})` : ""}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-slate-500 mt-1">
                  Only AVAILABLE tools are shown here.
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Member
                </label>
                <select
                  value={assignedToId}
                  onChange={(e) => setAssignedToId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  disabled={membersQ.isLoading || members.length === 0}
                >
                  <option value="">
                    {membersQ.isLoading
                      ? "Loading members..."
                      : members.length === 0
                      ? "No members found"
                      : "Select member"}
                  </option>
                  {members.map((m) => (
                    <option key={m.user._id} value={m.user._id}>
                      {m.user.name || m.user.email || m.user._id} — {m.role}
                    </option>
                  ))}
                </select>
                {membersQ.isError ? (
                  <div className="text-xs text-red-700 mt-1">
                    Failed to load members: {renderError(membersQ.error)}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 mt-1">
                    Members come from: GET /api/projects/:projectId
                  </div>
                )}
              </div>

              {assign.isError ? (
                <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                  {renderError(assign.error)}
                </div>
              ) : null}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitAssign}
                  disabled={
                    assign.isPending || !assignToolId || !assignedToId.trim()
                  }
                  className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-900 text-white disabled:opacity-60"
                >
                  {assign.isPending ? "Assigning..." : "Assign"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAINTENANCE MODAL */}
      {maintOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMaintOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-extrabold text-slate-900">
                  Start Maintenance
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  Set a tool to MAINTENANCE
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMaintOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Tool
                </label>
                <select
                  value={maintToolId}
                  onChange={(e) => setMaintToolId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  <option value="">Select tool</option>
                  {inventory
                    .filter((t: Tool) => t.status !== "ASSIGNED")
                    .map((t: Tool) => (
                      <option key={t._id} value={t._id}>
                        {t.name} — {t.status}
                      </option>
                    ))}
                </select>
                <div className="text-xs text-slate-500 mt-1">
                  You can’t start maintenance if tool is ASSIGNED.
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  value={maintDesc}
                  onChange={(e) => setMaintDesc(e.target.value)}
                  className="mt-1 w-full min-h-[90px] rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Broken handle, needs repair..."
                />
              </div>

              {startMaint.isError ? (
                <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                  {renderError(startMaint.error)}
                </div>
              ) : null}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMaintOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitMaintenance}
                  disabled={
                    startMaint.isPending || !maintToolId || !maintDesc.trim()
                  }
                  className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-900 text-white disabled:opacity-60"
                >
                  {startMaint.isPending ? "Starting..." : "Start"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
