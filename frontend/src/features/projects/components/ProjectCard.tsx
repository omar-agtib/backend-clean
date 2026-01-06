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
      className={[
        "card p-5 transition",
        isActive ? "ring-2 ring-[hsl(var(--ring)/0.35)]" : "hover:bg-muted",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-extrabold truncate">{project.name}</h3>
            <ProjectStatusBadge status={project.status || ""} />
            {isActive ? (
              <span className="chip">{t("projects.active")}</span>
            ) : null}
          </div>

          <p className="text-sm text-mutedForeground mt-2 line-clamp-2">
            {project.description || t("projects.noDescription")}
          </p>

          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <button onClick={onOpen} className="btn-primary">
              {t("projects.open")}
            </button>

            {onSetActive ? (
              <button onClick={onSetActive} className="btn-outline">
                {t("projects.setActive")}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-mutedForeground gap-3">
        <div>
          {t("projects.members")}: {project.members?.length ?? 0}
        </div>
        <div className="truncate">ID: {project._id}</div>
      </div>
    </div>
  );
}
