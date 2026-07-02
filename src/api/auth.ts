import client from './client'

const BASE = 'https://task-management-backend-qb4d.onrender.com'

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
export const emailSignup = (email: string) =>
  client.post<unknown, { status: string; email: string }>(
    '/auth/email/signup',
    {
      email,
      password: `${crypto.randomUUID()}Aa1`,
      display_name: email.split('@')[0],
    },
  )

export const emailVerify = (email: string, code: string) =>
  client.post<unknown, AuthResponse>('/auth/email/verify', { email, code })

// Telegram login returns a t.me deep-link (plus a polling token) to open.
export const telegramInit = () =>
  client.post<unknown, Record<string, unknown>>('/auth/telegram/init')
