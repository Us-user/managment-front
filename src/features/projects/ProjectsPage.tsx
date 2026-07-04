import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Briefcase,
  ChevronDown,
  Search,
  Star,
  MoreHorizontal,
  Settings,
  LayoutGrid,
  Globe,
  Users,
  Tag,
  Calendar,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getProjects, type Project } from '@/api/project'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { AddProjectDialog } from './AddProjectDialog'

export function ProjectsPage() {
  const navigate = useNavigate()
  const workspace = useWorkspaceStore((s) => s.workspace)
  const [projects, setProjects] = useState<Project[]>([])
  const [query, setQuery] = useState('')
  const [addOpen, setAddOpen] = useState(false)

  async function load() {
    if (!workspace) return
    setProjects(await getProjects(workspace.slug).catch(() => []))
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!workspace) return
      const list = await getProjects(workspace.slug).catch(() => [])
      if (!cancelled) setProjects(list)
    })()
    return () => {
      cancelled = true
    }
  }, [workspace?.slug]) // eslint-disable-line react-hooks/exhaustive-deps

  const q = query.trim().toLowerCase()
  const rows = q
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.identifier.toLowerCase().includes(q),
      )
    : projects

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-4">
        <span className="flex items-center gap-1.5 text-sm font-medium">
          <Briefcase size={15} /> Projects
        </span>
        <span className="flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
          Your projects
          <span className="rounded bg-primary px-1.5 text-primary-foreground">
            {projects.length}
          </span>
          <ChevronDown size={12} />
        </span>

        <div className="relative ml-auto">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="h-8 w-56 pl-8"
          />
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          Add Project
        </Button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((p) => (
            <div
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/projects/${p.id}/work-items`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate(`/projects/${p.id}/work-items`)
                }
              }}
              className="cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="relative h-28 bg-gradient-to-r from-slate-700 via-rose-600 to-sky-700">
                <div className="absolute -bottom-4 left-4 flex h-9 w-9 items-center justify-center rounded-md bg-amber-400 text-lg">
                  📊
                </div>
                <div className="absolute right-2 top-2 flex items-center gap-1">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="rounded p-1 text-white/80 hover:bg-black/30"
                  >
                    <Star size={15} />
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="rounded p-1 text-white/80 hover:bg-black/30"
                      >
                        <MoreHorizontal size={15} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => navigate(`/projects/${p.id}/work-items`)}
                      >
                        <LayoutGrid size={14} className="mr-2" />
                        Open board
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/projects/${p.id}/settings/general`)
                        }
                      >
                        <Settings size={14} className="mr-2" />
                        Settings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="px-4 pb-4 pt-6">
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.identifier}</p>
                {/* ponytail: meta chips are mock — network/members/labels/dates
                    aren't in the project API yet. */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded border border-border px-1.5 py-0.5">
                    {p.is_archived ? 'Archived' : 'Draft'}
                  </span>
                  <Globe size={13} />
                  <Users size={13} />
                  <span className="flex items-center gap-1">
                    <Tag size={13} /> Labels
                  </span>
                  <Calendar size={13} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {rows.length === 0 && (
          <p className="mt-16 text-center text-sm text-muted-foreground">
            {projects.length === 0
              ? 'No projects yet. Create your first one.'
              : 'No projects match your search.'}
          </p>
        )}
      </div>

      <AddProjectDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreated={load}
      />
    </div>
  )
}
