import type { Annotation } from "../../annotations/api/annotations.api";

export default function AnnotationPinsOverlay({
  annotations,
  page,
  onSelect,
}: {
  annotations: Annotation[];
  page: number;
  onSelect: (a: Annotation) => void;
}) {
  const items = (annotations || []).filter((a) => a.page === page);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {items.map((a) => (
        <button
          key={a._id}
          type="button"
          onClick={() => onSelect(a)}
          className="pointer-events-auto absolute -translate-x-1/2 -translate-y-full"
          style={{
            left: `${a.x * 100}%`,
            top: `${a.y * 100}%`,
          }}
          title={a.title || "Annotation"}
        >
          <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow">
            !
          </div>
        </button>
      ))}
    </div>
  );
}
