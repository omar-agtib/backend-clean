// src/pages/NotificationsPage.tsx
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import SectionCard from "../components/SectionCard";
import EmptyState from "../components/EmptyState";

import { useNotifications } from "../features/notifications/hooks/useNotifications";
import { useMarkNotificationRead } from "../features/notifications/hooks/useMarkNotificationRead";
import { useMarkAllNotificationsRead } from "../features/notifications/hooks/useMarkAllNotificationsRead";
import type { Notification } from "../features/notifications/api/notifications.api";

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return iso;
  }
}

function KindBadge({ kind }: { kind?: Notification["kind"] }) {
  const k = kind || "info";

  const map: Record<string, { label: string; cls: string }> = {
    info: {
      label: "info",
      cls: "bg-muted text-mutedForeground border-border",
    },
    success: {
      label: "success",
      cls: "bg-[rgba(34,197,94,0.12)] text-foreground border-[rgba(34,197,94,0.25)]",
    },
    warning: {
      label: "warning",
      cls: "bg-[rgba(245,158,11,0.12)] text-foreground border-[rgba(245,158,11,0.25)]",
    },
    error: {
      label: "error",
      cls: "bg-[rgba(239,68,68,0.12)] text-foreground border-[rgba(239,68,68,0.25)]",
    },
  };

  const v = map[k] || map.info;

  return (
    <span
      className={[
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border",
        v.cls,
      ].join(" ")}
    >
      {v.label.toUpperCase()}
    </span>
  );
}

export default function NotificationsPage() {
  const { t } = useTranslation();

  const limit = 200;

  const q = useNotifications({ limit });
  const markRead = useMarkNotificationRead(limit);
  const markAll = useMarkAllNotificationsRead(limit);

  const list = q.data || [];

  const unreadCount = useMemo(
    () => list.filter((x) => !x.isRead).length,
    [list]
  );

  async function onOpen(n: Notification) {
    if (!n.isRead) {
      await markRead.mutateAsync(n._id);
    }
  }

  if (q.isLoading) {
    return (
      <div className="card p-5">
        <div className="h-5 w-48 bg-muted rounded-xl animate-pulse" />
        <div className="mt-4 grid gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="h-4 w-28 bg-muted rounded-xl animate-pulse" />
              <div className="mt-2 h-5 w-2/3 bg-muted rounded-xl animate-pulse" />
              <div className="mt-2 h-4 w-full bg-muted rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (q.isError) {
    const msg =
      (q.error as any)?.response?.data?.message ||
      (q.error as Error | undefined)?.message ||
      t("common.error");

    return (
      <EmptyState
        title={t("notifications.loadErrorTitle")}
        subtitle={msg}
        action={
          <button className="btn-primary" onClick={() => q.refetch()}>
            {t("common.retry")}
          </button>
        }
      />
    );
  }

  return (
    <SectionCard
      title={t("notifications.title")}
      right={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => q.refetch()}
            className="btn-outline"
            disabled={q.isFetching}
          >
            {q.isFetching ? t("common.loading") : t("common.refresh")}
          </button>

          <button
            type="button"
            onClick={() => markAll.mutate()}
            className="btn-primary"
            disabled={markAll.isPending || unreadCount === 0}
          >
            {markAll.isPending
              ? t("notifications.marking")
              : t("notifications.markAllRead")}
          </button>
        </div>
      }
    >
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="text-sm text-mutedForeground">
          {t("notifications.unread")}{" "}
          <span className="font-extrabold text-foreground">{unreadCount}</span>
        </div>

        {markAll.isError || markRead.isError ? (
          <div className="rounded-2xl border border-border bg-muted px-3 py-2 text-sm">
            <div className="font-bold text-danger">{t("common.error")}</div>
            <div className="text-mutedForeground mt-1 break-words">
              {(markAll.error as any)?.response?.data?.message ||
                (markRead.error as any)?.response?.data?.message ||
                (markAll.error as Error | undefined)?.message ||
                (markRead.error as Error | undefined)?.message ||
                t("common.tryAgain")}
            </div>
          </div>
        ) : null}
      </div>

      {list.length === 0 ? (
        <EmptyState
          title={t("notifications.emptyTitle")}
          subtitle={t("notifications.emptySubtitle")}
        />
      ) : (
        <div className="grid gap-3">
          {list.map((n) => {
            const isUnread = !n.isRead;

            return (
              <button
                key={n._id}
                type="button"
                onClick={() => onOpen(n)}
                className={[
                  "text-left rounded-2xl border p-4 transition",
                  "bg-card border-border hover:bg-muted",
                  isUnread ? "ring-2 ring-[hsl(var(--ring)/0.25)]" : "",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <KindBadge kind={n.kind} />
                      {isUnread ? (
                        <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                      ) : null}
                      <div className="text-sm font-extrabold truncate">
                        {n.title}
                      </div>
                    </div>

                    {n.message ? (
                      <div className="mt-2 text-sm text-mutedForeground break-words">
                        {n.message}
                      </div>
                    ) : null}

                    <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-mutedForeground">
                      <span>{formatDate(n.createdAt)}</span>

                      {n.projectId ? (
                        <>
                          <span>•</span>
                          <span className="chip">
                            {t("notifications.project")} {n.projectId}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isUnread ? (
                      <span className="chip">
                        {t("notifications.tapToRead")}
                      </span>
                    ) : (
                      <span className="chip">{t("notifications.read")}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
