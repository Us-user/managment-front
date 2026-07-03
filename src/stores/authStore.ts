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
  workspaces: Workspace[]
  setAuth: (user: User, token: string) => void
  setWorkspace: (workspace: Workspace) => void
  setWorkspaces: (workspaces: Workspace[]) => void
  addWorkspace: (workspace: Workspace) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      workspace: null,
      workspaces: [],
      setAuth: (user, token) => set({ user, token }),
      setWorkspace: (workspace) => set({ workspace }),
      setWorkspaces: (workspaces) => set({ workspaces }),
      addWorkspace: (workspace) =>
        set((s) => ({
          workspaces: s.workspaces.some((w) => w.id === workspace.id)
            ? s.workspaces
            : [...s.workspaces, workspace],
        })),
      logout: () =>
        set({ user: null, token: null, workspace: null, workspaces: [] }),
    }),
    { name: 'auth-storage' },
  ),
)
