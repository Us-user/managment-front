import client from './client'

export interface WorkspaceData {
  id: string
  name: string
  slug: string
}

// Token is attached by the axios request interceptor — callers don't pass it.
export const getWorkspaces = () =>
  client.get<unknown, WorkspaceData[]>('/workspaces/')

export const createWorkspace = (name: string, slug: string) =>
  client.post<unknown, WorkspaceData>('/workspaces/', { name, slug })

export interface WorkspaceMember {
  workspace_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member' | 'guest'
  created_at?: string
  user: {
    id: string
    email: string
    display_name: string
    avatar_url: string | null
  }
}

export const getWorkspaceMembers = (workspaceSlug: string) =>
  client.get<unknown, WorkspaceMember[]>(`/workspaces/${workspaceSlug}/members`)

export const inviteMember = (
  workspaceSlug: string,
  email: string,
  role: string,
) =>
  client.post<unknown, unknown>(`/workspaces/${workspaceSlug}/members/invite`, {
    email,
    role,
  })
