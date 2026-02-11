'use client';

import type { Project } from "../api/project.api";
import ProjectStatusBadge from "./ProjectStatusBadge";
import { useTranslation } from "react-i18next";

type Props = {
  project: Project & { members?: any[] }; // API returns more fields sometimes
  isActive: boolean;
  onOpen: () => void;
  onSetActive?: () => void;
};

export default function ProjectCard({
  project,
  isActive,
  onOpen,
  onSetActive,
}: Props) {
  const { t } = useTranslation();

  return (
    <div
      className={`bg-muted/10 border transition-all rounded-xl p-6 ${
        isActive
          ? "border-primary ring-2 ring-primary/30 shadow-lg"
          : "border-border hover:border-primary/30 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-bold text-lg truncate">{project.name}</h3>
            <ProjectStatusBadge status={project.status || ""} />
            {isActive ? (
              <span className="chip bg-success/20 border-success/30 text-success font-bold">
                {t("projects.active")}
              </span>
            ) : null}
          </div>

          <p className="text-sm text-mutedForeground mt-3 line-clamp-2">
            {project.description || t("projects.noDescription")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap mt-5">
        <button onClick={onOpen} className="btn-primary text-sm">
          {t("projects.open")}
        </button>

        {onSetActive ? (
          <button onClick={onSetActive} className="btn-outline text-sm">
            {t("projects.setActive")}
          </button>
        ) : null}
      </div>

      <div className="mt-5 pt-5 border-t border-border flex items-center justify-between text-xs text-mutedForeground gap-3">
        <div className="font-medium">
          {t("projects.members")}: <span className="text-foreground font-bold">{project.members?.length ?? 0}</span>
        </div>
        <div className="truncate opacity-60">ID: {project._id.slice(-6)}</div>
      </div>
    </div>
  );
}
