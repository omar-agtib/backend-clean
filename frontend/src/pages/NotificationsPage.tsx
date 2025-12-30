// src/pages/NotificationsPage.tsx
import EmptyState from "../components/EmptyState";
import { useNotifications } from "../features/notifications/hooks/useNotifications";
import { useMarkNotificationRead } from "../features/notifications/hooks/useMarkNotificationRead";
import { useMarkAllNotificationsRead } from "../features/notifications/hooks/useMarkAllNotificationsRead";

export default function NotificationsPage() {
  const q = useNotifications({ limit: 100 });
  const markOne = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  if (q.isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-2xl bg-slate-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (q.isError) {
    return (
      <EmptyState
        title="Failed to load notifications"
        subtitle={
          (q.error as any)?.response?.data?.message ||
          (q.error as Error).message
        }
        action={
          <button
            onClick={() => q.refetch()}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Retry
          </button>
        }
      />
    );
  }

  const list = q.data || [];
  const unreadCount = list.filter((x) => !x.isRead).length;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-2xl font-extrabold text-slate-900">
            Notifications
          </div>
          <div className="text-sm text-slate-500">
            {unreadCount ? `${unreadCount} unread` : "All caught up ✅"}
          </div>
        </div>

        <button
          type="button"
          onClick={() => markAll.mutate(undefined)}
          disabled={markAll.isPending || unreadCount === 0}
          className="rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {markAll.isPending ? "Marking..." : "Mark all read"}
        </button>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="font-semibold text-slate-900">No notifications</div>
          <div className="text-sm text-slate-600 mt-1">
            You’ll see updates here (assignments, validations, etc).
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((n) => (
            <button
              key={n._id}
              type="button"
              onClick={() => {
                if (!n.isRead) markOne.mutate(n._id);
              }}
              className={[
                "w-full text-left rounded-2xl border p-4 transition",
                n.isRead
                  ? "bg-white border-slate-200 hover:bg-slate-50"
                  : "bg-slate-50 border-slate-900 hover:bg-slate-100",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 truncate">
                    {n.title}
                  </div>
                  {n.message ? (
                    <div className="text-sm text-slate-600 mt-1 line-clamp-2">
                      {n.message}
                    </div>
                  ) : null}
                  <div className="text-xs text-slate-400 mt-2">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>

                {!n.isRead ? (
                  <span className="shrink-0 rounded-full bg-slate-900 text-white text-xs font-semibold px-2.5 py-1">
                    NEW
                  </span>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
