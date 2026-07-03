import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Home,
  PencilLine,
  User,
  ChevronDown,
  ChevronRight,
  Hash,
  SlidersHorizontal,
  LayoutDashboard,
  PanelLeftClose,
  FolderOpen,
  MoreHorizontal,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Home', icon: Home, to: '/' },
  { label: 'Drafts', icon: PencilLine, to: '/drafts' },
  { label: 'Your work', icon: User, to: '/your-work' },
]

const WORKSPACE_ITEMS = [
  { label: 'Projects', icon: FolderOpen, to: '/projects-list' },
  { label: 'More', icon: MoreHorizontal, to: '/more' },
]

const SAMPLE_PROJECTS = [
  {
    id: 'taskm',
    identifier: 'TASKM',
    name: 'Task Management',
    color: '#6366f1',
  },
]

export function SidebarPanel({ className }: { className?: string }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [workspaceOpen, setWorkspaceOpen] = useState(true)
  const [projectsOpen, setProjectsOpen] = useState(true)

  function isActive(to: string) {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  return (
    <div
      className={cn(
        'flex w-[240px] shrink-0 flex-col border-r border-border bg-card',
        className,
      )}
    >
      {/* Panel header */}
      <div className="flex h-10 items-center justify-between px-3 border-b border-border">
        <span className="text-sm font-semibold">Projects</span>
        <div className="flex items-center gap-0.5">
          <button className="rounded p-1 text-muted-foreground hover:bg-muted transition-colors">
            <SlidersHorizontal size={13} />
          </button>
          <button className="rounded p-1 text-muted-foreground hover:bg-muted transition-colors">
            <LayoutDashboard size={13} />
          </button>
          <button className="rounded p-1 text-muted-foreground hover:bg-muted transition-colors">
            <PanelLeftClose size={13} />
          </button>
        </div>
      </div>

      {/* New work item */}
      <div className="px-3 py-2">
        <button className="flex w-full items-center gap-2 rounded-md border border-dashed border-border px-3 py-1.5 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
          <Hash size={13} />
          New work item
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {/* Primary nav */}
        <nav className="space-y-0.5 mb-3">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.to}
              onClick={() => navigate(item.to)}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                isActive(item.to)
                  ? 'bg-nav-active-bg text-primary font-medium'
                  : 'text-foreground hover:bg-muted',
              )}
            >
              <item.icon size={14} className="shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Workspace section */}
        <div className="mb-3">
          <button
            onClick={() => setWorkspaceOpen((o) => !o)}
            className="flex w-full items-center justify-between px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Workspace</span>
            {workspaceOpen ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronRight size={12} />
            )}
          </button>
          {workspaceOpen && (
            <div className="mt-0.5 space-y-0.5">
              {WORKSPACE_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.to)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <item.icon
                    size={14}
                    className="shrink-0 text-muted-foreground"
                  />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Projects section */}
        <div>
          <button
            onClick={() => setProjectsOpen((o) => !o)}
            className="flex w-full items-center justify-between px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Projects</span>
            {projectsOpen ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronRight size={12} />
            )}
          </button>
          {projectsOpen && (
            <div className="mt-0.5 space-y-0.5">
              {SAMPLE_PROJECTS.map((project) => (
                <button
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}/work-items`)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted transition-colors group"
                >
                  <div
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
                    style={{ backgroundColor: project.color }}
                  >
                    {project.identifier[0]}
                  </div>
                  <span className="flex-1 truncate text-left">
                    {project.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trial banner */}
      <div className="px-3 pb-3">
        <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-center">
          <span className="text-xs font-medium text-amber-700">
            Business trial ends in 12d
          </span>
        </div>
      </div>
    </div>
  )
}
