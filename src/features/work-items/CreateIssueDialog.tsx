import { useEffect, useState } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { CalendarRange, Check, Search, Users } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PRIORITY_CONFIG } from '@/components/ui/status-badge'
import { cn } from '@/lib/utils'
import { createIssue, type Issue, type IssuePriorityValue } from '@/api/issue'
import type { State } from '@/api/state'
import { getWorkspaceMembers, type WorkspaceMember } from '@/api/workspace'

const PRIORITIES: IssuePriorityValue[] = [
  'urgent',
  'high',
  'medium',
  'low',
  'none',
]

const chipCls =
  'flex items-center gap-1.5 whitespace-nowrap rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent focus:outline-none data-[state=open]:bg-accent'
const popCls =
  'z-50 w-60 overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95'
const optionCls =
  'flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground'

function PopContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align="start"
        sideOffset={6}
        className={cn(popCls, className)}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

function SearchBox({
  value,
  onChange,
  placeholder = 'Search',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="mb-1 flex items-center gap-2 border-b border-border px-2 pb-2">
      <Search className="size-3.5 shrink-0 text-muted-foreground" />
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}

function MemberAvatar({ m }: { m: WorkspaceMember }) {
  return (
    <Avatar className="size-5">
      <AvatarImage src={m.user.avatar_url ?? undefined} />
      <AvatarFallback className="text-[10px]">
        {m.user.display_name?.[0]?.toUpperCase() ?? '?'}
      </AvatarFallback>
    </Avatar>
  )
}

// --- State chip (project workflow states) ---------------------------------
function StateChip({
  states,
  value,
  onChange,
}: {
  states: State[]
  value: string
  onChange: (id: string) => void
}) {
  const current = states.find((s) => s.id === value)
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button type="button" className={cn(chipCls, 'text-foreground')}>
          <span
            className="size-3 rounded-full"
            style={{ background: current?.color ?? '#94a3b8' }}
          />
          {current?.name ?? 'State'}
        </button>
      </PopoverPrimitive.Trigger>
      <PopContent>
        {states.map((s) => (
          <PopoverPrimitive.Close asChild key={s.id}>
            <button
              type="button"
              onClick={() => onChange(s.id)}
              className={optionCls}
            >
              <span
                className="size-3 rounded-full"
                style={{ background: s.color }}
              />
              <span className="flex-1 text-left">{s.name}</span>
              {value === s.id && <Check className="size-3.5" />}
            </button>
          </PopoverPrimitive.Close>
        ))}
      </PopContent>
    </PopoverPrimitive.Root>
  )
}

// --- Priority chip ---------------------------------------------------------
function PriorityChip({
  value,
  onChange,
}: {
  value: IssuePriorityValue
  onChange: (v: IssuePriorityValue) => void
}) {
  const current = PRIORITY_CONFIG[value]
  const CurIcon = current.icon
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button type="button" className={cn(chipCls, 'text-foreground')}>
          <CurIcon size={13} className={current.iconColor} />
          {current.label}
        </button>
      </PopoverPrimitive.Trigger>
      <PopContent>
        {PRIORITIES.map((p) => {
          const meta = PRIORITY_CONFIG[p]
          const Icon = meta.icon
          return (
            <PopoverPrimitive.Close asChild key={p}>
              <button
                type="button"
                onClick={() => onChange(p)}
                className={optionCls}
              >
                <Icon size={15} className={meta.iconColor} />
                <span className="flex-1 text-left">{meta.label}</span>
                {value === p && <Check className="size-3.5" />}
              </button>
            </PopoverPrimitive.Close>
          )
        })}
      </PopContent>
    </PopoverPrimitive.Root>
  )
}

