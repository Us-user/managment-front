import client from './client'

export interface Label {
  id: string
  workspace_id: string
  project_id: string
  name: string
  color: string
  created_at?: string
  updated_at?: string
}

export const getLabels = (slug: string, projectId: string) =>
  client.get<unknown, Label[]>(
    `/workspaces/${slug}/projects/${projectId}/labels/`,
  )

// Create/update/delete are admin-only on the backend (a non-admin gets 403).
export const createLabel = (
  slug: string,
  projectId: string,
  data: { name: string; color: string },
) =>
  client.post<unknown, Label>(
    `/workspaces/${slug}/projects/${projectId}/labels/`,
    data,
  )

export const updateLabel = (
  slug: string,
  projectId: string,
  labelId: string,
  data: { name?: string; color?: string },
) =>
  client.patch<unknown, Label>(
    `/workspaces/${slug}/projects/${projectId}/labels/${labelId}`,
    data,
  )

export const deleteLabel = (slug: string, projectId: string, labelId: string) =>
  client.delete<unknown, void>(
    `/workspaces/${slug}/projects/${projectId}/labels/${labelId}`,
  )
