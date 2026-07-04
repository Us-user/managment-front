import {
  MoreHorizontal,
  Trash2,
  Check,
  CalendarDays,
  UserPlus,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AvatarGroup } from '@/components/ui/avatar-group'
import { PRIORITY_CONFIG } from '@/components/ui/status-badge'
import { cn } from '@/lib/utils'
import type { Issue, IssuePriorityValue } from '@/api/issue'
import type { State } from '@/api/state'
import type { Project } from '@/api/project'
import type { WorkspaceMember } from '@/api/workspace'

const PRIORITIES: IssuePriorityValue[] = [
  'urgent',
  'high',
  'medium',
  'low',
  'none',
]

// Shared look for the small interactive chips along the bottom of a card.
const chipBtn =
  'flex h-6 items-center gap-1 rounded border border-border px-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent'

function formatDue(due: string) {
  return new Date(due).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

// Change an issue's priority straight from the card.
function PriorityMenu({
  value,
  onChange,
}: {
  value: IssuePriorityValue
  onChange: (p: IssuePriorityValue) => void
}) {
  const meta = PRIORITY_CONFIG[value]
  const Icon = meta.icon
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title={`Priority: ${meta.label}`}
          onClick={(e) => e.stopPropagation()}
          className={chipBtn}
        >
          <Icon size={13} className={meta.iconColor} />
          {value !== 'none' && <span>{meta.label}</span>}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {PRIORITIES.map((p) => {
          const m = PRIORITY_CONFIG[p]
          const PIcon = m.icon
          return (
            <DropdownMenuItem
              key={p}
              onClick={(e) => {
                e.stopPropagation()
                onChange(p)
              }}
            >
              <PIcon size={14} className={cn('mr-2', m.iconColor)} />
              <span className="flex-1">{m.label}</span>
              {value === p && <Check size={14} />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Show the current stage (state) and let the user move the item to another one.
function StateMenu({
  states,
  value,
  onChange,
}: {
  states: State[]
  value: string
  onChange: (stateId: string) => void
}) {
  const current = states.find((s) => s.id === value)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title={`State: ${current?.name ?? '—'}`}
          onClick={(e) => e.stopPropagation()}
          className={cn(chipBtn, 'text-foreground')}
        >
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ background: current?.color ?? '#94a3b8' }}
          />
          <span className="max-w-[90px] truncate">
            {current?.name ?? 'State'}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        {states.map((s) => (
          <DropdownMenuItem
            key={s.id}
            onClick={(e) => {
              e.stopPropagation()
              if (s.id !== value) onChange(s.id)
            }}
          >
            <span
              className="mr-2 size-2.5 rounded-full"
              style={{ background: s.color }}
            />
            <span className="flex-1">{s.name}</span>
            {s.id === value && <Check size={14} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Show who's assigned, and add/remove assignees from the card.
function AssigneeMenu({
  members,
  assignees,
  onToggle,
}: {
  members: WorkspaceMember[]
  assignees: Issue['assignees']
  onToggle: (member: WorkspaceMember, alreadyAssigned: boolean) => void
}) {
  const assignedIds = new Set(assignees.map((a) => a.user_id))
  const avatars = assignees.map((a) => ({
    src: a.user?.avatar_url ?? undefined,
    name: a.user?.display_name ?? '?',
  }))
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title="Assignees"
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'ml-auto flex h-6 items-center rounded px-0.5 transition-colors hover:bg-accent',
            avatars.length === 0 && 'border border-border px-1.5',
          )}
        >
          {avatars.length > 0 ? (
            <AvatarGroup avatars={avatars} max={3} />
          ) : (
            <UserPlus size={13} className="text-muted-foreground" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-64 w-52 overflow-y-auto"
      >
        {members.length === 0 && (
          <p className="px-2 py-1.5 text-sm text-muted-foreground">
            No members.
          </p>
        )}
        {members.map((m) => {
          const selected = assignedIds.has(m.user_id)
          return (
            <DropdownMenuItem
              key={m.user_id}
              // Keep the menu open so several people can be toggled at once.
              onSelect={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation()
                onToggle(m, selected)
              }}
            >
              <Avatar className="mr-2 size-5">
                <AvatarImage src={m.user.avatar_url ?? undefined} />
                <AvatarFallback className="text-[10px]">
                  {m.user.display_name?.[0]?.toUpperCase() ?? '?'}
                </AvatarFallback>
              </Avatar>
              <span className="flex-1 truncate">{m.user.display_name}</span>
              {selected && <Check size={14} />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function IssueCard({
  issue,
  project,
  states,
  members,
  onOpen,
  onPriorityChange,
  onStateChange,
  onAssigneeToggle,
  onDelete,
  onDragStart,
  onDragEnd,
  dragging,
}: {
  issue: Issue
  project: Project | null
  states: State[]
  members: WorkspaceMember[]
  onOpen: () => void
  onPriorityChange: (p: IssuePriorityValue) => void
  onStateChange: (stateId: string) => void
  onAssigneeToggle: (member: WorkspaceMember, alreadyAssigned: boolean) => void
  onDelete: () => void
  onDragStart: () => void
  onDragEnd: () => void
  dragging: boolean
}) {
  const identifier = project
    ? `${project.identifier}-${issue.sequence_id}`
    : `#${issue.sequence_id}`

  const labels = issue.labels.filter((l) => l.label)

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', issue.id)
        e.dataTransfer.effectAllowed = 'move'
        onDragStart()
      }}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      className={cn(
        'group cursor-pointer rounded-lg border border-border bg-card p-2.5 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing',
        dragging && 'opacity-40',
      )}
    >
      {/* Top row: identifier + menu */}
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-mono text-[11px] text-muted-foreground">
          {identifier}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100 focus:opacity-100"
            >
              <MoreHorizontal size={15} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuSeparator className="mt-0" />
            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <Trash2 size={14} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title */}
      <p className="mb-2 line-clamp-3 text-sm text-foreground">{issue.title}</p>

      {/* Labels */}
      {labels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {labels.slice(0, 3).map((l) => (
            <span
              key={l.label_id}
              className="flex items-center gap-1 rounded-full border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground"
            >
              <span
                className="size-2 rounded-full"
                style={{ background: l.label?.color }}
              />
              {l.label?.name}
            </span>
          ))}
        </div>
      )}

      {/* Meta row: priority · stage · due · assignee */}
      <div className="flex flex-wrap items-center gap-1.5">
        <PriorityMenu value={issue.priority} onChange={onPriorityChange} />
        <StateMenu
          states={states}
          value={issue.state_id}
          onChange={onStateChange}
        />

        {issue.due_date && (
          <span className="flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
            <CalendarDays size={11} />
            {formatDue(issue.due_date)}
          </span>
        )}

        <AssigneeMenu
          members={members}
          assignees={issue.assignees}
          onToggle={onAssigneeToggle}
        />
      </div>
    </div>
  )
}
