// src/features/annotations/components/AnnotationPinsOverlay.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Annotation } from "../api/annotations.api";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export default function AnnotationPinsOverlay({
  annotations,
  page,
  containerRect,
  onSelect,
  onDragEnd,
  onRightClickDelete,
}: {
  annotations: Annotation[];
  page: number;
  containerRect: DOMRect | null;
  onSelect: (a: Annotation) => void;
  onDragEnd: (a: Annotation, nx: number, ny: number) => void;
  onRightClickDelete: (a: Annotation) => void;
}) {
  const { t } = useTranslation();

  // show only PINs on current page
  const pins = useMemo(() => {
    return (annotations || [])
      .filter((a) => a?.type === "PIN")
      .filter((a) => Number((a as any)?.geometry?.page || 1) === Number(page));
  }, [annotations, page]);

  const draggingRef = useRef<{
    id: string;
    startX: number;
    startY: number;
  } | null>(null);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [ghost, setGhost] = useState<{ x: number; y: number } | null>(null);

  // Convert pointer position -> normalized x/y inside containerRect
  function pointerToNormalized(e: PointerEvent | React.PointerEvent) {
    if (!containerRect) return null;

    const px = (e as any).clientX as number;
    const py = (e as any).clientY as number;

    const x = (px - containerRect.left) / containerRect.width;
    const y = (py - containerRect.top) / containerRect.height;

    return { x: clamp01(x), y: clamp01(y) };
  }

  function onPinPointerDown(e: React.PointerEvent, a: Annotation) {
    // SHIFT required to start dragging
    if (!e.shiftKey) return;

    e.preventDefault();
    e.stopPropagation();

    const start = pointerToNormalized(e);
    if (!start) return;

    draggingRef.current = {
      id: a._id,
      startX: start.x,
      startY: start.y,
    };

    setDraggingId(a._id);
    setGhost({ x: start.x, y: start.y });

    // capture pointer so we continue receiving moves
    try {
      (e.currentTarget as any).setPointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (!draggingId) return;

    const onMove = (e: PointerEvent) => {
      const pos = pointerToNormalized(e);
      if (!pos) return;
      setGhost({ x: pos.x, y: pos.y });
    };

    const onUp = async (e: PointerEvent) => {
      const drag = draggingRef.current;
      draggingRef.current = null;

      const pos = pointerToNormalized(e);

      setDraggingId(null);

      if (!drag || !pos) {
        setGhost(null);
        return;
      }

      const movedPin = pins.find((p) => p._id === drag.id);
      setGhost(null);

      if (!movedPin) return;

      // only commit if changed meaningfully
      const prevX = Number((movedPin as any)?.geometry?.x ?? 0);
      const prevY = Number((movedPin as any)?.geometry?.y ?? 0);
      const dx = Math.abs(prevX - pos.x);
      const dy = Math.abs(prevY - pos.y);
      if (dx < 0.002 && dy < 0.002) return;

      await onDragEnd(movedPin, pos.x, pos.y);
    };

    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp, { passive: false });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [draggingId, pins, containerRect, onDragEnd]);

  if (!containerRect) return null;

  return (
    <div
      className="absolute inset-0"
      style={{
        pointerEvents: "none",
      }}
    >
      {pins.map((a) => {
        const gx = Number((a as any)?.geometry?.x ?? 0);
        const gy = Number((a as any)?.geometry?.y ?? 0);

        const isDragging = draggingId === a._id;
        const x = isDragging && ghost ? ghost.x : gx;
        const y = isDragging && ghost ? ghost.y : gy;

        return (
          <button
            key={a._id}
            type="button"
            title={t("annotations.pinTooltip")}
            className={[
              "absolute -translate-x-1/2 -translate-y-1/2",
              "h-7 w-7 rounded-full",
              "text-xs font-extrabold",
              "shadow-md transition",
              "bg-[hsl(var(--primary))] text-white",
              "hover:scale-105",
              "ring-2 ring-white/60",
              isDragging ? "opacity-85" : "opacity-100",
            ].join(" ")}
            style={{
              left: `${x * 100}%`,
              top: `${y * 100}%`,
              pointerEvents: "auto",
              cursor: isDragging ? "grabbing" : "pointer",
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(a);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRightClickDelete(a);
            }}
            onPointerDown={(e) => onPinPointerDown(e, a)}
          >
            •
          </button>
        );
      })}
    </div>
  );
}
