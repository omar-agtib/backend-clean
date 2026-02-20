"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  useAnnotations,
  useCreateAnnotation,
  useDeleteAnnotation,
} from "@/hooks/usePlanning";
import { planningApi } from "@/lib/api/planning";
import { LoadingState } from "@/components/common/loading-state";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  ZoomIn,
  ZoomOut,
  MapPin,
  Trash2,
  MousePointer,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { AnnotationDetailsDialog } from "@/components/planning/annotation-details-dialog";
import type { Annotation } from "@/types";

// Dynamically import PDF viewer
const PDFDocumentViewer = dynamic(
  () =>
    import("@/components/planning/pdf-document-viewer").then(
      (mod) => mod.PDFDocumentViewer,
    ),
  { ssr: false, loading: () => <LoadingState /> },
);

type AnnotationTool = "select" | "pin";

// Priority colors
const PRIORITY_COLORS: Record<string, string> = {
  LOW: "#3b82f6", // blue
  MEDIUM: "#eab308", // yellow
  HIGH: "#f97316", // orange
  CRITICAL: "#ef4444", // red
};

// Toast Component
function AnnotationToast({
  annotation,
  onClose,
  onClick,
}: {
  annotation: any;
  onClose: () => void;
  onClick: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const priorityColor = PRIORITY_COLORS[annotation.priority || "MEDIUM"];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border p-4 min-w-[300px] max-w-[400px] animate-in slide-in-from-right">
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${priorityColor}20` }}
        >
          <MapPin className="h-5 w-5" style={{ color: priorityColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-sm">Pin Added</h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mr-2"
              onClick={onClose}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {annotation.content || "New pin annotation"}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${priorityColor}20`,
                color: priorityColor,
              }}
            >
              {annotation.priority || "MEDIUM"}
            </span>
            <span className="text-xs text-muted-foreground">
              Page {annotation.geometry.page || 1}
            </span>
          </div>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 mt-2 text-xs"
            onClick={onClick}
          >
            View Details →
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PlanViewerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = params.planId as string;
  const versionId = searchParams.get("version");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [activeTool, setActiveTool] = useState<AnnotationTool>("select");
  const [selectedAnnotation, setSelectedAnnotation] =
    useState<Annotation | null>(null);
  const [showAnnotationDialog, setShowAnnotationDialog] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; annotation: any }>>(
    [],
  );

  const { data: annotations = [], refetch } = useAnnotations(versionId || "");
  const createAnnotation = useCreateAnnotation();
  const deleteAnnotation = useDeleteAnnotation();

  // Filter annotations by current page
  const pageAnnotations = annotations.filter(
    (ann: any) => !ann.geometry.page || ann.geometry.page === pageNumber,
  );

  // Load PDF URL
  useEffect(() => {
    if (!versionId) return;

    const loadPdf = async () => {
      try {
        setIsLoading(true);
        const { url } = await planningApi.getVersionSignedUrl(versionId, 7200);
        setPdfUrl(url);
      } catch (error) {
        console.error("Failed to load PDF:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();
  }, [versionId]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  // Draw annotations on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw only PIN annotations for current page
    pageAnnotations.forEach((ann: any) => {
      if (ann.type !== "PIN") return;

      ctx.save();

      const color = PRIORITY_COLORS[ann.priority || "MEDIUM"];

      // Draw pin circle
      ctx.fillStyle = color;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ann.geometry.x * zoom, ann.geometry.y * zoom, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw label if content exists
      if (ann.content) {
        ctx.font = "bold 12px Arial";
        const text = ann.content;
        const textWidth = ctx.measureText(text).width;

        // Background
        ctx.fillStyle = color;
        ctx.fillRect(
          ann.geometry.x * zoom + 14,
          ann.geometry.y * zoom - 8,
          textWidth + 8,
          18,
        );

        // Text
        ctx.fillStyle = "#fff";
        ctx.fillText(
          text,
          ann.geometry.x * zoom + 18,
          ann.geometry.y * zoom + 4,
        );
      }

      ctx.restore();
    });
  }, [pageAnnotations, zoom]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);

    if (activeTool === "select") {
      // Find clicked annotation
      const clicked = pageAnnotations.find((ann: any) => {
        if (ann.type === "PIN") {
          const dx = ann.geometry.x - coords.x;
          const dy = ann.geometry.y - coords.y;
          return Math.sqrt(dx * dx + dy * dy) < 15;
        }
        return false;
      });

      if (clicked) {
        setSelectedAnnotation(clicked as Annotation);
        setShowAnnotationDialog(true);
      }
    } else if (activeTool === "pin") {
      // Create pin annotation
      createAnnotation.mutate(
        {
          planVersionId: versionId!,
          type: "PIN",
          geometry: {
            x: coords.x,
            y: coords.y,
            page: pageNumber,
          },
          content: "Pin",
          priority: "MEDIUM",
        },
        {
          onSuccess: (newAnnotation) => {
            refetch();

            // Show toast
            const toastId = Date.now().toString();
            setToasts((prev) => [
              ...prev,
              { id: toastId, annotation: newAnnotation },
            ]);

            // Switch back to select mode
            setActiveTool("select");
          },
        },
      );
    }
  };

  const handleDownload = async () => {
    if (!versionId) return;
    try {
      const { url } = await planningApi.getVersionSignedUrl(versionId);
      const a = document.createElement("a");
      a.href = url;
      a.download = "plan.pdf";
      a.click();
    } catch (error) {
      console.error("Failed to download:", error);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!versionId || !pdfUrl) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">No version selected</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        {/* Toolbar */}
        <div className="border-b bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/planning/${planId}`)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 border-r pr-4">
                <Button
                  variant={activeTool === "select" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTool("select")}
                >
                  <MousePointer className="h-4 w-4 mr-1" />
                  Select
                </Button>
                <Button
                  variant={activeTool === "pin" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTool("pin")}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Add Pin
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {pageAnnotations.length}{" "}
                {pageAnnotations.length === 1 ? "annotation" : "annotations"} on
                this page
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm min-w-[100px] text-center font-medium">
                Page {pageNumber} / {numPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                disabled={pageNumber >= numPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="border-l pl-2 ml-2 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm min-w-[60px] text-center font-medium">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* Viewer Area */}
        <div className="flex-1 overflow-auto relative" ref={containerRef}>
          <div className="flex items-start justify-center min-h-full p-8">
            <div
              className="relative shadow-2xl"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
              }}
            >
              {/* PDF Document */}
              <PDFDocumentViewer
                url={pdfUrl}
                pageNumber={pageNumber}
                onLoadSuccess={onDocumentLoadSuccess}
                width={800}
              />

              {/* Canvas Overlay */}
              <canvas
                ref={canvasRef}
                width={800}
                height={1000}
                className="absolute top-0 left-0"
                style={{
                  cursor: activeTool === "select" ? "pointer" : "crosshair",
                  pointerEvents: "auto",
                }}
                onClick={handleCanvasClick}
              />
            </div>
          </div>
        </div>

        {/* Toast Container */}
        <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <AnnotationToast
              key={toast.id}
              annotation={toast.annotation}
              onClose={() => removeToast(toast.id)}
              onClick={() => {
                setSelectedAnnotation(toast.annotation);
                setShowAnnotationDialog(true);
                removeToast(toast.id);
              }}
            />
          ))}
        </div>
      </div>

      {/* Annotation Details Dialog */}
      <AnnotationDetailsDialog
        annotation={selectedAnnotation}
        open={showAnnotationDialog}
        onOpenChange={setShowAnnotationDialog}
        onDeleted={() => {
          refetch();
          setShowAnnotationDialog(false);
        }}
        onUpdated={() => refetch()}
      />
    </>
  );
}
