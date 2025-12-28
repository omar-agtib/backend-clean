import type { Project } from "../api/project.api";
import ProjectStatusBadge from "./ProjectStatusBadge";

type Props = {
  project: Project;
  isActive: boolean;
  onOpen: () => void;
};

export default function ProjectCard({ project, isActive, onOpen }: Props) {
  return (
    <div
      className={[
        "rounded-2xl bg-white border p-4 shadow-sm transition",
        isActive
          ? "border-slate-900 ring-1 ring-slate-900"
          : "border-slate-200 hover:border-slate-300",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 truncate">
              {project.name}
            </h3>
            <ProjectStatusBadge status={project.status} />
          </div>
          <p className="text-sm text-slate-600 mt-1 line-clamp-2">
            {project.description || "No description"}
          </p>
        </div>

        <button
          onClick={onOpen}
          className="shrink-0 px-3 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:opacity-95"
        >
          Open
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <div>Members: {project.members?.length ?? 0}</div>
        <div className="truncate">ID: {project._id}</div>
      </div>
    </div>
  );
}
