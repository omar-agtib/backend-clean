// src/features/annotations/components/AnnotationPinsOverlay.tsx
import { useMemo, useRef, useState } from "react";
import type { Annotation } from "../api/annotations.api";

export default function AnnotationPinsOverlay({
  pageWidth,
  pageHeight,
  annotations,
  onPinClick,
  onPinRightClick,
  onPinDragEnd,
}: {
  pageWidth: number;
  pageHeight: number;
  annotations: Annotation[];
  onPinClick: (a: Annotation) => void;
  onPinRightClick: (a: Annotation) => void;
  onPinDragEnd: (a: Annotation, next: { xPct: number; yPct: number }) => void;
}) {
  return (
    <div
      className="absolute inset-0"
      style={{ width: pageWidth, height: pageHeight }}
    >
      {annotations.map((a) => (
        <Pin
          key={a._id}
          a={a}
          pageWidth={pageWidth}
          pageHeight={pageHeight}
          onClick={() => onPinClick(a)}
          onRightClick={() => onPinRightClick(a)}
          onDragEnd={(next) => onPinDragEnd(a, next)}
        />
      ))}
    </div>
  );
}

function Pin({
  a,
  pageWidth,
  pageHeight,
  onClick,
  onRightClick,
  onDragEnd,
}: {
  a: Annotation;
  pageWidth: number;
  pageHeight: number;
  onClick: () => void;
  onRightClick: () => void;
  onDragEnd: (next: { xPct: number; yPct: number }) => void;
}) {
  const geom = (a.geometry || {}) as any;
  const xPct = typeof geom.xPct === "number" ? geom.xPct : 0.5;
  const yPct = typeof geom.yPct === "number" ? geom.yPct : 0.5;

  const [dragging, setDragging] = useState(false);
  const startRef = useRef<{
    x: number;
    y: number;
    xPct: number;
    yPct: number;
  } | null>(null);

  const left = xPct * pageWidth;
  const top = yPct * pageHeight;

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    startRef.current = { x: e.clientX, y: e.clientY, xPct, yPct };

    const onMove = (ev: MouseEvent) => {
      if (!startRef.current) return;

      const dx = ev.clientX - startRef.current.x;
      const dy = ev.clientY - startRef.current.y;

      const nextXPx = startRef.current.xPct * pageWidth + dx;
      const nextYPx = startRef.current.yPct * pageHeight + dy;

      const next = {
        xPct: clamp(nextXPx / pageWidth),
        yPct: clamp(nextYPx / pageHeight),
      };

      // live move effect via CSS transform (simple)
      const el = document.getElementById(`pin-${a._id}`);
      if (el) {
        el.style.left = `${next.xPct * pageWidth}px`;
        el.style.top = `${next.yPct * pageHeight}px`;
      }
    };

    const onUp = (ev: MouseEvent) => {
      setDragging(false);
      const st = startRef.current;
      startRef.current = null;

      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);

      if (!st) return;
      const dx = ev.clientX - st.x;
      const dy = ev.clientY - st.y;

      // if moved enough => treat as drag
      if (Math.abs(dx) + Math.abs(dy) > 3) {
        const nextXPx = st.xPct * pageWidth + dx;
        const nextYPx = st.yPct * pageHeight + dy;

        onDragEnd({
          xPct: clamp(nextXPx / pageWidth),
          yPct: clamp(nextYPx / pageHeight),
        });
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  return (
    <div
      id={`pin-${a._id}`}
      className={["absolute", "select-none", "cursor-pointer", "group"].join(
        " "
      )}
      style={{ left, top }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onRightClick();
      }}
    >
      <div
        onMouseDown={onMouseDown}
        className={[
          "w-4 h-4 rounded-full",
          "bg-red-600",
          "shadow",
          "ring-2 ring-white",
          dragging ? "scale-110" : "group-hover:scale-110",
          "transition",
          "-translate-x-1/2 -translate-y-1/2",
        ].join(" ")}
        title={a.content || "Pin"}
      />
    </div>
  );
}

function clamp(v: number) {
  return Math.min(1, Math.max(0, v));
}
