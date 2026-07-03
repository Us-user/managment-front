import client from './client'

export interface Project {
  id: string
  workspace_id: string
  name: string
  identifier: string
  description: string | null
  lead_id: string | null
  is_archived: boolean
  created_at?: string
  updated_at?: string
}

export const getProjects = (slug: string) =>
  client.get<unknown, Project[]>(`/workspaces/${slug}/projects/`)

export const getProject = (slug: string, id: string) =>
  client.get<unknown, Project>(`/workspaces/${slug}/projects/${id}`)

export const createProject = (
  slug: string,
  data: { name: string; identifier: string; description?: string },
) => client.post<unknown, Project>(`/workspaces/${slug}/projects/`, data)

export const updateProject = (
  slug: string,
  id: string,
  data: Partial<Pick<Project, 'name' | 'description' | 'is_archived'>>,
) => client.patch<unknown, Project>(`/workspaces/${slug}/projects/${id}`, data)

export const deleteProject = (slug: string, id: string) =>
  client.delete<unknown, unknown>(`/workspaces/${slug}/projects/${id}`)
