import { useLocation, useParams } from 'react-router-dom'
import { Menu, ChevronRight, Plus, Filter, LayoutList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const BREADCRUMB_MAP: Record<string, string> = {
  '/': 'Home',
  '/your-work': 'Your Work',
  '/notifications': 'Notifications',
  '/drafts': 'Drafts',
  '/ai': 'AI',
  '/analytics': 'Analytics',
  '/trash': 'Trash',
  '/settings': 'Settings',
}

function getBreadcrumb(pathname: string, projectId?: string): string {
  if (projectId) {
    const segment = pathname.split('/').pop()
    const labels: Record<string, string> = {
      'work-items': 'Work Items',
      cycles: 'Cycles',
      modules: 'Modules',
      views: 'Views',
    }
    return labels[segment ?? ''] ?? segment ?? ''
  }
  return BREADCRUMB_MAP[pathname] ?? ''
}

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation()
  const { id: projectId } = useParams<{ id: string }>()
  const isWorkItems = /\/projects\/.+\/work-items$/.test(location.pathname)
  const section = getBreadcrumb(location.pathname, projectId)

  return (
    <header className="shrink-0 border-b border-border">
      {/* Row 1 — 48px */}
      <div className="flex h-12 items-center gap-3 px-4">
        {/* Hamburger — mobile only */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8"
          onClick={onMenuClick}
        >
          <Menu size={18} />
        </Button>

        {/* Breadcrumb */}
        <div className="flex flex-1 items-center gap-1.5 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Duo Workspace</span>
          {section && (
            <>
              <ChevronRight size={14} />
              <span>{section}</span>
            </>
          )}
        </div>

        {/* Member avatars */}
        <div className="flex items-center -space-x-1.5">
          {['A', 'B', 'C'].map(letter => (
            <Avatar key={letter} className="h-7 w-7 border-2 border-background">
              <AvatarFallback className="text-xs bg-[#3f76ff] text-white">{letter}</AvatarFallback>
            </Avatar>
          ))}
        </div>

        {/* New button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-8 gap-1.5 bg-[#3f76ff] hover:bg-[#3f76ff]/90 text-white">
              <Plus size={14} />
              New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Issue</DropdownMenuItem>
            <DropdownMenuItem>Project</DropdownMenuItem>
            <DropdownMenuItem>Cycle</DropdownMenuItem>
            <DropdownMenuItem>Module</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Row 2 — 44px, only on /projects/:id/work-items */}
      {isWorkItems && (
        <div className="flex h-11 items-center gap-3 border-t border-border px-4">
          <Tabs defaultValue="list" className="h-full">
            <TabsList className="h-8 bg-transparent p-0 gap-1">
              {['List', 'Board', 'Calendar', 'Timeline'].map(view => (
                <TabsTrigger
                  key={view}
                  value={view.toLowerCase()}
                  className="h-8 rounded-md px-3 text-xs data-[state=active]:bg-[#e9eefc] data-[state=active]:text-[#3f76ff] data-[state=active]:shadow-none"
                >
                  {view}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                  <Filter size={13} />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Priority</DropdownMenuItem>
                <DropdownMenuItem>Assignee</DropdownMenuItem>
                <DropdownMenuItem>Label</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                  <LayoutList size={13} />
                  Display
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Group by</DropdownMenuItem>
                <DropdownMenuItem>Order by</DropdownMenuItem>
                <DropdownMenuItem>Show empty groups</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </header>
  )
}
