import { useEffect, useMemo, useState } from 'react'
import {
  Briefcase,
  RotateCw,
  CircleDot,
  Timer,
  CheckCircle2,
  CalendarClock,
  AlertCircle,
  Inbox,
  type LucideIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AvatarGroup } from '@/components/ui/avatar-group'
import { PRIORITY_CONFIG } from '@/components/ui/status-badge'
import { useAuthStore } from '@/stores/authStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { getProjects, type Project } from '@/api/project'
import { getStates, type State, type StateGroup } from '@/api/state'
import { getIssues, type Issue, type IssuePriorityValue } from '@/api/issue'
import { IssueDetailPanel } from '@/features/work-items/IssueDetailPanel'

const errMsg = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback

// Order + display metadata for the five workflow state groups. Colours are hex
// (not Tailwind classes) so they can drive inline styles on the distribution bar.
const GROUP_ORDER: StateGroup[] = [
  'backlog',
  'unstarted',
  'started',
  'completed',
  'cancelled',
]
const GROUP_META: Record<StateGroup, { label: string; color: string }> = {
  backlog: { label: 'Backlog', color: '#8b8b90' },
  unstarted: { label: 'Todo', color: '#6b7280' },
  started: { label: 'In Progress', color: '#f59e0b' },
  completed: { label: 'Done', color: '#10b981' },
  cancelled: { label: 'Cancelled', color: '#e5484d' },
}

const PRIORITY_ORDER: IssuePriorityValue[] = [
  'urgent',
  'high',
  'medium',
  'low',
  'none',
]
// Hex equivalents of the priority palette, for the distribution bar segments.
const PRIORITY_BAR: Record<IssuePriorityValue, string> = {
  urgent: '#e5484d',
  high: '#f76808',
  medium: '#eab308',
  low: '#3f76ff',
  none: '#8b8b90',
}

// Deterministic accent per project — mirrors the sidebar so a project's tile
// colour stays consistent across the app.
const PROJECT_COLORS = [
  '#6366f1',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
]
function projectColor(id: string) {
  let hash = 0
  for (const ch of id) hash = (hash + ch.charCodeAt(0)) % PROJECT_COLORS.length
  return PROJECT_COLORS[hash]
}

function formatDue(iso: string) {
  const d = new Date(iso)
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  if (d.getFullYear() !== new Date().getFullYear()) opts.year = 'numeric'
  return d.toLocaleDateString(undefined, opts)
}

type Tab = 'assigned' | 'created'
type GroupBy = 'project' | 'state' | 'priority'

interface Segment {
  key: string
  label: string
  color: string
  count: number
  icon?: LucideIcon
}

interface IssueGroup {
  id: string
  label: string
  kind: GroupBy
  color: string
  identifier?: string
  icon?: LucideIcon
  items: Issue[]
}

