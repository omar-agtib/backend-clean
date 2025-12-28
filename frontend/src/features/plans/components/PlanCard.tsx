import type { Plan } from "../api/plans.api";

export default function PlanCard({
  plan,
  isSelected,
  onOpen,
}: {
  plan: Plan;
  isSelected: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className={[
        "w-full text-left rounded-2xl border shadow-sm p-5 transition",
        isSelected
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white border-slate-200 hover:bg-slate-50 text-slate-900",
      ].join(" ")}
    >
      <div className="font-extrabold">{plan.title}</div>
      <div
        className={
          isSelected
            ? "text-sm text-white/80 mt-1"
            : "text-sm text-slate-600 mt-1"
        }
      >
        {plan.description || "No description"}
      </div>
      <div
        className={
          isSelected
            ? "text-xs text-white/70 mt-3"
            : "text-xs text-slate-400 mt-3"
        }
      >
        Updated: {new Date(plan.updatedAt).toLocaleString()}
      </div>
    </button>
  );
}
