"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  useAnnotations,
  useCreateAnnotation,
  useDeleteAnnotation,
} from "@/hooks/usePlanning";
import { planningApi } from "@/lib/api/planning";
import { LoadingState } from "@/components/common/loading-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Download,
  ZoomIn,
  ZoomOut,
  Pencil,
  MapPin,
  Type,
  Trash2,
  MousePointer,
  Save,
} from "lucide-react";

type AnnotationTool = "select" | "draw" | "pin" | "text";

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
  const [zoom, setZoom] = useState(1);
  const [activeTool, setActiveTool] = useState<AnnotationTool>("select");
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<
    Array<{ x: number; y: number }>
  >([]);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [textContent, setTextContent] = useState("");

  const { data: annotations = [], refetch } = useAnnotations(versionId || "");
  const createAnnotation = useCreateAnnotation();
  const deleteAnnotation = useDeleteAnnotation();

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

  // Draw annotations on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all saved annotations
    annotations.forEach((ann: any) => {
      ctx.save();

      if (ann.type === "PIN") {
        // Draw pin marker
        ctx.fillStyle = "#ef4444";
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(
          ann.geometry.x * zoom,
          ann.geometry.y * zoom,
          8,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.stroke();

        // Draw pin label
        if (ann.content) {
          ctx.fillStyle = "#1f2937";
          ctx.font = "12px Arial";
          ctx.fillText(
            ann.content,
            ann.geometry.x * zoom + 12,
            ann.geometry.y * zoom + 4,
          );
        }
      } else if (
        ann.type === "DRAW" &&
        ann.geometry.points &&
        ann.geometry.points.length > 2
      ) {
        // Draw freehand path
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();

        for (let i = 0; i < ann.geometry.points.length; i += 2) {
          const x = ann.geometry.points[i] * zoom;
          const y = ann.geometry.points[i + 1] * zoom;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (ann.type === "TEXT") {
        // Draw text annotation
        ctx.fillStyle = "#10b981";
        ctx.font = "14px Arial";
        ctx.fillText(
          ann.content || "",
          ann.geometry.x * zoom,
          ann.geometry.y * zoom,
        );
      }

      ctx.restore();
    });

    // Draw current path while drawing
    if (isDrawing && currentPath.length > 0) {
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();

      currentPath.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x * zoom, point.y * zoom);
        else ctx.lineTo(point.x * zoom, point.y * zoom);
      });
      ctx.stroke();
    }
  }, [annotations, currentPath, isDrawing, zoom]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === "select") return;

    const coords = getCanvasCoords(e);

    if (activeTool === "draw") {
      setIsDrawing(true);
      setCurrentPath([coords]);
    } else if (activeTool === "pin") {
      // Create pin immediately
      createAnnotation.mutate(
        {
          planVersionId: versionId!,
          type: "PIN",
          geometry: { x: coords.x, y: coords.y },
          content: "Pin",
        },
        {
          onSuccess: () => refetch(),
        },
      );
    } else if (activeTool === "text") {
      setTextPosition(coords);
      setShowTextInput(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTool !== "draw") return;

    const coords = getCanvasCoords(e);
    setCurrentPath((prev) => [...prev, coords]);
  };

  const handleMouseUp = () => {
    if (isDrawing && currentPath.length > 2) {
      // Convert path to flat array [x1, y1, x2, y2, ...]
      const points = currentPath.flatMap((p) => [p.x, p.y]);

      createAnnotation.mutate(
        {
          planVersionId: versionId!,
          type: "DRAW",
          geometry: {
            x: currentPath[0].x,
            y: currentPath[0].y,
            points,
          },
        },
        {
          onSuccess: () => {
            refetch();
            setCurrentPath([]);
          },
        },
      );
    }
    setIsDrawing(false);
  };

  const handleSaveText = () => {
    if (!textPosition || !textContent.trim()) return;

    createAnnotation.mutate(
      {
        planVersionId: versionId!,
        type: "TEXT",
        geometry: { x: textPosition.x, y: textPosition.y },
        content: textContent,
      },
      {
        onSuccess: () => {
          refetch();
          setTextContent("");
          setTextPosition(null);
          setShowTextInput(false);
        },
      },
    );
  };

  const handleDeleteAnnotation = (annotationId: string) => {
    if (confirm("Delete this annotation?")) {
      deleteAnnotation.mutate(annotationId, {
        onSuccess: () => refetch(),
      });
    }
  };

  const handleDownload = async () => {
    if (!versionId) return;
    try {
      const { url } = await planningApi.getVersionSignedUrl(versionId);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to download:", error);
    }
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
                variant={activeTool === "draw" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("draw")}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Draw
              </Button>
              <Button
                variant={activeTool === "pin" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("pin")}
              >
                <MapPin className="h-4 w-4 mr-1" />
                Pin
              </Button>
              <Button
                variant={activeTool === "text" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("text")}
              >
                <Type className="h-4 w-4 mr-1" />
                Text
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
            {/* PDF Embed */}
            <embed
              src={pdfUrl}
              type="application/pdf"
              width="800"
              height="1000"
              className="bg-white"
            />

            {/* Canvas Overlay */}
            <canvas
              ref={canvasRef}
              width={800}
              height={1000}
              className="absolute top-0 left-0 cursor-crosshair"
              style={{
                pointerEvents: activeTool === "select" ? "none" : "auto",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>
        </div>
      </div>

      {/* Annotations Sidebar */}
      {annotations.length > 0 && (
        <div className="absolute top-24 right-4 w-64 space-y-2 max-h-[calc(100vh-8rem)] overflow-auto">
          <Card className="p-3 bg-white dark:bg-gray-800">
            <h3 className="font-semibold mb-2">
              Annotations ({annotations.length})
            </h3>
            <div className="space-y-2">
              {annotations.map((ann: any) => (
                <div
                  key={ann._id}
                  className="flex items-start justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {ann.type === "PIN" && (
                        <MapPin className="h-3 w-3 text-red-500" />
                      )}
                      {ann.type === "DRAW" && (
                        <Pencil className="h-3 w-3 text-blue-500" />
                      )}
                      {ann.type === "TEXT" && (
                        <Type className="h-3 w-3 text-green-500" />
                      )}
                      <span className="text-xs font-medium">{ann.type}</span>
                    </div>
                    {ann.content && (
                      <p className="text-xs truncate">{ann.content}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleDeleteAnnotation(ann._id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Text Input Dialog */}
      {showTextInput && textPosition && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-96 bg-white dark:bg-gray-800">
            <h3 className="font-semibold mb-4">Add Text Annotation</h3>
            <Input
              placeholder="Enter text..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && textContent.trim()) {
                  handleSaveText();
                }
              }}
              autoFocus
              className="mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={handleSaveText} disabled={!textContent.trim()}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowTextInput(false);
                  setTextPosition(null);
                  setTextContent("");
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
