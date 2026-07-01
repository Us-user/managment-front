import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  ChevronDown,
  ChevronRight,
  Search,
  Home,
  Briefcase,
  Bell,
  FileText,
  Sparkles,
  BarChart3,
  Trash2,
  Settings,
  Plus,
  MoreHorizontal,
  CircleDot,
  RefreshCw,
  Layers,
  PanelsTopLeft,
  LogOut,
  User,
  CreditCard,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

const PRIMARY_NAV = [
  { label: 'Home', icon: Home, to: '/' },
  { label: 'Your Work', icon: Briefcase, to: '/your-work' },
  { label: 'Notifications', icon: Bell, to: '/notifications', badge: '3' },
  { label: 'Drafts', icon: FileText, to: '/drafts' },
]

const BOTTOM_NAV = [
  { label: 'AI', icon: Sparkles, to: '/ai' },
  { label: 'Analytics', icon: BarChart3, to: '/analytics' },
  { label: 'Trash', icon: Trash2, to: '/trash' },
]

const SAMPLE_PROJECTS = [
  { id: 'proj-1', emoji: '🚀', name: 'Alpha Launch' },
  { id: 'proj-2', emoji: '🎨', name: 'Design System' },
]

const PROJECT_SUB_ITEMS = [
  { label: 'Work Items', icon: CircleDot, segment: 'work-items' },
  { label: 'Cycles', icon: RefreshCw, segment: 'cycles' },
  { label: 'Modules', icon: Layers, segment: 'modules' },
  { label: 'Views', icon: PanelsTopLeft, segment: 'views' },
]

function NavRow({
  icon: Icon,
  label,
  badge,
  active,
  onClick,
  indent,
}: {
  icon: React.ElementType
  label: string
  badge?: string
  active: boolean
  onClick: () => void
  indent?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
        indent && 'pl-8',
        active
          ? 'bg-[#e9eefc] font-medium text-[#3f76ff]'
          : 'text-foreground hover:bg-[#efeff1]',
      )}
    >
      <Icon size={16} className="shrink-0" />
      <span className="flex-1 truncate text-left">{label}</span>
      {badge && (
        <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
          {badge}
        </Badge>
      )}
    </button>
  )
}

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())

  function isActive(to: string) {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  function toggleProject(id: string) {
    setExpandedProjects(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="flex h-full flex-col">
      {/* Workspace switcher */}
      <div className="px-3 pt-3 pb-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-[#efeff1] transition-colors">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#3f76ff] text-xs font-bold text-white">
                D
              </div>
              <span className="flex-1 truncate text-left text-sm font-medium">Duo Workspace</span>
              <ChevronDown size={14} className="shrink-0 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuItem>Switch workspace</DropdownMenuItem>
            <DropdownMenuItem>Create workspace</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="h-8 pl-8 text-xs" placeholder="Search…" readOnly />
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        {/* Primary nav */}
        <nav className="space-y-0.5 pb-2">
          {PRIMARY_NAV.map(item => (
            <NavRow
              key={item.to}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              active={isActive(item.to)}
              onClick={() => navigate(item.to)}
            />
          ))}
        </nav>

        <Separator className="my-2" />

        {/* Projects section */}
        <div className="pb-2">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Projects
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded p-0.5 hover:bg-[#efeff1] transition-colors">
                  <Plus size={14} className="text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>New project</DropdownMenuItem>
                <DropdownMenuItem>Join project</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-0.5 space-y-0.5">
            {SAMPLE_PROJECTS.map(project => (
              <div key={project.id}>
                {/* Project row */}
                <div className="group flex items-center gap-1 rounded-md px-2 py-1.5 hover:bg-[#efeff1] transition-colors">
                  <button
                    onClick={() => toggleProject(project.id)}
                    className="shrink-0 rounded p-0.5"
                  >
                    {expandedProjects.has(project.id) ? (
                      <ChevronDown size={12} className="text-muted-foreground" />
                    ) : (
                      <ChevronRight size={12} className="text-muted-foreground" />
                    )}
                  </button>
                  <button
                    className="flex flex-1 items-center gap-2 text-left"
                    onClick={() => navigate(`/projects/${project.id}/work-items`)}
                  >
                    <span className="text-sm">{project.emoji}</span>
                    <span className="flex-1 truncate text-sm">{project.name}</span>
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="invisible rounded p-0.5 hover:bg-[#e0e0e3] group-hover:visible transition-colors">
                        <MoreHorizontal size={14} className="text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Sub-rows */}
                {expandedProjects.has(project.id) && (
                  <div className="mt-0.5 space-y-0.5">
                    {PROJECT_SUB_ITEMS.map(sub => (
                      <NavRow
                        key={sub.segment}
                        icon={sub.icon}
                        label={sub.label}
                        active={location.pathname === `/projects/${project.id}/${sub.segment}`}
                        onClick={() => navigate(`/projects/${project.id}/${sub.segment}`)}
                        indent
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Bottom nav */}
      <div className="px-3 pb-1">
        <Separator className="mb-2" />
        <nav className="space-y-0.5">
          {BOTTOM_NAV.map(item => (
            <NavRow
              key={item.to}
              icon={item.icon}
              label={item.label}
              active={isActive(item.to)}
              onClick={() => navigate(item.to)}
            />
          ))}
        </nav>
      </div>

      {/* Settings + User dropdown */}
      <div className="px-3 pb-3">
        <Separator className="mb-2" />
        <NavRow
          icon={Settings}
          label="Settings"
          active={isActive('/settings')}
          onClick={() => navigate('/settings')}
        />
        <div className="mt-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-[#efeff1] transition-colors">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs font-semibold bg-[#3f76ff] text-white">
                    A
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 truncate text-left text-sm">Abdulloh</span>
                <ChevronDown size={14} className="shrink-0 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuItem>
                <User size={14} className="mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard size={14} className="mr-2" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut size={14} className="mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
