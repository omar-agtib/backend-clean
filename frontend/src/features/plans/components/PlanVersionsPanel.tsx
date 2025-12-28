import { useMemo } from "react";
import { usePlanVersions } from "../hooks/usePlanVersions";
import { useUploadPlanVersion } from "../hooks/useUploadPlanVersion";

export default function PlanVersionsPanel({
  projectId,
  planId,
}: {
  projectId: string;
  planId: string;
}) {
  const q = usePlanVersions(planId);
  const upload = useUploadPlanVersion(projectId);

  const versions = useMemo(
    () =>
      (q.data || []).slice().sort((a, b) => b.versionNumber - a.versionNumber),
    [q.data]
  );

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await upload.mutateAsync({ planId, file });
    e.target.value = "";
  }

  if (q.isLoading) {
    return <div className="h-48 rounded-2xl bg-slate-200 animate-pulse" />;
  }

  if (q.isError) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-6">
        <div className="font-semibold text-red-800">
          Failed to load versions
        </div>
        <div className="text-red-700 text-sm mt-1">
          {(q.error as any)?.response?.data?.message ||
            (q.error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-lg font-extrabold text-slate-900">Versions</div>
          <div className="text-sm text-slate-500">
            Upload a new file to create version
          </div>
        </div>

        <label className="cursor-pointer rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {upload.isPending ? "Uploading..." : "+ Upload Version"}
          <input
            type="file"
            className="hidden"
            onChange={onPickFile}
            disabled={upload.isPending}
          />
        </label>
      </div>

      {upload.isError && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {(upload.error as any)?.response?.data?.message ||
            (upload.error as Error).message}
        </div>
      )}

      {versions.length === 0 ? (
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
          No versions yet. Upload the first plan file.
        </div>
      ) : (
        <div className="space-y-2">
          {versions.map((v) => (
            <div
              key={v._id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
            >
              <div>
                <div className="font-semibold text-slate-900">
                  Version #{v.versionNumber}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {v.file?.originalName || v.file?.url}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {new Date(v.createdAt).toLocaleString()}
                </div>
              </div>

              <a
                href={v.file.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-900"
              >
                Open
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
