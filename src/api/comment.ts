import client from './client'

export interface Comment {
  id: string
  issue_id: string
  author_id: string
  body: string
  parent_comment_id: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  author?: {
    id: string
    display_name: string
    avatar_url: string | null
  }
}

const base = (slug: string, projectId: string, issueId: string) =>
  `/workspaces/${slug}/projects/${projectId}/issues/${issueId}/comments`

export const getComments = (slug: string, projectId: string, issueId: string) =>
  client.get<unknown, Comment[]>(`${base(slug, projectId, issueId)}/`)

export const createComment = (
  slug: string,
  projectId: string,
  issueId: string,
  body: string,
) =>
  client.post<unknown, Comment>(`${base(slug, projectId, issueId)}/`, { body })

export const deleteComment = (
  slug: string,
  projectId: string,
  issueId: string,
  commentId: string,
) =>
  client.delete<unknown, void>(`${base(slug, projectId, issueId)}/${commentId}`)
