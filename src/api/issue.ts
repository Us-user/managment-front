import client from './client'

// Matches the backend PRIORITIES enum. Note `none` is the lowest — the board's
// status-badge config also has a `backlog` key, but issues never use it.
export type IssuePriorityValue = 'none' | 'low' | 'medium' | 'high' | 'urgent'

export interface IssueAssignee {
  user_id: string
  user?: {
    id: string
    email: string
    display_name: string
    avatar_url: string | null
  }
}

export interface IssueLabelLink {
  label_id: string
  label?: {
    id: string
    name: string
    color: string
  }
}

export interface Issue {
  id: string
  workspace_id: string
  project_id: string
  sequence_id: number
  title: string
  description: string | null
  state_id: string
  priority: IssuePriorityValue
  parent_id: string | null
  estimate_points: number | null
  start_date: string | null
  due_date: string | null
  completed_at: string | null
  created_by_id: string
  sort_order: number
  created_at: string
  updated_at: string
  assignees: IssueAssignee[]
  labels: IssueLabelLink[]
}

// The default (non-grouped) list response: a page of issues plus a cursor.
interface PagedIssues {
  data: Issue[]
  next_cursor: string | null
}

interface ListParams {
  search?: string
  sort_by?: 'created_at' | 'updated_at' | 'priority' | 'due_date' | 'sort_order'
  order?: 'asc' | 'desc'
  limit?: number
  cursor?: string
}

// Fetch a flat page of a project's issues. The board buckets them into columns
// client-side by `state_id`, which keeps optimistic drag-and-drop moves simple.
export const getIssues = (
  slug: string,
  projectId: string,
  params?: ListParams,
) =>
  client.get<unknown, PagedIssues>(
    `/workspaces/${slug}/projects/${projectId}/issues/`,
    { params },
  )

export interface CreateIssueBody {
  title: string
  state_id: string
  description?: string
  priority?: IssuePriorityValue
  assignee_ids?: string[]
  label_ids?: string[]
  start_date?: string | null
  due_date?: string | null
}

export const createIssue = (
  slug: string,
  projectId: string,
  body: CreateIssueBody,
) =>
  client.post<unknown, Issue>(
    `/workspaces/${slug}/projects/${projectId}/issues/`,
    body,
  )

export type UpdateIssueBody = Partial<{
  title: string
  description: string | null
  state_id: string
  priority: IssuePriorityValue
  start_date: string | null
  due_date: string | null
  sort_order: number
}>

export const updateIssue = (
  slug: string,
  projectId: string,
  issueId: string,
  body: UpdateIssueBody,
) =>
  client.patch<unknown, Issue>(
    `/workspaces/${slug}/projects/${projectId}/issues/${issueId}`,
    body,
  )

export const deleteIssue = (slug: string, projectId: string, issueId: string) =>
  client.delete<unknown, void>(
    `/workspaces/${slug}/projects/${projectId}/issues/${issueId}`,
  )

export const getIssue = (slug: string, projectId: string, issueId: string) =>
  client.get<unknown, Issue>(
    `/workspaces/${slug}/projects/${projectId}/issues/${issueId}`,
  )

// Assignee/label mutations all return the full updated issue (with relations),
// so callers can drop the result straight back into their local state.
export const addAssignee = (
  slug: string,
  projectId: string,
  issueId: string,
  userId: string,
) =>
  client.post<unknown, Issue>(
    `/workspaces/${slug}/projects/${projectId}/issues/${issueId}/assignees`,
    { user_id: userId },
  )

export const removeAssignee = (
  slug: string,
  projectId: string,
  issueId: string,
  userId: string,
) =>
  client.delete<unknown, Issue>(
    `/workspaces/${slug}/projects/${projectId}/issues/${issueId}/assignees/${userId}`,
  )

export const addLabel = (
  slug: string,
  projectId: string,
  issueId: string,
  labelId: string,
) =>
  client.post<unknown, Issue>(
    `/workspaces/${slug}/projects/${projectId}/issues/${issueId}/labels`,
    { label_id: labelId },
  )

export const removeLabel = (
  slug: string,
  projectId: string,
  issueId: string,
  labelId: string,
) =>
  client.delete<unknown, Issue>(
    `/workspaces/${slug}/projects/${projectId}/issues/${issueId}/labels/${labelId}`,
  )
