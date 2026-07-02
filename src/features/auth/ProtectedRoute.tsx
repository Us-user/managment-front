import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export function ProtectedRoute() {
  const token = useAuthStore(s => s.token)
  if (!token) return <Navigate to="/login" replace />
  return <Outlet />
}

export function WorkspaceRoute() {
  const token = useAuthStore(s => s.token)
  const workspace = useAuthStore(s => s.workspace)
  if (!token) return <Navigate to="/login" replace />
  if (!workspace) return <Navigate to="/onboarding/workspace" replace />
  return <Outlet />
}
