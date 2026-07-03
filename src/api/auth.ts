import client from './client'

const BASE = 'https://task-management-backend-qb4d.onrender.com/api/v1'

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

// Current user for the stored token (used after an OAuth redirect).
export const getMe = () => client.get<unknown, AuthResponse['user']>('/auth/me')

// Backend only accepts display_name / avatar_url.
export const updateMe = (data: {
  display_name?: string
  avatar_url?: string | null
}) => client.patch<unknown, AuthResponse['user']>('/auth/me', data)

// Telegram login: /init returns a deep-link to open + a token to poll.
export const telegramInit = () =>
  client.post<unknown, { deep_link: string; token: string; expires_at: string }>(
    '/auth/telegram/init',
  )

// Poll after the user opens the deep-link; tokens arrive once authenticated.
export const telegramStatus = (token: string) =>
  client.get<
    unknown,
    {
      status: 'pending' | 'expired' | 'used' | 'authenticated'
      access_token?: string
      refresh_token?: string
      user?: AuthResponse['user']
    }
  >(`/auth/telegram/status?token=${encodeURIComponent(token)}`)
