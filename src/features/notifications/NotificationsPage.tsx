import { useEffect, useState } from 'react'
import {
  Bell,
  CheckCheck,
  UserPlus,
  MessageSquare,
  AtSign,
  type LucideIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { useNotificationStore } from '@/stores/notificationStore'
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type AppNotification,
  type NotificationType,
} from '@/api/notification'

const PAGE_SIZE = 30

// Per-type icon + message copy. The actor's name is rendered separately (bold),
// so these are the trailing clause only.
const TYPE_META: Record<NotificationType, { icon: LucideIcon; verb: string }> =
  {
    issue_assigned: { icon: UserPlus, verb: 'assigned a work item to you' },
    comment_added: { icon: MessageSquare, verb: 'commented on a work item' },
    mentioned: { icon: AtSign, verb: 'mentioned you in a comment' },
  }

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

function NotificationRow({
  n,
  onRead,
}: {
  n: AppNotification
  onRead: (n: AppNotification) => void
}) {
  const meta = TYPE_META[n.type]
  const Icon = meta.icon
  return (
    <button
      type="button"
      onClick={() => onRead(n)}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg border border-border px-4 py-3 text-left transition-colors hover:bg-muted/50',
        !n.is_read && 'bg-primary/5',
      )}
    >
      <div className="relative shrink-0">
        <Avatar className="h-9 w-9">
          <AvatarImage src={n.actor.avatar_url ?? undefined} />
          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
            {n.actor.display_name?.[0]?.toUpperCase() ?? '?'}
          </AvatarFallback>
        </Avatar>
        <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
          <Icon size={10} />
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {n.actor.display_name}
          </span>{' '}
          {meta.verb}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {timeAgo(n.created_at)}
        </p>
      </div>

      {!n.is_read && (
        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  )
}

export function NotificationsPage() {
  const slug = useWorkspaceStore((s) => s.workspace?.slug)
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount)

  const [items, setItems] = useState<AppNotification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [cursor, setCursor] = useState<string | null>(null)
  const [markingAll, setMarkingAll] = useState(false)

  // Reload from scratch whenever the workspace or the read-filter changes. The
  // fetch lives inside an async IIFE so the initial setState isn't called
  // synchronously in the effect body (react-hooks/set-state-in-effect).
  useEffect(() => {
    if (!slug) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const res = await getNotifications(slug, {
          read: filter === 'unread' ? false : undefined,
          limit: PAGE_SIZE,
        })
        if (cancelled) return
        setItems(res.data)
        setCursor(res.next_cursor)
        setUnreadCount(res.unread_count)
      } catch (err) {
        if (!cancelled)
          toast.error(
            err instanceof Error ? err.message : 'Failed to load notifications',
          )
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug, filter, setUnreadCount])

  // Append the next page (user-triggered, so setState here is fine).
  async function loadMore() {
    if (!slug || !cursor || loadingMore) return
    setLoadingMore(true)
    try {
      const res = await getNotifications(slug, {
        read: filter === 'unread' ? false : undefined,
        cursor,
        limit: PAGE_SIZE,
      })
      setItems((prev) => [...prev, ...res.data])
      setCursor(res.next_cursor)
      setUnreadCount(res.unread_count)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to load notifications',
      )
    } finally {
      setLoadingMore(false)
    }
  }

  async function readOne(n: AppNotification) {
    if (n.is_read || !slug) return
    // Optimistic: flip the row and decrement the badge, revert on failure.
    setItems((prev) =>
      prev.map((it) => (it.id === n.id ? { ...it, is_read: true } : it)),
    )
    setUnreadCount(Math.max(0, unreadCount - 1))
    try {
      await markNotificationRead(slug, n.id)
    } catch (err) {
      setItems((prev) =>
        prev.map((it) => (it.id === n.id ? { ...it, is_read: false } : it)),
      )
      setUnreadCount(unreadCount)
      toast.error(err instanceof Error ? err.message : 'Failed to mark as read')
    }
  }

  async function readAll() {
    if (!slug || unreadCount === 0 || markingAll) return
    setMarkingAll(true)
    try {
      await markAllNotificationsRead(slug)
      setItems((prev) => prev.map((it) => ({ ...it, is_read: true })))
      setUnreadCount(0)
      toast.success('All notifications marked as read')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to mark all as read',
      )
    } finally {
      setMarkingAll(false)
    }
  }

  return (
    <div>
      {/* Top bar */}
      <div className="flex h-12 items-center gap-2 border-b border-border px-6 text-sm font-medium">
        <Bell size={16} />
        Notifications
        {unreadCount > 0 && (
          <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-semibold leading-none text-primary-foreground">
            {unreadCount}
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto gap-1.5"
          disabled={unreadCount === 0 || markingAll}
          onClick={readAll}
        >
          <CheckCheck size={14} />
          Mark all as read
        </Button>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Assignments, comments, and mentions across this workspace.
          </p>
        </div>

        {/* All / Unread filter */}
        <div className="mb-4 inline-flex rounded-md border border-border p-0.5">
          {(['all', 'unread'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'rounded px-3 py-1 text-sm font-medium capitalize transition-colors',
                filter === f
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={Bell}
            title={
              filter === 'unread' ? 'No unread notifications' : 'All caught up'
            }
            description="When you're assigned a work item, mentioned, or someone comments on your work, it'll show up here."
          />
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((n) => (
              <NotificationRow key={n.id} n={n} onRead={readOne} />
            ))}
            {cursor && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loadingMore}
                  onClick={loadMore}
                >
                  {loadingMore ? 'Loading…' : 'Load more'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
