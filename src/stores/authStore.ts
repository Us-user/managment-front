import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  display_name: string
}

interface Workspace {
  id: string
  name: string
  slug: string
}

interface AuthState {
  user: User | null
  token: string | null
  workspace: Workspace | null
  setAuth: (user: User, token: string) => void
  setWorkspace: (workspace: Workspace) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      token: null,
      workspace: null,
      setAuth: (user, token) => set({ user, token }),
      setWorkspace: workspace => set({ workspace }),
      logout: () => set({ user: null, token: null, workspace: null }),
    }),
    { name: 'auth-storage' },
  ),
)
