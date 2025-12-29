import { useEffect, useMemo, useState } from "react";
import SectionCard from "../../../components/SectionCard";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

type FileInfo = {
  url: string;
  originalName?: string;
  publicId?: string;
  bytes?: number;
};

export default function PlanPreview({ file }: { file: FileInfo | null }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const url = file?.url || null;

  // reset viewer when file changes
  useEffect(() => {
    setNumPages(0);
    setPage(1);
    setError(null);
  }, [url]);

  const title = useMemo(() => {
    if (!file) return "Preview";
    return file.originalName || file.publicId || "Preview";
  }, [file]);

  if (!file) {
    return (
      <SectionCard title="Preview">
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <div className="text-lg font-semibold text-slate-900">
            No version selected
          </div>
          <div className="text-sm text-slate-600 mt-1">
            Choose a plan version to preview the PDF.
          </div>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title={title}>
      {/* Top actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <div className="text-sm text-slate-600">
          {numPages ? (
            <>
              Page <span className="font-semibold text-slate-900">{page}</span>{" "}
              / <span className="font-semibold text-slate-900">{numPages}</span>
            </>
          ) : (
            "Loading document..."
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-semibold disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!numPages || page <= 1}
          >
            Prev
          </button>
          <button
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-semibold disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(numPages, p + 1))}
            disabled={!numPages || page >= numPages}
          >
            Next
          </button>

          <a
            href={file.url}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm font-semibold"
          >
            Open PDF
          </a>
        </div>
      </div>

      {/* Viewer area */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
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
          <div className="p-3 overflow-auto max-h-[75vh]">
            <Document
              file={file.url}
              onLoadSuccess={(r) => {
                setNumPages(r.numPages);
                setPage(1);
              }}
              onLoadError={(e: any) => setError(e?.message || "Unknown error")}
              loading={
                <div className="h-80 rounded-2xl bg-slate-200 animate-pulse" />
              }
            >
              <Page
                pageNumber={page}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </Document>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
