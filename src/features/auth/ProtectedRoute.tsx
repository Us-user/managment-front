import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'

export function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/login" replace />
  return <Outlet />
}

export function WorkspaceRoute() {
  const token = useAuthStore((s) => s.token)
  const workspace = useWorkspaceStore((s) => s.workspace)
  if (!token) return <Navigate to="/login" replace />
  if (!workspace) return <Navigate to="/onboarding/workspace" replace />
  return <Outlet />
}
