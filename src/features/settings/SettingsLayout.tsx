import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Settings2,
  Users,
  CreditCard,
  Download,
  Upload,
  Clock,
  Fingerprint,
  Box,
  Plug,
  Network,
  Users2,
  BookOpen,
  Lightbulb,
  UserRound,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { useWorkspaceStore } from '@/stores/workspaceStore'

const ADMIN = [
  { label: 'General', icon: Settings2, to: 'general' },
  { label: 'Members', icon: Users, to: 'members' },
  { label: 'Billing and plans', icon: CreditCard, to: 'billing' },
  { label: 'Imports', icon: Download, to: 'imports' },
  { label: 'Exports', icon: Upload, to: 'exports' },
  { label: 'Worklogs', icon: Clock, to: 'worklogs' },
  { label: 'Identity', icon: Fingerprint, to: 'identity' },
]

const FEATURES = [
  { label: 'Projects', icon: Box, to: 'projects' },
  { label: 'Integrations', icon: Plug, to: 'integrations' },
  { label: 'Connections', icon: Network, to: 'connections' },
  { label: 'Teamspaces', icon: Users2, to: 'teamspaces' },
  { label: 'Wiki', icon: BookOpen, to: 'wiki' },
  { label: 'Initiatives', icon: Lightbulb, to: 'initiatives' },
  { label: 'Customers', icon: UserRound, to: 'customers' },
]

function NavSection({ title, items }: { title: string; items: typeof ADMIN }) {
  return (
    <div className="mb-4">
      <p className="px-3 pb-1 text-xs font-medium text-muted-foreground">
        {title}
      </p>
      <div className="space-y-0.5">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors',
                isActive
                  ? 'bg-nav-active-bg text-primary font-medium'
                  : 'text-foreground hover:bg-muted',
              )
            }
          >
            <item.icon size={15} className="shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export function SettingsLayout() {
  const navigate = useNavigate()
  const workspace = useWorkspaceStore((s) => s.workspace)
  const wsInitial = workspace?.name?.[0]?.toUpperCase() ?? 'W'

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Settings sidebar */}
      <aside className="flex w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-card">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-4 text-base font-semibold text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          Workspace settings
        </button>

        <div className="flex items-center gap-2.5 px-4 pb-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            {wsInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {workspace?.name ?? 'Workspace'}
            </p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
          <Badge variant="secondary" className="shrink-0 text-[10px]">
            Business trial
          </Badge>
        </div>

        <nav className="px-2">
          <NavSection title="Administration" items={ADMIN} />
          <NavSection title="Features" items={FEATURES} />
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
