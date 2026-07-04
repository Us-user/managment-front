import client from './client'

// action is a dotted string like 'issue.created' / 'issue.updated'. For an
// 'issue.updated' entry, `field` says which field changed and old/new_value
// hold the raw stored values (state ids, priority strings, etc.).
export interface Activity {
  id: string
  workspace_id: string
  issue_id: string | null
  actor_id: string
  action: string
  field: string | null
  old_value: string | null
  new_value: string | null
  created_at: string
  actor?: {
    id: string
    display_name: string
    avatar_url: string | null
  }
}

interface ActivityPage {
  data: Activity[]
  next_cursor: string | null
}

// Newest-first activity history for an issue.
export const getActivity = (slug: string, projectId: string, issueId: string) =>
  client.get<unknown, ActivityPage>(
    `/workspaces/${slug}/projects/${projectId}/issues/${issueId}/activity/`,
  )