// --- Assignees chip (multi) ------------------------------------------------
function AssigneesChip({
  members,
  value,
  onChange,
}: {
  members: WorkspaceMember[]
  value: string[]
  onChange: (ids: string[]) => void
}) {
  const [q, setQ] = useState('')
  const filtered = members.filter((m) =>
    m.user.display_name.toLowerCase().includes(q.toLowerCase()),
  )
  function toggle(id: string) {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id],
    )
  }
  return (
    <PopoverPrimitive.Root onOpenChange={() => setQ('')}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(chipCls, value.length && 'text-foreground')}
        >
          <Users size={13} />
          {value.length ? `${value.length} Assignee(s)` : 'Assignees'}
        </button>
      </PopoverPrimitive.Trigger>
      <PopContent>
        <SearchBox value={q} onChange={setQ} placeholder="Search members..." />
        {filtered.length === 0 && (
          <p className="px-2 py-2 text-sm text-muted-foreground">No members.</p>
        )}
        {filtered.map((m) => (
          <button
            key={m.user_id}
            type="button"
            onClick={() => toggle(m.user_id)}
            className={optionCls}
          >
            <MemberAvatar m={m} />
            <span className="flex-1 text-left">{m.user.display_name}</span>
            {value.includes(m.user_id) && <Check className="size-3.5" />}
          </button>
        ))}
      </PopContent>
    </PopoverPrimitive.Root>
  )
}

// --- Due date chip ---------------------------------------------------------
function DueDateChip({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(chipCls, value && 'text-foreground')}
        >
          <CalendarRange size={13} />
          {value || 'Due date'}
        </button>
      </PopoverPrimitive.Trigger>
      <PopContent className="w-56 p-3">
        <label className="text-xs text-muted-foreground">
          Due date
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
          />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="mt-2 text-xs text-destructive hover:underline"
          >
            Clear
          </button>
        )}
      </PopContent>
    </PopoverPrimitive.Root>
  )
}

export function CreateIssueDialog({
  open,
  onOpenChange,
  slug,
  projectId,
  states,
  onCreated,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  slug: string
  projectId: string
  states: State[]
  onCreated: (issue: Issue) => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [stateId, setStateId] = useState('')
  const [priority, setPriority] = useState<IssuePriorityValue>('none')
  const [assigneeIds, setAssigneeIds] = useState<string[]>([])
  const [due, setDue] = useState('')
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [busy, setBusy] = useState(false)

  // Default the state to the project's default (or first) column each time the
  // dialog opens, and load members for the assignee picker.
  useEffect(() => {
    if (!open) return
    let cancelled = false
    ;(async () => {
      const fallback = states.find((s) => s.is_default) ?? states[0]
      setStateId((prev) => prev || fallback?.id || '')
      const list = await getWorkspaceMembers(slug).catch(() => [])
      if (!cancelled) setMembers(list)
    })()
    return () => {
      cancelled = true
    }
  }, [open, slug, states])

  function reset() {
    setTitle('')
    setDescription('')
    setStateId('')
    setPriority('none')
    setAssigneeIds([])
    setDue('')
  }

  async function submit() {
    if (!title.trim() || !stateId || busy) return
    setBusy(true)
    try {
      const issue = await createIssue(slug, projectId, {
        title: title.trim(),
        state_id: stateId,
        priority,
        description: description.trim() || undefined,
        assignee_ids: assigneeIds.length ? assigneeIds : undefined,
        due_date: due ? new Date(due).toISOString() : undefined,
      })
      toast.success('Work item created')
      onCreated(issue)
      reset()
      onOpenChange(false)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create work item',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset()
        onOpenChange(v)
      }}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create work item</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Input
            autoFocus
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit()
            }}
          />
          <Textarea
            placeholder="Description (optional)"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex flex-wrap gap-1.5">
            <StateChip states={states} value={stateId} onChange={setStateId} />
            <PriorityChip value={priority} onChange={setPriority} />
            <AssigneesChip
              members={members}
              value={assigneeIds}
              onChange={setAssigneeIds}
            />
            <DueDateChip value={due} onChange={setDue} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy || !title.trim() || !stateId}>
            {busy ? 'Creating…' : 'Create work item'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
