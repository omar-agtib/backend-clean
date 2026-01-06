import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

function Badge({ children }: { children: string }) {
  return <span className="chip font-bold">{children}</span>;
}

function ResultRow({
  title,
  subtitle,
  onOpen,
  right,
  tone = "default",
}: {
  title: string;
  subtitle?: string;
  onOpen: () => void;
  right?: React.ReactNode;
  tone?: "default" | "primary";
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={[
        "w-full text-left rounded-2xl border p-4 transition",
        "bg-card border-border hover:bg-muted",
        tone === "primary" ? "ring-2 ring-[hsl(var(--ring)/0.20)]" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm sm:text-base font-extrabold truncate">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-1 text-xs sm:text-sm text-mutedForeground break-words">
              {subtitle}
            </div>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
    </button>
  );
}

export default function SearchPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const setActiveProject = useProjectStore((s) => s.setActiveProject);
  const activeProjectId = useProjectStore((s) => s.activeProjectId);

  const [q, setQ] = useState("");
  const query = q.trim();

  const search = useSearch(query);

  function openProject(projectId: string, projectName?: string) {
    setActiveProject({ id: projectId, name: projectName || projectId });
    navigate(`/app/projects/${projectId}?tab=plans`);
  }

  const hasResults =
    !!search.data &&
    Object.values(search.data.results).some(
      (arr: any) => (arr?.length || 0) > 0
    );

  const totals = useMemo(() => {
    if (!search.data) return null;
    return search.data.totals;
  }, [search.data]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold">{t("search.title")}</h1>
          <p className="text-sm text-mutedForeground mt-1">
            {t("search.subtitle")}
          </p>
        </div>
      </div>

      {/* Search input */}
      <div className="card p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm font-extrabold">{t("search.inputLabel")}</div>
          <div className="text-xs text-mutedForeground">
            {t("search.minChars")}
          </div>
        </div>

        <div className="mt-3 flex gap-2 flex-col sm:flex-row">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search.placeholder")}
            className="input flex-1"
          />

          <button
            type="button"
            className="btn-outline"
            onClick={() => setQ("")}
            disabled={!q.length}
          >
            {t("search.clear")}
          </button>
        </div>

        {query.length > 0 && query.length < 2 ? (
          <div className="mt-3 rounded-2xl border border-border bg-muted px-3 py-2 text-sm text-mutedForeground">
            {t("search.typeMore")}
          </div>
        ) : null}

        {totals ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>{t("search.totals.projects", { n: totals.projects })}</Badge>
            <Badge>{t("search.totals.nc", { n: totals.nc })}</Badge>
            <Badge>
              {t("search.totals.milestones", { n: totals.milestones })}
            </Badge>
            <Badge>{t("search.totals.stock", { n: totals.stock })}</Badge>
            <Badge>{t("search.totals.tools", { n: totals.tools })}</Badge>
            <Badge>{t("search.totals.invoices", { n: totals.invoices })}</Badge>
          </div>
        ) : null}
      </div>

      {/* States */}
      {query.length < 2 ? (
        <EmptyState
          title={t("search.emptyQueryTitle")}
          subtitle={t("search.emptyQuerySubtitle")}
        />
      ) : search.isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="h-5 w-40 bg-muted rounded-xl animate-pulse" />
              <div className="mt-4 grid gap-3">
                {Array.from({ length: 4 }).map((__, j) => (
                  <div
                    key={j}
                    className="rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="h-4 w-2/3 bg-muted rounded-xl animate-pulse" />
                    <div className="mt-2 h-4 w-full bg-muted rounded-xl animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : search.isError ? (
        <EmptyState
          title={t("search.errorTitle")}
          subtitle={
            (search.error as any)?.response?.data?.message ||
            (search.error as Error | undefined)?.message ||
            t("common.error")
          }
          action={
            <button className="btn-primary" onClick={() => search.refetch()}>
              {t("common.retry")}
            </button>
          }
        />
      ) : !hasResults ? (
        <EmptyState
          title={t("search.noResultsTitle")}
          subtitle={t("search.noResultsSubtitle", { q: query })}
        />
      ) : (
        <div className="grid gap-4">
          {/* Projects */}
          {search.data?.results.projects?.length ? (
            <SectionCard
              title={t("search.sections.projects", {
                n: search.data.results.projects.length,
              })}
            >
              <div className="grid gap-2">
                {search.data.results.projects.map((p) => (
                  <ResultRow
                    key={p._id}
                    title={p.name}
                    subtitle={[p.status, p.description ? p.description : null]
                      .filter(Boolean)
                      .join(" • ")}
                    onOpen={() => openProject(p._id, p.name)}
                    tone={activeProjectId === p._id ? "primary" : "default"}
                    right={<Badge>{t("search.badges.project")}</Badge>}
                  />
                ))}
              </div>
            </SectionCard>
          ) : null}

          {/* NC */}
          {search.data?.results.nc?.length ? (
            <SectionCard
              title={t("search.sections.nc", {
                n: search.data.results.nc.length,
              })}
            >
              <div className="grid gap-2">
                {search.data.results.nc.map((x) => (
                  <ResultRow
                    key={x._id}
                    title={x.title}
                    subtitle={[x.status, x.projectId]
                      .filter(Boolean)
                      .join(" • ")}
                    onOpen={() => openProject(x.projectId)}
                    right={<Badge>{t("search.badges.nc")}</Badge>}
                  />
                ))}
              </div>
            </SectionCard>
          ) : null}

          {/* Milestones */}
          {search.data?.results.milestones?.length ? (
            <SectionCard
              title={t("search.sections.milestones", {
                n: search.data.results.milestones.length,
              })}
            >
              <div className="grid gap-2">
                {search.data.results.milestones.map((m) => (
                  <ResultRow
                    key={m._id}
                    title={m.title}
                    subtitle={[
                      m.status,
                      m.projectId,
                      m.dueDate ? `${t("search.due")}: ${m.dueDate}` : null,
                    ]
                      .filter(Boolean)
                      .join(" • ")}
                    onOpen={() => openProject(m.projectId)}
                    right={<Badge>{t("search.badges.milestone")}</Badge>}
                  />
                ))}
              </div>
            </SectionCard>
          ) : null}

          {/* Stock */}
          {search.data?.results.stock?.length ? (
            <SectionCard
              title={t("search.sections.stock", {
                n: search.data.results.stock.length,
              })}
            >
              <div className="grid gap-2">
                {search.data.results.stock.map((s) => (
                  <ResultRow
                    key={s._id}
                    title={s.name}
                    subtitle={[
                      s.projectId,
                      `${t("search.qty")}: ${s.qty}`,
                    ].join(" • ")}
                    onOpen={() => openProject(s.projectId)}
                    right={<Badge>{t("search.badges.stock")}</Badge>}
                  />
                ))}
              </div>
            </SectionCard>
          ) : null}

          {/* Tools */}
          {search.data?.results.tools?.length ? (
            <SectionCard
              title={t("search.sections.tools", {
                n: search.data.results.tools.length,
              })}
            >
              <div className="grid gap-2">
                {search.data.results.tools.map((tool) => (
                  <ResultRow
                    key={tool._id}
                    title={tool.name}
                    subtitle={[tool.status, tool.projectId]
                      .filter(Boolean)
                      .join(" • ")}
                    onOpen={() => openProject(tool.projectId)}
                    right={<Badge>{t("search.badges.tool")}</Badge>}
                  />
                ))}
              </div>
            </SectionCard>
          ) : null}

          {/* Invoices */}
          {search.data?.results.invoices?.length ? (
            <SectionCard
              title={t("search.sections.invoices", {
                n: search.data.results.invoices.length,
              })}
            >
              <div className="grid gap-2">
                {search.data.results.invoices.map((inv) => (
                  <ResultRow
                    key={inv._id}
                    title={`${inv.number}`}
                    subtitle={[
                      inv.status,
                      inv.projectId,
                      `${t("search.amount")}: ${money(inv.amount)}`,
                    ]
                      .filter(Boolean)
                      .join(" • ")}
                    onOpen={() => openProject(inv.projectId)}
                    right={<Badge>{t("search.badges.invoice")}</Badge>}
                  />
                ))}
              </div>
            </SectionCard>
          ) : null}
        </div>
      )}
    </div>
  );
}
