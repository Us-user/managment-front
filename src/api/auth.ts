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

// OAuth start endpoints — the browser is redirected here; the backend handles
// the provider consent screen and callback, then issues a session.
export const OAUTH_URLS = {
  google: `${BASE}/auth/google`,
  github: `${BASE}/auth/github`,
}

// Email OTP flow. The backend's 6-digit-code path is signup-only and still
// requires a password + display_name server-side, so we derive a name from the
// email and generate a password the user never needs — they always authenticate
// with the emailed code. (No passwordless *login* endpoint exists yet.)
export function emailSignup(email: string): Promise<{ status: string; email: string }> {
  return fetch(`${BASE}/auth/email/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password: `${crypto.randomUUID()}Aa1`,
      display_name: email.split('@')[0],
    }),
  }).then(handleResponse<{ status: string; email: string }>)
}

export function emailVerify(email: string, code: string): Promise<AuthResponse> {
  return fetch(`${BASE}/auth/email/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  }).then(handleResponse<AuthResponse>)
}

// Telegram login returns a t.me deep-link (plus a polling token) to open.
export function telegramInit(): Promise<Record<string, unknown>> {
  return fetch(`${BASE}/auth/telegram/init`, { method: 'POST' }).then(
    handleResponse<Record<string, unknown>>,
  )
}
