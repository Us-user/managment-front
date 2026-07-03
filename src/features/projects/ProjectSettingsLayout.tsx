import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Settings2,
  Users,
  Clock,
  RefreshCw,
  Layers,
  PanelsTopLeft,
  FileText,
  Inbox,
  Timer,
  Flag,
  Megaphone,
  CircleDot,
  Tag,
  Ruler,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getProject } from '@/api/project'
import { useWorkspaceStore } from '@/stores/workspaceStore'

const GENERAL = [
  { label: 'General', icon: Settings2, to: 'general' },
  { label: 'Members', icon: Users, to: 'members' },
  { label: 'Worklogs', icon: Clock, to: 'worklogs' },
]
const FEATURES = [
  { label: 'Cycles', icon: RefreshCw, to: 'cycles' },
  { label: 'Modules', icon: Layers, to: 'modules' },
  { label: 'Views', icon: PanelsTopLeft, to: 'views' },
  { label: 'Pages', icon: FileText, to: 'pages' },
  { label: 'Intake', icon: Inbox, to: 'intake' },
  { label: 'Time tracking', icon: Timer, to: 'time-tracking' },
  { label: 'Milestones', icon: Flag, to: 'milestones' },
  { label: 'Project Updates', icon: Megaphone, to: 'updates' },
]
const WORK = [
  { label: 'States', icon: CircleDot, to: 'states' },
  { label: 'Labels', icon: Tag, to: 'labels' },
  { label: 'Estimates', icon: Ruler, to: 'estimates' },
]

function NavSection({
  title,
  items,
}: {
  title: string
  items: typeof GENERAL
}) {
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

export function ProjectSettingsLayout() {
  const navigate = useNavigate()
  const { projectId } = useParams()
  const workspace = useWorkspaceStore((s) => s.workspace)
  const [name, setName] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!workspace || !projectId) return
      const p = await getProject(workspace.slug, projectId).catch(() => null)
      if (!cancelled && p) setName(p.name)
    })()
    return () => {
      cancelled = true
    }
  }, [workspace?.slug, projectId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="flex w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-card">
        <button
          onClick={() => navigate('/projects-list')}
          className="flex items-center gap-2 px-4 py-4 text-base font-semibold text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          Project settings
        </button>

        <div className="flex items-center gap-2.5 px-4 pb-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-lg">
            📊
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {name || 'Project'}
            </p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>

        <nav className="px-2 pb-6">
          <NavSection title="General" items={GENERAL} />
          <NavSection title="Features" items={FEATURES} />
          <NavSection title="Work-Structure" items={WORK} />
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
