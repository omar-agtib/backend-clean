// src/features/plans/components/PlanPreview.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import SectionCard from "../../../components/SectionCard";
import { Document, Page, pdfjs } from "react-pdf";

import type { Annotation } from "../../annotations/api/annotations.api";
import { useAnnotationsByVersion } from "../../annotations/hooks/useAnnotationsByVersion";
import { useCreateAnnotation } from "../../annotations/hooks/useCreateAnnotation";
import { useUpdateAnnotation } from "../../annotations/hooks/useUpdateAnnotation";
import { useDeleteAnnotation } from "../../annotations/hooks/useDeleteAnnotation";
import { useAnnotationsRealtime } from "../../annotations/hooks/useAnnotationsRealtime";

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
  planVersionId: string | null;
}) {
  const [numPages, setNumPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  // page render size (for pins)
  const pageWrapRef = useRef<HTMLDivElement | null>(null);
  const [pageSize, setPageSize] = useState<{ w: number; h: number }>({
    w: 0,
    h: 0,
  });

  // drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Annotation | null>(null);

  const url = file?.url || null;

  const annQ = useAnnotationsByVersion(planVersionId);
  const createAnn = useCreateAnnotation();
  const updateAnn = useUpdateAnnotation(planVersionId || "");
  const deleteAnn = useDeleteAnnotation(planVersionId || "");

  // ✅ realtime toast + refresh
  useAnnotationsRealtime(planVersionId);

  // reset when file changes
  useEffect(() => {
    setNumPages(0);
    setPage(1);
    setError(null);
    setSelected(null);
    setDrawerOpen(false);
  }, [url]);

  // measure page area
  useEffect(() => {
    function measure() {
      const el = pageWrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPageSize({ w: r.width, h: r.height });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  function onPageRenderSuccess() {
    const el = pageWrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPageSize({ w: r.width, h: r.height });
  }

  const title = useMemo(() => {
    if (!file) return "Preview";
    return file.originalName || file.publicId || "Preview";
  }, [file]);

  const annotations = useMemo(() => {
    const list = annQ.data || [];
    return list.filter((a) => a.type === "PIN");
  }, [annQ.data]);

  function openAnnotation(a: Annotation) {
    setSelected(a);
    setDrawerOpen(true);
  }

  // Shift+click create pin
  async function onPdfClickToCreatePin(e: React.MouseEvent) {
    if (!planVersionId) return;
    if (!e.shiftKey) return;

    const el = pageWrapRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const xPct = (e.clientX - r.left) / r.width;
    const yPct = (e.clientY - r.top) / r.height;

    const x = clamp(xPct);
    const y = clamp(yPct);

    await createAnn.mutateAsync({
      planVersionId,
      type: "PIN",
      geometry: { xPct: x, yPct: y, page },
      content: "New pin",
    });
  }

  async function onPinRightClick(a: Annotation) {
    const ok = window.confirm("Delete this pin?");
    if (!ok) return;

    await deleteAnn.mutateAsync(a._id);

    if (selected?._id === a._id) {
      setDrawerOpen(false);
      setSelected(null);
    }
  }

  async function onPinDragEnd(
    a: Annotation,
    next: { xPct: number; yPct: number }
  ) {
    const prev = a.geometry || {};
    await updateAnn.mutateAsync({
      annotationId: a._id,
      patch: {
        geometry: {
          ...prev,
          xPct: next.xPct,
          yPct: next.yPct,
          page: prev.page ?? page,
        },
      },
    });

    // keep drawer in sync
    if (selected?._id === a._id) {
      setSelected({
        ...a,
        geometry: {
          ...prev,
          xPct: next.xPct,
          yPct: next.yPct,
          page: prev.page ?? page,
        },
      } as any);
    }
  }

  async function saveDrawerContent(nextContent: string) {
    if (!selected) return;
    await updateAnn.mutateAsync({
      annotationId: selected._id,
      patch: { content: nextContent },
    });
    setSelected({ ...selected, content: nextContent });
  }

  async function deleteFromDrawer() {
    if (!selected) return;
    const ok = window.confirm("Delete this annotation?");
    if (!ok) return;

    await deleteAnn.mutateAsync(selected._id);
    setDrawerOpen(false);
    setSelected(null);
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

  return (
    <SectionCard title={title}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-600">
          {numPages ? (
            <>
              Page <span className="font-semibold text-slate-900">{page}</span>{" "}
              / <span className="font-semibold text-slate-900">{numPages}</span>
              <span className="ml-2 text-slate-400">
                (Shift+Click to drop a pin)
              </span>
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
              className="relative inline-block"
              onClick={onPdfClickToCreatePin}
            >
              <div ref={pageWrapRef} className="relative">
                <Document
                  file={file.url}
                  onLoadSuccess={(r) => {
                    setNumPages(r.numPages);
                    setPage(1);
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
                    onRenderSuccess={onPageRenderSuccess}
                  />
                </Document>

                {planVersionId && pageSize.w > 0 && pageSize.h > 0 ? (
                  <AnnotationPinsOverlay
                    pageWidth={pageSize.w}
                    pageHeight={pageSize.h}
                    annotations={annotations.filter((a) => {
                      const pg = (a.geometry as any)?.page;
                      return pg ? Number(pg) === page : true;
                    })}
                    onPinClick={openAnnotation}
                    onPinRightClick={onPinRightClick}
                    onPinDragEnd={onPinDragEnd}
                  />
                ) : null}
              </div>
            </div>

            {planVersionId && annQ.isError ? (
              <div className="mt-3 text-sm text-red-700">
                {(annQ.error as any)?.response?.data?.message ||
                  (annQ.error as Error).message}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <AnnotationDrawer
        open={drawerOpen}
        annotation={selected}
        onClose={() => setDrawerOpen(false)}
        onSave={saveDrawerContent}
        onDelete={deleteFromDrawer}
        isSaving={updateAnn.isPending}
        isDeleting={deleteAnn.isPending}
        errorMessage={
          (updateAnn.isError
            ? (updateAnn.error as any)?.response?.data?.message ||
              (updateAnn.error as Error).message
            : null) ||
          (deleteAnn.isError
            ? (deleteAnn.error as any)?.response?.data?.message ||
              (deleteAnn.error as Error).message
            : null)
        }
      />
    </SectionCard>
  );
}

function clamp(v: number) {
  return Math.min(1, Math.max(0, v));
}
