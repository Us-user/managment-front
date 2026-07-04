import client from './client'

// In-app notifications live in the backend `notifications` module, mounted at
// /workspaces/:slug/notifications and scoped to the requesting member. Rows are
// written inside the same transaction as the triggering mutation:
//   - `issue_assigned` — you were assigned to a work item (incl. on creation),
//   - `comment_added`  — someone commented on a work item you're involved in,
//   - `mentioned`      — you were @-mentioned in a comment.
// Telegram / email delivery is a separate, automatic out-of-band fan-out on the
// backend; the frontend never triggers it directly — creating the issue does.
export type NotificationType = 'issue_assigned' | 'comment_added' | 'mentioned'

export interface NotificationActor {
  id: string
  display_name: string
  avatar_url: string | null
}

export interface AppNotification {
  id: string
  workspace_id: string
  recipient_id: string
  actor_id: string
  type: NotificationType
  issue_id: string | null
  entity_id: string | null
  is_read: boolean
  read_at: string | null
  created_at: string
  actor: NotificationActor
}

export interface NotificationPage {
  data: AppNotification[]
  unread_count: number
  next_cursor: string | null
}

interface ListParams {
  // Filter by read state; omit for all. Serialized as ?read=true|false.
  read?: boolean
  cursor?: string
  limit?: number
}

export const getNotifications = (slug: string, params?: ListParams) =>
  client.get<unknown, NotificationPage>(`/workspaces/${slug}/notifications/`, {
    params,
  })

export const markNotificationRead = (slug: string, id: string) =>
  client.post<unknown, AppNotification>(
    `/workspaces/${slug}/notifications/${id}/read`,
  )

export const markAllNotificationsRead = (slug: string) =>
  client.post<unknown, { updated: number }>(
    `/workspaces/${slug}/notifications/read-all`,
  )
