import client from './client'

// State groups mirror the backend enum. They also drive the fallback column
// colour/label when a project uses the seeded defaults.
export type StateGroup =
  'backlog' | 'unstarted' | 'started' | 'completed' | 'cancelled'

export interface State {
  id: string
  project_id: string
  name: string
  color: string
  group: StateGroup
  order: number
  is_default: boolean
  created_at?: string
  updated_at?: string
}

// Board columns for a project, already ordered by `order` on the backend. Every
// project is seeded with Backlog / Todo / In Progress / Done / Cancelled.
export const getStates = (slug: string, projectId: string) =>
  client.get<unknown, State[]>(
    `/workspaces/${slug}/projects/${projectId}/states/`,
  )
