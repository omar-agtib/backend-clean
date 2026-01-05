// frontend/src/pages/ProjectsPage.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMyProjects } from "../features/projects/hooks/useMyProjects";
import { useCreateProject } from "../features/projects/hooks/useCreateProject";
import ProjectCard from "../features/projects/components/ProjectCard";
import { useProjectStore } from "../store/projectStore";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const q = useMyProjects();
  const create = useCreateProject();

  const activeProjectId = useProjectStore((s) => s.activeProjectId);
  const setActiveProject = useProjectStore((s) => s.setActiveProject);

  const [search, setSearch] = useState("");

  // modal state
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const filtered = useMemo(() => {
    const list = q.data || [];
    const s = search.trim().toLowerCase();
    if (!s) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        (p.description || "").toLowerCase().includes(s)
    );
  }, [q.data, search]);

  function openProject(id: string, projectName: string) {
    setActiveProject({ id, name: projectName });
    navigate(`/app/projects/${id}`, { replace: true });
  }

  async function submitCreate() {
    if (!name.trim()) return;

    const p = await create.mutateAsync({
      name: name.trim(),
      description: description.trim() || undefined,
    });

    setOpen(false);
    setName("");
    setDescription("");

    // auto-select new project
    setActiveProject({ id: p._id, name: p.name });
    navigate(`/app/projects/${p._id}`, { replace: true });
  }

  if (q.isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 rounded-xl bg-slate-200 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-slate-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (q.isError) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-6">
        <div className="font-semibold text-red-800">
          Failed to load projects
        </div>
        <div className="text-red-700 text-sm mt-1">
          {(q.error as any)?.response?.data?.message ||
            (q.error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-2xl font-extrabold text-slate-900">Projects</div>
          <div className="text-sm text-slate-500">
            Select a project to activate your workspace
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full sm:w-80 rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />

          <button
            onClick={() => setOpen(true)}
            className="shrink-0 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
          >
            + New
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="font-semibold text-slate-900">No projects found</div>
          <div className="text-sm text-slate-600 mt-1">
            Try changing the search.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <ProjectCard
              key={p._id}
              project={p}
              isActive={p._id === activeProjectId}
              onOpen={() => openProject(p._id, p.name)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-extrabold text-slate-900">
                  Create Project
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  Name + description (optional)
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="New Construction Project from my pc"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full min-h-[90px] rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Project for building a villa mine."
                />
              </div>

              {create.isError && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                  {(create.error as any)?.response?.data?.message ||
                    (create.error as Error).message}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900"
                >
                  Cancel
                </button>
                <button
                  onClick={submitCreate}
                  disabled={create.isPending || !name.trim()}
                  className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-900 text-white disabled:opacity-60"
                >
                  {create.isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
