// src/pages/NotificationsPage.tsx
import SectionCard from "../components/SectionCard";
import EmptyState from "../components/EmptyState";
import { useMemo } from "react";
import { useNotifications } from "../features/notifications/hooks/useNotifications";
import { useMarkNotificationRead } from "../features/notifications/hooks/useMarkNotificationRead";
import { useMarkAllNotificationsRead } from "../features/notifications/hooks/useMarkAllNotificationsRead";
import type { Notification } from "../features/notifications/api/notifications.api";

function KindPill({ kind }: { kind?: string }) {
  const label = (kind || "info").toUpperCase();
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold text-slate-700">
      {label}
    </span>
  );
}

export default function NotificationsPage() {
  const limit = 100;

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
    return <div className="h-40 bg-slate-200 animate-pulse rounded-2xl" />;
  }

  if (q.isError) {
    return (
      <EmptyState
        title="Failed to load notifications"
        subtitle={
          (q.error as any)?.response?.data?.message ||
          (q.error as Error).message
        }
      />
    );
  }

  return (
    <SectionCard title="Notifications">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="text-sm text-slate-600">
          Unread:{" "}
          <span className="font-extrabold text-slate-900">{unreadCount}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => q.refetch()}
            className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-900"
          >
            Refresh
          </button>

          <button
            type="button"
            disabled={unreadCount === 0 || markAll.isPending}
            onClick={() => markAll.mutate()}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            {markAll.isPending ? "Marking..." : "Mark all as read"}
          </button>
        </div>
      </div>

      {(markAll.isError || markRead.isError) && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {(markAll.error as any)?.response?.data?.message ||
            (markAll.error as Error)?.message ||
            (markRead.error as any)?.response?.data?.message ||
            (markRead.error as Error)?.message}
        </div>
      )}

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <div className="text-lg font-semibold text-slate-900">
            No notifications
          </div>
          <div className="mt-1 text-sm text-slate-600">
            You’re all caught up.
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((n) => (
            <button
              key={n._id}
              type="button"
              onClick={() => onOpen(n)}
              className={[
                "w-full text-left rounded-2xl border p-4 transition",
                n.isRead
                  ? "bg-white border-slate-200 hover:bg-slate-50"
                  : "bg-slate-900 border-slate-900 text-white hover:bg-slate-800",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-extrabold">
                    {n.title || "Notification"}
                  </div>
                  {n.message ? (
                    <div
                      className={
                        n.isRead
                          ? "text-sm text-slate-600 mt-1"
                          : "text-sm text-white/80 mt-1"
                      }
                    >
                      {n.message}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <KindPill kind={n.kind} />
                  <div
                    className={
                      n.isRead
                        ? "text-xs text-slate-400"
                        : "text-xs text-white/70"
                    }
                  >
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {!n.isRead ? (
                <div className="mt-3 text-xs text-white/70">
                  Click to mark as read
                </div>
              ) : null}
            </button>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
