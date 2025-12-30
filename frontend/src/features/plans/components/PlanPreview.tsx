// src/features/plans/components/PlanPreview.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SectionCard from "../../../components/SectionCard";
import { Document, Page, pdfjs } from "react-pdf";

import { useAnnotationsByVersion } from "../../annotations/hooks/useAnnotationsByVersion";
import { useCreateAnnotation } from "../../annotations/hooks/useCreateAnnotation";
import { useUpdateAnnotation } from "../../annotations/hooks/useUpdateAnnotation";
import { useDeleteAnnotation } from "../../annotations/hooks/useDeleteAnnotation";
import { useAnnotationsRealtime } from "../../annotations/hooks/useAnnotationsRealtime";

import { useProjectStore } from "../../../store/projectStore";

import type { Annotation } from "../../annotations/api/annotations.api";
import AnnotationPinsOverlay from "../../annotations/components/AnnotationPinsOverlay";
import AnnotationDrawer from "../../annotations/components/AnnotationDrawer";

// ✅ Vite: serve worker from /public
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type FileInfo = {
  url: string;
  originalName?: string;
  publicId?: string;
  bytes?: number;
};

export default function PlanPreview({
  file,
  planVersionId,
}: {
  file: FileInfo | null;
  planVersionId?: string | null;
}) {
  const [numPages, setNumPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  // Create mode
  const [pinMode, setPinMode] = useState(false);

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Annotation | null>(null);

  // ✅ rect tracking (fix for invisible pins)
  const pageWrapElRef = useRef<HTMLDivElement | null>(null);
  const resizeObsRef = useRef<ResizeObserver | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const url = file?.url || null;

  // projectId for realtime join
  const projectId = useProjectStore((s) => s.activeProjectId);

  // Queries + mutations
  const q = useAnnotationsByVersion(planVersionId);
  const create = useCreateAnnotation(planVersionId);
  const update = useUpdateAnnotation(planVersionId);
  const del = useDeleteAnnotation(planVersionId);

  // ✅ realtime
  useAnnotationsRealtime(projectId, planVersionId);

  const annotations = q.data || [];

  // Reset viewer when file changes
  useEffect(() => {
    setNumPages(0);
    setPage(1);
    setError(null);
    setPinMode(false);
    setDrawerOpen(false);
    setSelected(null);
  }, [url]);

  // ✅ callback ref: always measure when element mounts
  const setPageWrapRef = useCallback((node: HTMLDivElement | null) => {
    // cleanup old observer
    if (resizeObsRef.current) {
      resizeObsRef.current.disconnect();
      resizeObsRef.current = null;
    }

    pageWrapElRef.current = node;

    if (!node) {
      setRect(null);
      return;
    }

    const updateRect = () => {
      setRect(node.getBoundingClientRect());
    };

    // measure now + after paint (PDF renders async)
    updateRect();
    requestAnimationFrame(updateRect);

    // observe size changes
    const ro = new ResizeObserver(() => updateRect());
    ro.observe(node);
    resizeObsRef.current = ro;
  }, []);

  // ✅ keep rect fresh on scroll/resize + when page changes
  useEffect(() => {
    const updateRect = () => {
      const el = pageWrapElRef.current;
      if (!el) return;
      setRect(el.getBoundingClientRect());
    };

    updateRect();
    requestAnimationFrame(updateRect);

    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);

    return () => {
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
    };
  }, [page, url]);

  const title = useMemo(() => {
    if (!file) return "Preview";
    return file.originalName || file.publicId || "Preview";
  }, [file]);

  async function placePin(e: React.MouseEvent) {
    if (!pinMode) return;
    if (!planVersionId) return;

    const el = pageWrapElRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;

    const nx = Math.max(0, Math.min(1, x));
    const ny = Math.max(0, Math.min(1, y));

    await create.mutateAsync({
      planVersionId,
      type: "PIN",
      geometry: { x: nx, y: ny, page },
      content: "",
    });

    setPinMode(false);
  }

  async function onDragEnd(a: Annotation, nx: number, ny: number) {
    await update.mutateAsync({
      annotationId: a._id,
      geometry: { ...a.geometry, x: nx, y: ny, page },
    });
  }

  async function onDelete(a: Annotation) {
    await del.mutateAsync(a._id);
    if (selected?._id === a._id) {
      setSelected(null);
      setDrawerOpen(false);
    }
  }

  async function onSave(content: string) {
    if (!selected) return;
    await update.mutateAsync({
      annotationId: selected._id,
      content,
    });
    setDrawerOpen(false);
  }

  if (!file) {
    return (
      <SectionCard title="Preview">
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <div className="text-lg font-semibold text-slate-900">
            No version selected
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Choose a plan version to preview the PDF.
          </div>
        </div>
      </SectionCard>
    );
  }

  const tip =
    "Tip: Right click pin to delete · Hold Shift and drag pin to move";

  return (
    <SectionCard title={title}>
      {/* Top actions */}
      <div className="mb-3 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-600">
            {numPages ? (
              <>
                Page{" "}
                <span className="font-semibold text-slate-900">{page}</span> /{" "}
                <span className="font-semibold text-slate-900">{numPages}</span>
                {pinMode ? (
                  <span className="ml-3 inline-flex items-center rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                    Click on PDF to place pin
                  </span>
                ) : null}
              </>
            ) : (
              "Loading document..."
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold hover:bg-slate-200 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!numPages || page <= 1}
              type="button"
            >
              Prev
            </button>

            <button
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold hover:bg-slate-200 disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(numPages, p + 1))}
              disabled={!numPages || page >= numPages}
              type="button"
            >
              Next
            </button>

            <button
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
              type="button"
              disabled={!planVersionId || create.isPending}
              onClick={() => setPinMode((v) => !v)}
              title={!planVersionId ? "Select a version first" : "Add pin"}
            >
              {pinMode ? "Cancel Pin" : "+ Pin"}
            </button>

            <a
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white"
            >
              Open PDF
            </a>
          </div>
        </div>

        {/* Tip shown at top */}
        <div className="text-xs text-slate-500">{tip}</div>
      </div>

      {/* Viewer area */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {error ? (
          <div className="p-6 text-sm text-red-700">
            Failed to render PDF: {error}
            <div className="mt-2">
              <a
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Open the PDF in a new tab
              </a>
            </div>
          </div>
        ) : (
          <div className="max-h-[75vh] overflow-auto p-3">
            <div
              ref={setPageWrapRef}
              className={[
                "relative inline-block",
                pinMode ? "cursor-crosshair" : "cursor-default",
              ].join(" ")}
              onClick={placePin}
            >
              <Document
                file={file.url}
                onLoadSuccess={(r) => {
                  setNumPages(r.numPages);
                  setPage(1);
                  // measure after doc load
                  requestAnimationFrame(() => {
                    const el = pageWrapElRef.current;
                    if (el) setRect(el.getBoundingClientRect());
                  });
                }}
                onLoadError={(e: any) =>
                  setError(e?.message || "Unknown error")
                }
                loading={
                  <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
                }
              >
                <Page
                  pageNumber={page}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </Document>

              {/* Pins overlay */}
              <AnnotationPinsOverlay
                annotations={annotations}
                page={page}
                containerRect={rect}
                onSelect={(a) => {
                  setSelected(a);
                  setDrawerOpen(true);
                }}
                onDragEnd={onDragEnd}
                onRightClickDelete={onDelete}
              />
            </div>
          </div>
        )}
      </div>

      {/* Drawer */}
      <AnnotationDrawer
        open={drawerOpen}
        annotation={selected}
        onClose={() => setDrawerOpen(false)}
        onSave={onSave}
        onDelete={() => (selected ? onDelete(selected) : undefined)}
        isSaving={update.isPending}
        isDeleting={del.isPending}
        errorMessage={
          (update.isError &&
            ((update.error as any)?.response?.data?.message ||
              (update.error as Error).message)) ||
          (del.isError &&
            ((del.error as any)?.response?.data?.message ||
              (del.error as Error).message)) ||
          undefined
        }
      />
    </SectionCard>
  );
}
