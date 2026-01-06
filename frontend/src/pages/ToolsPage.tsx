// src/pages/ToolsPage.tsx
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
        "whitespace-nowrap rounded-xl px-3 py-2 text-sm font-bold transition border",
        active
          ? "bg-primary text-primaryForeground border-transparent"
          : "bg-card border-border hover:bg-muted",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function formatDate(v: any) {
  try {
    return new Date(v).toLocaleString();
  } catch {
    return String(v || "");
  }
}

export default function ToolsPage() {
  const { t } = useTranslation();

  const { projectId } = useParams<{ projectId: string }>();
  const activeProjectName = useProjectStore((s) => s.activeProjectName);

  // Queries (unchanged)
  const invQ = useToolInventory();
  const availQ = useAvailableTools();

  const activeAssignedQ = useActiveAssignedTools(projectId);
  const historyQ = useAssignmentsHistory(projectId);
  const maintenanceQ = useMaintenanceHistory(projectId);

  // Members query (unchanged)
  const membersQ = useProjectMembers(projectId || null);
  const members = membersQ.members || [];
  const membersMap = membersQ.membersMap || {};

  // Mutations (unchanged)
  const createTool = useCreateTool();
  const assign = useAssignTool(projectId as string);
  const ret = useReturnTool(projectId as string);
  const startMaint = useStartMaintenance(projectId as string);
  const completeMaint = useCompleteMaintenance(projectId as string);

  const [tab, setTab] = useState<
    "inventory" | "available" | "assigned" | "history" | "maintenance"
  >("assigned");

  // Modals (unchanged state)
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
    if (!projectId) return t("tools.pageTitle");
    return `${t("tools.pageTitle")} — ${activeProjectName || projectId}`;
  }, [projectId, activeProjectName, t]);

  function renderError(err: any) {
    return (
      err?.response?.data?.message ||
      (err as Error)?.message ||
      t("common.error")
    );
  }

  function labelUser(u: any) {
    const id =
      typeof u === "string"
        ? u
        : u?._id || u?.id || u?.userId || u?.assignedTo || "";
    if (!id) return t("tools.unknownUser");

    if (typeof u === "object" && u) {
      return u?.name || u?.email || membersMap[id] || id;
    }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="text-2xl font-extrabold truncate">{header}</div>
          <div className="text-sm text-mutedForeground mt-1">
            {t("tools.subtitle")}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setCreateOpen(true)}
          >
            {t("tools.actions.newTool")}
          </button>

          <button
            type="button"
            className="btn-outline"
            onClick={() => setAssignOpen(true)}
          >
            {t("tools.actions.assignTool")}
          </button>

          <button
            type="button"
            className="btn-outline"
            onClick={() => setMaintOpen(true)}
          >
            {t("tools.actions.startMaintenance")}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
        <TabButton
          active={tab === "assigned"}
          label={t("tools.tabs.assigned", { n: activeAssigned.length })}
          onClick={() => setTab("assigned")}
        />
        <TabButton
          active={tab === "history"}
          label={t("tools.tabs.history", { n: history.length })}
          onClick={() => setTab("history")}
        />
        <TabButton
          active={tab === "maintenance"}
          label={t("tools.tabs.maintenance", { n: maint.length })}
          onClick={() => setTab("maintenance")}
        />
        <TabButton
          active={tab === "available"}
          label={t("tools.tabs.available", { n: available.length })}
          onClick={() => setTab("available")}
        />
        <TabButton
          active={tab === "inventory"}
          label={t("tools.tabs.inventory", { n: inventory.length })}
          onClick={() => setTab("inventory")}
        />
      </div>

      {/* Assigned */}
      {tab === "assigned" && (
        <SectionCard title={t("tools.sections.activeAssigned")}>
          {activeAssignedQ.isLoading ? (
            <div className="h-24 rounded-2xl bg-muted animate-pulse" />
          ) : activeAssignedQ.isError ? (
            <div className="text-sm text-danger">
              {renderError(activeAssignedQ.error)}
            </div>
          ) : activeAssigned.length === 0 ? (
            <div className="text-sm text-mutedForeground">
              {t("tools.empty.activeAssigned")}
            </div>
          ) : (
            <div className="space-y-2">
              {activeAssigned.map((a: ToolAssignment) => {
                const tool = a.toolId as Tool;
                return (
                  <div
                    key={a._id}
                    className="card p-4 flex items-center justify-between gap-3 flex-wrap"
                  >
                    <div className="min-w-0">
                      <div className="font-extrabold truncate">
                        {tool?.name || t("tools.toolFallback")}
                      </div>
                      <div className="text-xs text-mutedForeground mt-1">
                        {t("tools.labels.assignedTo")}:{" "}
                        <span className="font-semibold text-foreground">
                          {labelUser(a.assignedTo)}
                        </span>
                      </div>
                      <div className="text-xs text-mutedForeground mt-1">
                        {formatDate(a.assignedAt)}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-primary disabled:opacity-60"
                      disabled={ret.isPending}
                      onClick={() =>
                        ret.mutate({
                          toolId: (tool as any)?._id || String(a.toolId),
                        })
                      }
                      title={t("tools.actions.returnTool")}
                    >
                      {ret.isPending
                        ? t("tools.actions.returning")
                        : t("tools.actions.returnTool")}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {ret.isError ? (
            <div className="mt-3 rounded-2xl border border-border bg-muted px-3 py-2 text-sm">
              <div className="font-bold text-danger">{t("common.error")}</div>
              <div className="text-mutedForeground mt-1 break-words">
                {renderError(ret.error)}
              </div>
            </div>
          ) : null}
        </SectionCard>
      )}

      {/* History */}
      {tab === "history" && (
        <SectionCard title={t("tools.sections.history")}>
          {historyQ.isLoading ? (
            <div className="h-24 rounded-2xl bg-muted animate-pulse" />
          ) : historyQ.isError ? (
            <div className="text-sm text-danger">
              {renderError(historyQ.error)}
            </div>
          ) : history.length === 0 ? (
            <div className="text-sm text-mutedForeground">
              {t("tools.empty.history")}
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((a: ToolAssignment) => {
                const tool = a.toolId as Tool;
                const returned = !!a.returnedAt;

                return (
                  <div key={a._id} className="card p-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="font-extrabold truncate">
                        {tool?.name || t("tools.toolFallback")}
                      </div>
                      <span
                        className={[
                          "chip",
                          returned ? "" : "bg-primary text-primaryForeground",
                        ].join(" ")}
                      >
                        {returned
                          ? t("tools.status.returned")
                          : t("tools.status.active")}
                      </span>
                    </div>

                    <div className="text-xs text-mutedForeground mt-2">
                      {t("tools.labels.to")}: {labelUser(a.assignedTo)}{" "}
                      <span className="mx-2">•</span>
                      {t("tools.labels.by")}: {labelUser(a.assignedBy)}
                    </div>

                    <div className="text-xs text-mutedForeground mt-1">
                      {t("tools.labels.assigned")}: {formatDate(a.assignedAt)}
                      {a.returnedAt
                        ? ` • ${t("tools.labels.returned")}: ${formatDate(
                            a.returnedAt
                          )}`
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
        <SectionCard title={t("tools.sections.maintenance")}>
          {maintenanceQ.isLoading ? (
            <div className="h-24 rounded-2xl bg-muted animate-pulse" />
          ) : maintenanceQ.isError ? (
            <div className="text-sm text-danger">
              {renderError(maintenanceQ.error)}
            </div>
          ) : maint.length === 0 ? (
            <div className="text-sm text-mutedForeground">
              {t("tools.empty.maintenance")}
            </div>
          ) : (
            <div className="space-y-2">
              {maint.map((m: ToolMaintenance) => {
                const tool = m.toolId as Tool;
                const done = !!m.completedAt;

                return (
                  <div
                    key={m._id}
                    className="card p-4 flex items-start justify-between gap-3 flex-wrap"
                  >
                    <div className="min-w-0">
                      <div className="font-extrabold truncate">
                        {tool?.name || t("tools.toolFallback")}
                      </div>
                      <div className="text-sm text-mutedForeground mt-1 break-words">
                        {m.description}
                      </div>
                      <div className="text-xs text-mutedForeground mt-2">
                        {t("tools.labels.started")}: {formatDate(m.startedAt)}
                        {m.completedAt
                          ? ` • ${t("tools.labels.completed")}: ${formatDate(
                              m.completedAt
                            )}`
                          : ""}
                      </div>
                    </div>

                    {!done ? (
                      <button
                        type="button"
                        className="btn-primary disabled:opacity-60"
                        disabled={completeMaint.isPending}
                        onClick={() =>
                          completeMaint.mutate({ maintenanceId: m._id })
                        }
                        title={t("tools.actions.completeMaintenance")}
                      >
                        {completeMaint.isPending
                          ? t("tools.actions.completing")
                          : t("tools.actions.complete")}
                      </button>
                    ) : (
                      <span className="chip">
                        {t("tools.status.completed")}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {startMaint.isError ? (
            <div className="mt-3 rounded-2xl border border-border bg-muted px-3 py-2 text-sm">
              <div className="font-bold text-danger">{t("common.error")}</div>
              <div className="text-mutedForeground mt-1 break-words">
                {renderError(startMaint.error)}
              </div>
            </div>
          ) : null}

          {completeMaint.isError ? (
            <div className="mt-3 rounded-2xl border border-border bg-muted px-3 py-2 text-sm">
              <div className="font-bold text-danger">{t("common.error")}</div>
              <div className="text-mutedForeground mt-1 break-words">
                {renderError(completeMaint.error)}
              </div>
            </div>
          ) : null}
        </SectionCard>
      )}

      {/* Available */}
      {tab === "available" && (
        <SectionCard title={t("tools.sections.available")}>
          {availQ.isLoading ? (
            <div className="h-24 rounded-2xl bg-muted animate-pulse" />
          ) : availQ.isError ? (
            <div className="text-sm text-danger">
              {renderError(availQ.error)}
            </div>
          ) : available.length === 0 ? (
            <div className="text-sm text-mutedForeground">
              {t("tools.empty.available")}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {available.map((tool: Tool) => (
                <div key={tool._id} className="card p-4">
                  <div className="font-extrabold">{tool.name}</div>
                  <div className="text-xs text-mutedForeground mt-1">
                    {t("tools.labels.sn")}: {tool.serialNumber || "—"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* Inventory */}
      {tab === "inventory" && (
        <SectionCard title={t("tools.sections.inventory")}>
          {invQ.isLoading ? (
            <div className="h-24 rounded-2xl bg-muted animate-pulse" />
          ) : invQ.isError ? (
            <div className="text-sm text-danger">{renderError(invQ.error)}</div>
          ) : inventory.length === 0 ? (
            <div className="text-sm text-mutedForeground">
              {t("tools.empty.inventory")}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {inventory.map((tool: Tool) => (
                <div key={tool._id} className="card p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-extrabold">{tool.name}</div>
                    <span className="chip">{tool.status}</span>
                  </div>
                  <div className="text-xs text-mutedForeground mt-1">
                    {t("tools.labels.sn")}: {tool.serialNumber || "—"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* CREATE TOOL MODAL */}
      {createOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setCreateOpen(false)}
          />
          <div className="relative w-full max-w-lg card p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-lg font-extrabold">
                  {t("tools.modals.create.title")}
                </div>
                <div className="text-sm text-mutedForeground mt-1">
                  {t("tools.modals.create.subtitle")}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="btn-ghost px-3 py-2"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <div>
                <label className="text-sm font-semibold">
                  {t("tools.modals.create.name")}
                </label>
                <input
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  className="input mt-2"
                  placeholder={t("tools.modals.create.namePh")}
                />
              </div>

              <div>
                <label className="text-sm font-semibold">
                  {t("tools.modals.create.serial")}
                </label>
                <input
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  className="input mt-2"
                  placeholder={t("tools.modals.create.serialPh")}
                />
              </div>

              {createTool.isError ? (
                <div className="rounded-2xl border border-border bg-muted px-3 py-2 text-sm">
                  <div className="font-bold text-danger">
                    {t("common.error")}
                  </div>
                  <div className="text-mutedForeground mt-1 break-words">
                    {renderError(createTool.error)}
                  </div>
                </div>
              ) : null}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="btn-outline"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="button"
                  onClick={submitCreate}
                  disabled={createTool.isPending || !toolName.trim()}
                  className="btn-primary disabled:opacity-60"
                >
                  {createTool.isPending
                    ? t("tools.modals.create.creating")
                    : t("tools.modals.create.create")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN TOOL MODAL */}
      {assignOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setAssignOpen(false)}
          />
          <div className="relative w-full max-w-lg card p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-lg font-extrabold">
                  {t("tools.modals.assign.title")}
                </div>
                <div className="text-sm text-mutedForeground mt-1">
                  {t("tools.modals.assign.subtitle")}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAssignOpen(false)}
                className="btn-ghost px-3 py-2"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <div>
                <label className="text-sm font-semibold">
                  {t("tools.modals.assign.tool")}
                </label>
                <select
                  value={assignToolId}
                  onChange={(e) => setAssignToolId(e.target.value)}
                  className="input mt-2 bg-card"
                >
                  <option value="">
                    {t("tools.modals.assign.selectTool")}
                  </option>
                  {available.map((tool: Tool) => (
                    <option key={tool._id} value={tool._id}>
                      {tool.name}{" "}
                      {tool.serialNumber ? `(${tool.serialNumber})` : ""}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-mutedForeground mt-2">
                  {t("tools.modals.assign.onlyAvailable")}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold">
                  {t("tools.modals.assign.member")}
                </label>
                <select
                  value={assignedToId}
                  onChange={(e) => setAssignedToId(e.target.value)}
                  className="input mt-2 bg-card"
                  disabled={membersQ.isLoading || members.length === 0}
                >
                  <option value="">
                    {membersQ.isLoading
                      ? t("tools.modals.assign.loadingMembers")
                      : members.length === 0
                      ? t("tools.modals.assign.noMembers")
                      : t("tools.modals.assign.selectMember")}
                  </option>
                  {members.map((m: any) => (
                    <option key={m.user._id} value={m.user._id}>
                      {m.user.name || m.user.email || m.user._id} — {m.role}
                    </option>
                  ))}
                </select>

                {membersQ.isError ? (
                  <div className="text-xs text-danger mt-2">
                    {t("tools.modals.assign.membersError")}:{" "}
                    {renderError(membersQ.error)}
                  </div>
                ) : (
                  <div className="text-xs text-mutedForeground mt-2">
                    {t("tools.modals.assign.membersHint")}
                  </div>
                )}
              </div>

              {assign.isError ? (
                <div className="rounded-2xl border border-border bg-muted px-3 py-2 text-sm">
                  <div className="font-bold text-danger">
                    {t("common.error")}
                  </div>
                  <div className="text-mutedForeground mt-1 break-words">
                    {renderError(assign.error)}
                  </div>
                </div>
              ) : null}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignOpen(false)}
                  className="btn-outline"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="button"
                  onClick={submitAssign}
                  disabled={
                    assign.isPending || !assignToolId || !assignedToId.trim()
                  }
                  className="btn-primary disabled:opacity-60"
                >
                  {assign.isPending
                    ? t("tools.modals.assign.assigning")
                    : t("tools.modals.assign.assign")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAINTENANCE MODAL */}
      {maintOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMaintOpen(false)}
          />
          <div className="relative w-full max-w-lg card p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-lg font-extrabold">
                  {t("tools.modals.maintenance.title")}
                </div>
                <div className="text-sm text-mutedForeground mt-1">
                  {t("tools.modals.maintenance.subtitle")}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMaintOpen(false)}
                className="btn-ghost px-3 py-2"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <div>
                <label className="text-sm font-semibold">
                  {t("tools.modals.maintenance.tool")}
                </label>
                <select
                  value={maintToolId}
                  onChange={(e) => setMaintToolId(e.target.value)}
                  className="input mt-2 bg-card"
                >
                  <option value="">
                    {t("tools.modals.maintenance.selectTool")}
                  </option>
                  {inventory
                    .filter((tool: Tool) => tool.status !== "ASSIGNED")
                    .map((tool: Tool) => (
                      <option key={tool._id} value={tool._id}>
                        {tool.name} — {tool.status}
                      </option>
                    ))}
                </select>
                <div className="text-xs text-mutedForeground mt-2">
                  {t("tools.modals.maintenance.rule")}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold">
                  {t("tools.modals.maintenance.description")}
                </label>
                <textarea
                  value={maintDesc}
                  onChange={(e) => setMaintDesc(e.target.value)}
                  className="input mt-2 min-h-[110px]"
                  placeholder={t("tools.modals.maintenance.descriptionPh")}
                />
              </div>

              {startMaint.isError ? (
                <div className="rounded-2xl border border-border bg-muted px-3 py-2 text-sm">
                  <div className="font-bold text-danger">
                    {t("common.error")}
                  </div>
                  <div className="text-mutedForeground mt-1 break-words">
                    {renderError(startMaint.error)}
                  </div>
                </div>
              ) : null}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMaintOpen(false)}
                  className="btn-outline"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="button"
                  onClick={submitMaintenance}
                  disabled={
                    startMaint.isPending || !maintToolId || !maintDesc.trim()
                  }
                  className="btn-primary disabled:opacity-60"
                >
                  {startMaint.isPending
                    ? t("tools.modals.maintenance.starting")
                    : t("tools.modals.maintenance.start")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
