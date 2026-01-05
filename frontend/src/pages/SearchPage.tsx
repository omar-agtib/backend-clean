import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import SectionCard from "../components/SectionCard";
import { useProjectStore } from "../store/projectStore";
import { useSearch } from "../features/search/hooks/useSearch";

function money(n: number) {
  const x = Number(n || 0);
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(x);
}

function ResultRow({
  title,
  subtitle,
  onOpen,
  right,
}: {
  title: string;
  subtitle?: string;
  onOpen: () => void;
  right?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full text-left rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-extrabold text-slate-900">{title}</div>
          {subtitle ? (
            <div className="mt-1 text-xs text-slate-600">{subtitle}</div>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
    </button>
  );
}

export default function SearchPage() {
  const navigate = useNavigate();
  const setActiveProject = useProjectStore((s) => s.setActiveProject);

  const [q, setQ] = useState("");
  const query = q.trim();

  const search = useSearch(query);

  const hasResults = useMemo(() => {
    const r = search.data?.results;
    if (!r) return false;
    return (
      r.projects.length ||
      r.nc.length ||
      r.milestones.length ||
      r.stock.length ||
      r.tools.length ||
      r.invoices.length
    );
  }, [search.data]);

  function openProject(projectId: string, projectName?: string) {
    setActiveProject({ id: projectId, name: projectName || projectId });
    navigate(`/app/projects/${projectId}?tab=plans`);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-2xl font-extrabold text-slate-900">Search</div>
          <div className="text-sm text-slate-600">
            Search across projects, NC, progress, stock, tools, invoices.
          </div>
        </div>
      </div>

      <SectionCard
        title="Query"
        right={
          <div className="text-xs text-slate-500">
            Type at least 2 characters
          </div>
        }
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try: villa, INV-, hammer, open, concrete..."
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        />

        {query.length > 0 && query.length < 2 ? (
          <div className="mt-2 text-xs text-slate-500">
            Keep typing… (min 2 chars)
          </div>
        ) : null}
      </SectionCard>

      {search.isLoading && query.length >= 2 ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-slate-200 animate-pulse"
            />
          ))}
        </div>
      ) : null}

      {search.isError ? (
        <EmptyState
          title="Search failed"
          subtitle={
            (search.error as any)?.response?.data?.message ||
            (search.error as Error).message
          }
          action={
            <button
              onClick={() => search.refetch()}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Retry
            </button>
          }
        />
      ) : null}

      {search.isSuccess && !hasResults ? (
        <EmptyState title="No results" subtitle="Try different keywords." />
      ) : null}

      {search.data ? (
        <div className="space-y-4">
          {/* Projects */}
          {search.data.results.projects.length ? (
            <SectionCard
              title={`Projects (${search.data.results.projects.length})`}
            >
              <div className="space-y-2">
                {search.data.results.projects.map((p) => (
                  <ResultRow
                    key={p._id}
                    title={p.name}
                    subtitle={`${p.status}${
                      p.description ? ` • ${p.description}` : ""
                    }`}
                    onOpen={() => openProject(p._id, p.name)}
                    right={
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                        OPEN
                      </span>
                    }
                  />
                ))}
              </div>
            </SectionCard>
          ) : null}

          {/* NC */}
          {search.data.results.nc.length ? (
            <SectionCard title={`NC (${search.data.results.nc.length})`}>
              <div className="space-y-2">
                {search.data.results.nc.map((x) => (
                  <ResultRow
                    key={x._id}
                    title={x.title}
                    subtitle={`Status: ${x.status}`}
                    onOpen={() =>
                      navigate(`/app/projects/${x.projectId}?tab=nc`)
                    }
                    right={
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                        NC
                      </span>
                    }
                  />
                ))}
              </div>
            </SectionCard>
          ) : null}

          {/* Milestones */}
          {search.data.results.milestones.length ? (
            <SectionCard
              title={`Progress (${search.data.results.milestones.length})`}
            >
              <div className="space-y-2">
                {search.data.results.milestones.map((m) => (
                  <ResultRow
                    key={m._id}
                    title={m.name}
                    subtitle={`Progress: ${m.progress}%${
                      m.completed ? " • Completed" : ""
                    }`}
                    onOpen={() =>
                      navigate(`/app/projects/${m.projectId}?tab=progress`)
                    }
                    right={
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                        MS
                      </span>
                    }
                  />
                ))}
              </div>
            </SectionCard>
          ) : null}

          {/* Stock */}
          {search.data.results.stock.length ? (
            <SectionCard title={`Stock (${search.data.results.stock.length})`}>
              <div className="space-y-2">
                {search.data.results.stock.map((s) => (
                  <ResultRow
                    key={s._id}
                    title={s.product?.name || "Stock Item"}
                    subtitle={`Qty: ${s.quantity}${
                      s.location ? ` • ${s.location}` : ""
                    }`}
                    onOpen={() =>
                      navigate(`/app/projects/${s.projectId}?tab=stock`)
                    }
                    right={
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                        STOCK
                      </span>
                    }
                  />
                ))}
              </div>
            </SectionCard>
          ) : null}

          {/* Tools */}
          {search.data.results.tools.length ? (
            <SectionCard title={`Tools (${search.data.results.tools.length})`}>
              <div className="space-y-2">
                {search.data.results.tools.map((t) => (
                  <ResultRow
                    key={t._id}
                    title={t.name}
                    subtitle={`Status: ${t.status}${
                      t.serialNumber ? ` • SN: ${t.serialNumber}` : ""
                    }`}
                    onOpen={() =>
                      navigate(
                        `/app/tools/${
                          useProjectStore.getState().activeProjectId || ""
                        }`
                      )
                    }
                    right={
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                        TOOL
                      </span>
                    }
                  />
                ))}
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Note: tool links depend on active project (tools are inventory +
                assignments).
              </div>
            </SectionCard>
          ) : null}

          {/* Billing */}
          {search.data.results.invoices.length ? (
            <SectionCard
              title={`Invoices (${search.data.results.invoices.length})`}
            >
              <div className="space-y-2">
                {search.data.results.invoices.map((inv) => (
                  <ResultRow
                    key={inv._id}
                    title={inv.number}
                    subtitle={`Status: ${inv.status} • Amount: ${money(
                      inv.amount
                    )}`}
                    onOpen={() =>
                      navigate(`/app/projects/${inv.projectId}?tab=billing`)
                    }
                    right={
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                        INV
                      </span>
                    }
                  />
                ))}
              </div>
            </SectionCard>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
