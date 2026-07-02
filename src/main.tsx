import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { toast } from 'sonner'
import './index.css'
import { router } from './routes'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Toaster } from '@/components/ui/toaster'
import { useAuthStore } from '@/stores/authStore'
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

  useAuthStore.setState({ token }) // so the axios interceptor authorizes the next calls
  try {
    const user = await getMe()
    const workspaces = await getWorkspaces()
    useAuthStore.getState().setAuth(user, token!)
    if (workspaces.length > 0)
      useAuthStore.getState().setWorkspace(workspaces[0])
    history.replaceState(
      null,
      '',
      workspaces.length > 0 ? '/' : '/onboarding/workspace',
    )
  } catch {
    useAuthStore.getState().logout()
    setTimeout(() => toast.error('Could not complete sign-in'), 0)
  }
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
