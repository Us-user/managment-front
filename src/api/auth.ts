const BASE = 'https://task-management-backend-qb4d.onrender.com'

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? err.detail ?? 'Request failed')
  }
  return res.json()
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: { id: string; email: string; display_name: string }
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(handleResponse<AuthResponse>)
}

export function register(
  email: string,
  password: string,
  display_name: string,
): Promise<AuthResponse> {
  return fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, display_name }),
  }).then(handleResponse<AuthResponse>)
}