export function YourWorkPage() {
  const slug = useWorkspaceStore((s) => s.workspace?.slug)
  const user = useAuthStore((s) => s.user)
  const userId = user?.id

  const [projects, setProjects] = useState<Project[]>([])
  const [statesByProject, setStatesByProject] = useState<
    Record<string, State[]>
  >({})
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const [tab, setTab] = useState<Tab>('assigned')
  const [groupBy, setGroupBy] = useState<GroupBy>('project')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Load every project, then its states + issues in parallel. Issues live only
  // under a project on the backend, so "your work" is assembled by fanning out
  // across projects and filtering to the current user client-side.
  useEffect(() => {
    if (!slug) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const projs = await getProjects(slug)
        if (cancelled) return
        const results = await Promise.all(
          projs.map(async (p) => {
            const [st, page] = await Promise.all([
              getStates(slug, p.id).catch(() => [] as State[]),
              getIssues(slug, p.id, {
                limit: 100,
                sort_by: 'updated_at',
                order: 'desc',
              }).catch(() => ({ data: [] as Issue[], next_cursor: null })),
            ])
            return { project: p, states: st, issues: page.data }
          }),
        )
        if (cancelled) return
        setProjects(projs)
        setStatesByProject(
          Object.fromEntries(results.map((r) => [r.project.id, r.states])),
        )
        setIssues(results.flatMap((r) => r.issues))
      } catch (err) {
        if (!cancelled) setError(errMsg(err, 'Failed to load your work'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug, refreshKey])

  const projectsById = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.id, p])),
    [projects],
  )
  const statesById = useMemo(() => {
    const m: Record<string, State> = {}
    for (const arr of Object.values(statesByProject))
      for (const s of arr) m[s.id] = s
    return m
  }, [statesByProject])

  const groupOf = (i: Issue): StateGroup | undefined =>
    statesById[i.state_id]?.group
  const isOpenIssue = (i: Issue) => {
    const g = groupOf(i)
    return g !== 'completed' && g !== 'cancelled'
  }

  const assigned = useMemo(
    () =>
      userId
        ? issues.filter((i) => i.assignees.some((a) => a.user_id === userId))
        : [],
    [issues, userId],
  )
  const created = useMemo(
    () => (userId ? issues.filter((i) => i.created_by_id === userId) : []),
    [issues, userId],
  )

  // Overdue = has a past due date and isn't already done/cancelled.
  const startOfToday = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])
  const isOverdue = (i: Issue) =>
    !!i.due_date && new Date(i.due_date) < startOfToday && isOpenIssue(i)

  // Headline counts, all over the "assigned to me" set.
  const stats = useMemo(() => {
    const inProgress = assigned.filter((i) => groupOf(i) === 'started').length
    const completed = assigned.filter((i) => groupOf(i) === 'completed').length
    const overdue = assigned.filter(isOverdue).length
    return { assigned: assigned.length, inProgress, completed, overdue }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assigned, statesById, startOfToday])

  const byState: Segment[] = useMemo(
    () =>
      GROUP_ORDER.map((g) => ({
        key: g,
        label: GROUP_META[g].label,
        color: GROUP_META[g].color,
        count: assigned.filter((i) => groupOf(i) === g).length,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assigned, statesById],
  )
  const byPriority: Segment[] = useMemo(
    () =>
      PRIORITY_ORDER.map((p) => ({
        key: p,
        label: PRIORITY_CONFIG[p].label,
        color: PRIORITY_BAR[p],
        icon: PRIORITY_CONFIG[p].icon,
        count: assigned.filter((i) => i.priority === p).length,
      })),
    [assigned],
  )

  // Build the grouped list for the active tab + group-by choice.
  const groups: IssueGroup[] = useMemo(() => {
    const list = tab === 'assigned' ? assigned : created
    if (groupBy === 'project') {
      return projects
        .map((p) => ({
          id: p.id,
          label: p.name,
          kind: 'project' as const,
          color: projectColor(p.id),
          identifier: p.identifier,
          items: list.filter((i) => i.project_id === p.id),
        }))
        .filter((g) => g.items.length > 0)
    }
    if (groupBy === 'state') {
      return GROUP_ORDER.map((g) => ({
        id: g,
        label: GROUP_META[g].label,
        kind: 'state' as const,
        color: GROUP_META[g].color,
        items: list.filter((i) => groupOf(i) === g),
      })).filter((g) => g.items.length > 0)
    }
    return PRIORITY_ORDER.map((p) => ({
      id: p,
      label: PRIORITY_CONFIG[p].label,
      kind: 'priority' as const,
      color: PRIORITY_BAR[p],
      icon: PRIORITY_CONFIG[p].icon,
      items: list.filter((i) => i.priority === p),
    })).filter((g) => g.items.length > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, assigned, created, groupBy, projects, statesById])

  const selectedIssue = issues.find((i) => i.id === selectedId) ?? null

  function refresh() {
    setRefreshKey((k) => k + 1)
    toast.message('Refreshing your work…')
  }

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.display_name?.split(' ')[0] ?? 'there'
  const initial = user?.display_name?.[0]?.toUpperCase() ?? 'U'

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-6 text-sm font-medium">
        <Briefcase size={16} />
        Your Work
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto gap-1.5"
          onClick={refresh}
          disabled={loading}
        >
          <RotateCw size={14} className={cn(loading && 'animate-spin')} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-8">
          {/* Greeting */}
          <div className="mb-6 flex items-center gap-3">
            <Avatar className="size-11">
              <AvatarFallback className="bg-purple-600 text-base font-semibold text-white">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold">
                {greeting}, {firstName}
              </h1>
              <p className="text-sm text-muted-foreground">
                Everything assigned to you across your projects, in one place.
              </p>
            </div>
          </div>

          {loading ? (
            <LoadingState />
          ) : error ? (
            <EmptyState
              icon={AlertCircle}
              title="Couldn't load your work"
              description={error}
              action={{ label: 'Try again', onClick: refresh }}
            />
          ) : projects.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No projects yet"
              description="Once you're part of a project and get assigned work items, they'll appear here."
            />
          ) : (
            <>
              {/* Stat tiles */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatTile
                  icon={CircleDot}
                  tone="text-primary"
                  label="Assigned to you"
                  value={stats.assigned}
                />
                <StatTile
                  icon={Timer}
                  tone="text-amber-500"
                  label="In progress"
                  value={stats.inProgress}
                />
                <StatTile
                  icon={CheckCircle2}
                  tone="text-emerald-500"
                  label="Completed"
                  value={stats.completed}
                />
                <StatTile
                  icon={CalendarClock}
                  tone={
                    stats.overdue > 0
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                  }
                  label="Overdue"
                  value={stats.overdue}
                />
              </div>

              {/* Breakdowns */}
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Panel title="Assigned by state">
                  <DistributionBar segments={byState} total={stats.assigned} />
                </Panel>
                <Panel title="Assigned by priority">
                  <DistributionBar
                    segments={byPriority}
                    total={stats.assigned}
                  />
                </Panel>
              </div>

              {/* Tabs + group-by */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                <Segmented
                  value={tab}
                  onChange={(v) => setTab(v as Tab)}
                  options={[
                    { value: 'assigned', label: `Assigned ${assigned.length}` },
                    { value: 'created', label: `Created ${created.length}` },
                  ]}
                />
                <div className="flex items-center gap-2">
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    Group by
                  </span>
                  <Segmented
                    value={groupBy}
                    onChange={(v) => setGroupBy(v as GroupBy)}
                    options={[
                      { value: 'project', label: 'Project' },
                      { value: 'state', label: 'State' },
                      { value: 'priority', label: 'Priority' },
                    ]}
                  />
                </div>
              </div>

              {/* Grouped issue list */}
              <div className="mt-4">
                {groups.length === 0 ? (
                  <EmptyState
                    icon={Inbox}
                    title={
                      tab === 'assigned'
                        ? 'Nothing assigned to you'
                        : "You haven't created any work items"
                    }
                    description={
                      tab === 'assigned'
                        ? 'Work items assigned to you across all projects will show up here.'
                        : 'Work items you create across all projects will show up here.'
                    }
                  />
                ) : (
                  groups.map((g) => (
                    <section key={g.id} className="mb-5">
                      <header className="mb-1.5 flex items-center gap-2 px-1">
                        <GroupTile group={g} />
                        <span className="text-sm font-medium text-foreground">
                          {g.label}
                        </span>
                        <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                          {g.items.length}
                        </span>
                      </header>
                      <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                        {g.items.map((issue) => (
                          <IssueRow
                            key={issue.id}
                            issue={issue}
                            project={projectsById[issue.project_id] ?? null}
                            state={statesById[issue.state_id]}
                            overdue={isOverdue(issue)}
                            onOpen={() => setSelectedId(issue.id)}
                          />
                        ))}
                      </div>
                    </section>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reuse the full work-item detail panel, scoped to the clicked issue's
          own project so state/label/assignee edits hit the right endpoints. */}
      {slug && (
        <IssueDetailPanel
          issue={selectedIssue}
          project={
            selectedIssue
              ? (projectsById[selectedIssue.project_id] ?? null)
              : null
          }
          slug={slug}
          projectId={selectedIssue?.project_id ?? ''}
          states={
            selectedIssue
              ? (statesByProject[selectedIssue.project_id] ?? [])
              : []
          }
          onOpenChange={(open) => !open && setSelectedId(null)}
          onUpdated={(updated) =>
            setIssues((prev) =>
              prev.map((i) => (i.id === updated.id ? updated : i)),
            )
          }
          onDeleted={(id) => {
            setIssues((prev) => prev.filter((i) => i.id !== id))
            setSelectedId(null)
          }}
        />
      )}
    </div>
  )
}

function StatTile({
  icon: Icon,
  tone,
  label,
  value,
}: {
  icon: LucideIcon
  tone: string
  label: string
  value: number
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon size={15} className={tone} />
        <span className="truncate text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
        {value}
      </p>
    </div>
  )
}

function Panel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  )
}

function DistributionBar({
  segments,
  total,
}: {
  segments: Segment[]
  total: number
}) {
  const active = segments.filter((s) => s.count > 0)
  return (
    <div>
      <div className="flex h-2 overflow-hidden rounded-full bg-muted">
        {total > 0 &&
          active.map((s) => (
            <div
              key={s.key}
              style={{
                width: `${(s.count / total) * 100}%`,
                background: s.color,
              }}
              title={`${s.label}: ${s.count}`}
            />
          ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {segments.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.key} className="flex items-center gap-2 text-xs">
              {Icon ? (
                <Icon
                  size={13}
                  style={{ color: s.color }}
                  className="shrink-0"
                />
              ) : (
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ background: s.color }}
                />
              )}
              <span className="truncate text-muted-foreground">{s.label}</span>
              <span className="ml-auto font-medium tabular-nums text-foreground">
                {s.count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function GroupTile({ group }: { group: IssueGroup }) {
  if (group.kind === 'project')
    return (
      <span
        className="flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
        style={{ background: group.color }}
      >
        {group.identifier?.[0] ?? '?'}
      </span>
    )
  if (group.kind === 'priority' && group.icon) {
    const Icon = group.icon
    return (
      <Icon size={15} className="shrink-0" style={{ color: group.color }} />
    )
  }
  return (
    <span
      className="size-2.5 shrink-0 rounded-full"
      style={{ background: group.color }}
    />
  )
}

function IssueRow({
  issue,
  project,
  state,
  overdue,
  onOpen,
}: {
  issue: Issue
  project: Project | null
  state: State | undefined
  overdue: boolean
  onOpen: () => void
}) {
  const meta = PRIORITY_CONFIG[issue.priority]
  const PIcon = meta.icon
  const identifier = project
    ? `${project.identifier}-${issue.sequence_id}`
    : `#${issue.sequence_id}`
  const assignees = issue.assignees.map((a) => ({
    src: a.user?.avatar_url ?? undefined,
    name: a.user?.display_name ?? '?',
  }))

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-muted/60"
    >
      <PIcon size={15} className={cn('shrink-0', meta.iconColor)} />
      <span className="w-20 shrink-0 truncate font-mono text-xs text-muted-foreground">
        {identifier}
      </span>
      <span className="flex-1 truncate text-sm text-foreground">
        {issue.title}
      </span>

      {state && (
        <span
          className="hidden shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs sm:inline-flex"
          style={{ background: `${state.color}1a`, color: state.color }}
        >
          <span
            className="size-1.5 rounded-full"
            style={{ background: state.color }}
          />
          {state.name}
        </span>
      )}

      {issue.due_date && (
        <span
          className={cn(
            'hidden shrink-0 items-center gap-1 whitespace-nowrap rounded px-1.5 py-0.5 text-xs sm:inline-flex',
            overdue
              ? 'bg-destructive/10 text-destructive'
              : 'text-muted-foreground',
          )}
        >
          <CalendarClock size={12} />
          {formatDue(issue.due_date)}
        </span>
      )}

      {assignees.length > 0 && <AvatarGroup avatars={assignees} max={3} />}
    </button>
  )
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="inline-flex rounded-md border border-border p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded px-3 py-1 text-sm font-medium transition-colors',
            value === o.value
              ? 'bg-nav-active-bg text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
      <Skeleton className="h-9 w-64 rounded-md" />
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-11 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}
