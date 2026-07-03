import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { toast } from 'sonner'
import './index.css'
import { router } from './routes'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Toaster } from '@/components/ui/toaster'
import { useAuthStore } from '@/stores/authStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { getMe } from '@/api/auth'
import { getWorkspaces } from '@/api/workspace'

// After OAuth the backend redirects to /#access_token=...  (or /#error=...).
// Capture that here before the router mounts, otherwise the token in the URL
// hash is thrown away and the guard bounces back to /login.
async function consumeOAuthRedirect() {
  const hash = new URLSearchParams(window.location.hash.slice(1))
  const error = hash.get('error')
  const token = hash.get('access_token') ?? hash.get('token')
  if (!error && !token) return

  history.replaceState(null, '', window.location.pathname)

  if (error) {
    setTimeout(() => toast.error(`Sign-in failed: ${error}`), 0)
    return
  }

  // Keep the token no matter what — a failed profile/workspace fetch (e.g. an
  // inactive account the backend rejects) must not wipe the session.
  useAuthStore.setState({ token })

  const user = await getMe().catch(() => null)
  const workspaces = await getWorkspaces().catch(() => [])

  if (user) useAuthStore.getState().setAuth(user, token!)
  useWorkspaceStore.getState().setWorkspaces(workspaces)
  if (workspaces.length > 0)
    useWorkspaceStore.getState().setWorkspace(workspaces[0])
  if (!user || workspaces.length === 0) {
    setTimeout(
      () => toast.error('Signed in, but your account needs activation'),
      0,
    )
  }
  history.replaceState(
    null,
    '',
    workspaces.length > 0 ? '/' : '/onboarding/workspace',
  )
}

consumeOAuthRedirect().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </StrictMode>,
  )
})
