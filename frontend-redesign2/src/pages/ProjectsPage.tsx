import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useMyProjects } from "../features/projects/hooks/useMyProjects";
import { useCreateProject } from "../features/projects/hooks/useCreateProject";
import ProjectCard from "../features/projects/components/ProjectCard";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import Alert from "../components/Alert";
import { useProjectStore } from "../store/projectStore";

export default function ProjectsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const q = useMyProjects();
  const create = useCreateProject();

  const activeProjectId = useProjectStore((s) => s.activeProjectId);
  const setActiveProject = useProjectStore((s) => s.setActiveProject);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const filtered = useMemo(() => {
    const list = q.data || [];
    const s = search.trim().toLowerCase();
    if (!s) return list;
    return list.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(s) ||
        (p.description || "").toLowerCase().includes(s)
    );
  }, [q.data, search]);

  function openProject(id: string, projectName: string) {
    setActiveProject({ id, name: projectName });
    navigate(`/app/projects/${id}`, { replace: true });
  }

  function setActiveOnly(id: string, projectName: string) {
    setActiveProject({ id, name: projectName });
  }

  async function submitCreate() {
    const n = name.trim();
    if (!n) return;

    await create.mutateAsync({
      name: n,
      description: description.trim() || undefined,
    });

    setOpen(false);
    setName("");
    setDescription("");
  }

  const errorMessage =
    (q.error as any)?.response?.data?.message ||
    (q.error as Error | undefined)?.message ||
    t("common.error");

  return (
    <div className="page-container py-6 lg:py-8">
      <div className="section">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="h1">
              {t("projects.title")}
            </h1>
            <p className="text-sm text-muted-fg mt-2">
              {t("projects.subtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("projects.searchPlaceholder")}
              className="input w-full sm:w-80"
            />
            <button onClick={() => setOpen(true)} className="btn btn-primary flex-shrink-0">
              {t("projects.create")}
            </button>
          </div>
        </div>

        {/* Content */}
        {q.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-responsive">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="h-5 w-48 bg-muted rounded-xl animate-pulse" />
              <div className="mt-3 h-4 w-full bg-muted rounded-xl animate-pulse" />
              <div className="mt-2 h-4 w-2/3 bg-muted rounded-xl animate-pulse" />
              <div className="mt-5 flex gap-2">
                <div className="h-9 w-28 bg-muted rounded-xl animate-pulse" />
                <div className="h-9 w-32 bg-muted rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : q.isError ? (
        <EmptyState
          title={t("projects.errorTitle")}
          subtitle={errorMessage}
          action={
            <button className="btn-primary" onClick={() => q.refetch()}>
              {t("common.retry")}
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t("projects.emptyTitle")}
          subtitle={t("projects.emptySubtitle")}
          action={
            <button className="btn-primary" onClick={() => setOpen(true)}>
              {t("projects.create")}
            </button>
          }
        />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-responsive">
            {filtered.map((p) => (
              <ProjectCard
                key={p._id}
                project={p as any}
                isActive={activeProjectId === p._id}
                onOpen={() => openProject(p._id, p.name)}
                onSetActive={() => setActiveOnly(p._id, p.name)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={t("projects.createTitle")}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-fg">
            {t("projects.createHint")}
          </p>

          <div>
            <label className="label label-required">
              {t("projects.name")}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder={t("projects.namePlaceholder")}
            />
          </div>

          <div>
            <label className="label">
              {t("projects.description")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea"
              placeholder={t("projects.descriptionPlaceholder")}
            />
          </div>

          {create.isError && (
            <Alert
              type="error"
              message={
                (create.error as any)?.response?.data?.message ||
                (create.error as Error | undefined)?.message ||
                t("common.error")
              }
            />
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <button
            className="btn btn-outline"
            onClick={() => setOpen(false)}
            type="button"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={submitCreate}
            disabled={create.isPending || !name.trim()}
            className="btn btn-primary"
            type="button"
          >
            {create.isPending
              ? t("projects.creating")
              : t("projects.create")}
          </button>
        </div>
      </Modal>
    </div>
  );
}
