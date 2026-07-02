const BASE = 'https://task-management-backend-qb4d.onrender.com'

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? err.detail ?? 'Request failed')
  }
  return res.json()
}

export interface WorkspaceData {
  id: string
  name: string
  slug: string
}

export function getWorkspaces(token: string): Promise<WorkspaceData[]> {
  return fetch(`${BASE}/workspaces/`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse<WorkspaceData[]>)
}

export function createWorkspace(
  name: string,
  slug: string,
  token: string,
): Promise<WorkspaceData> {
  return fetch(`${BASE}/workspaces/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name, slug }),
  }).then(handleResponse<WorkspaceData>)
}

export function inviteMember(
  workspaceSlug: string,
  email: string,
  role: string,
  token: string,
): Promise<unknown> {
  return fetch(`${BASE}/workspaces/${workspaceSlug}/members/invite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ email, role }),
  }).then(handleResponse<unknown>)
}
