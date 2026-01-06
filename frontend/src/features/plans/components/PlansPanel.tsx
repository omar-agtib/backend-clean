// src/features/plans/components/PlansPanel.tsx
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import SectionCard from "../../../components/SectionCard";
import EmptyState from "../../../components/EmptyState";
import PlanPreview from "./PlanPreview";

import { usePlans } from "../hooks/usePlans";
import { usePlanVersions } from "../hooks/usePlanVersions";
import { useCreatePlan } from "../hooks/useCreatePlan";
import { useUploadPlanVersion } from "../hooks/useUploadPlanVersion";

import type { Plan } from "../api/plans.api";
import CreatePlanModal from "./CreatePlanModal";

export default function PlansPanel({ projectId }: { projectId: string }) {
  const { t } = useTranslation();

  const plansQ = usePlans(projectId);

  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const versionsQ = usePlanVersions(activePlanId);

  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);

  const createPlan = useCreatePlan(projectId);
  const upload = useUploadPlanVersion(projectId);

  const [createOpen, setCreateOpen] = useState(false);

  const plans = plansQ.data || [];
  const versions = versionsQ.data || [];

  useEffect(() => {
    if (!activePlanId && plans.length > 0) setActivePlanId(plans[0]._id);
  }, [plans, activePlanId]);

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

  async function onCreatePlan(dto: {
    projectId: string;
    name: string;
    description?: string;
  }) {
    await createPlan.mutateAsync({
      projectId: dto.projectId,
      name: dto.name,
      description: dto.description,
    });
    setCreateOpen(false);
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !activePlanId) return;
    await upload.mutateAsync({ planId: activePlanId, file });
    e.target.value = "";
  }

  if (plansQ.isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="h-5 w-40 bg-muted rounded-xl animate-pulse" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (plansQ.isError) {
    return (
      <EmptyState
        title={t("plans.errorTitle")}
        subtitle={
          (plansQ.error as any)?.response?.data?.message ||
          (plansQ.error as Error).message
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Left column */}
      <div className="lg:col-span-2 space-y-4">
        {/* Plans */}
        <SectionCard
          title={t("plans.plansTitle")}
          right={
            <button
              onClick={() => setCreateOpen(true)}
              className="btn-primary text-xs px-3 py-2"
              type="button"
            >
              {t("plans.newPlan")}
            </button>
          }
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-mutedForeground">
              {t("plans.count", { n: plans.length })}
            </div>
          </div>

          {plans.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted p-6 text-center">
              <div className="text-sm font-extrabold text-foreground">
                {t("plans.emptyTitle")}
              </div>
              <div className="mt-1 text-xs text-mutedForeground">
                {t("plans.emptySubtitle")}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {plans.map((p: Plan) => {
                const isActive = p._id === activePlanId;
                return (
                  <button
                    key={p._id}
                    onClick={() => {
                      setActivePlanId(p._id);
                      setActiveVersionId(null);
                    }}
                    className={[
                      "w-full text-left rounded-2xl border px-4 py-3 transition",
                      "bg-card border-border hover:bg-muted",
                      isActive ? "ring-2 ring-[hsl(var(--ring)/0.20)]" : "",
                    ].join(" ")}
                    type="button"
                  >
                    <div className="font-extrabold text-foreground">
                      {(p as any).name}
                    </div>
                    {(p as any).description ? (
                      <div className="text-xs text-mutedForeground mt-1 line-clamp-2">
                        {(p as any).description}
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* Versions */}
        <SectionCard
          title={t("plans.versionsTitle")}
          right={
            <label
              className={[
                "cursor-pointer select-none",
                "btn-primary text-xs px-3 py-2",
                !activePlanId || upload.isPending
                  ? "opacity-60 pointer-events-none"
                  : "",
              ].join(" ")}
            >
              {upload.isPending ? t("plans.uploading") : t("plans.upload")}
              <input
                type="file"
                className="hidden"
                onChange={onPickFile}
                disabled={upload.isPending || !activePlanId}
              />
            </label>
          }
        >
          <div className="mb-3 text-xs text-mutedForeground">
            {activePlanId ? t("plans.uploadHint") : t("plans.selectPlanHint")}
          </div>

          {upload.isError ? (
            <div className="rounded-2xl border border-border bg-muted px-3 py-2 text-sm mb-3">
              <div className="font-bold text-danger">{t("common.error")}</div>
              <div className="text-mutedForeground mt-1 break-words">
                {(upload.error as any)?.response?.data?.message ||
                  (upload.error as Error).message}
              </div>
            </div>
          ) : null}

          {versionsQ.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-muted rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : versionsQ.isError ? (
            <div className="text-sm text-danger">
              {(versionsQ.error as any)?.response?.data?.message ||
                (versionsQ.error as Error).message}
            </div>
          ) : versions.length === 0 ? (
            <div className="text-sm text-mutedForeground">
              {t("plans.noVersions")}
            </div>
          ) : (
            <div className="space-y-2">
              {[...versions]
                .sort((a, b) => b.versionNumber - a.versionNumber)
                .map((v) => {
                  const isActive = v._id === activeVersionId;
                  return (
                    <button
                      key={v._id}
                      onClick={() => setActiveVersionId(v._id)}
                      className={[
                        "w-full text-left rounded-2xl border px-4 py-3 transition",
                        "bg-card border-border hover:bg-muted",
                        isActive ? "ring-2 ring-[hsl(var(--ring)/0.20)]" : "",
                      ].join(" ")}
                      type="button"
                    >
                      <div className="font-extrabold text-foreground">
                        {t("plans.versionNumber", { n: v.versionNumber })}
                      </div>
                      <div className="text-xs text-mutedForeground truncate mt-1">
                        {v.file?.originalName || v.file?.publicId}
                      </div>
                    </button>
                  );
                })}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Right preview */}
      <div className="lg:col-span-3">
        <PlanPreview
          file={previewVersion?.file || null}
          planVersionId={previewVersion?._id || null}
          projectId={projectId} // ✅ for realtime join room
        />
      </div>

      {/* Create modal */}
      {createOpen && (
        <CreatePlanModal
          projectId={projectId}
          onClose={() => setCreateOpen(false)}
          onCreate={onCreatePlan}
          isPending={createPlan.isPending}
          errorMessage={
            createPlan.isError
              ? (createPlan.error as any)?.response?.data?.message ||
                (createPlan.error as Error).message
              : null
          }
        />
      )}
    </div>
  );
}
