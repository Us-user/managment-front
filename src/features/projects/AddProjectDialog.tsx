import { useEffect, useState, type ReactNode } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import {
  CalendarRange,
  Check,
  Globe,
  Lock,
  Pin,
  Plus,
  Search,
  Tag,
  User,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  PRIORITY_CONFIG,
  type IssuePriority,
} from '@/components/ui/status-badge'
import { createProject } from '@/api/project'
import { getWorkspaceMembers, type WorkspaceMember } from '@/api/workspace'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { cn } from '@/lib/utils'

const toIdent = (name: string) =>
  name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 10)

// ponytail: only `lead_id` is persisted — the create-project swagger body
// accepts just name/identifier/description/lead_id. State, priority,
// visibility, dates, members and labels below are interactive UI kept in
// local state; wire them once the backend grows those fields.
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
  children: ReactNode
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

// --- State (local, decorative) --------------------------------------------
const STATES = [
  { value: 'draft', label: 'Draft', color: '#94a3b8' },
  { value: 'planning', label: 'Planning', color: '#6b7280' },
  { value: 'execution', label: 'Execution', color: '#f59e0b' },
  { value: 'monitoring', label: 'Monitoring', color: '#14b8a6' },
  { value: 'completed', label: 'Completed', color: '#22c55e' },
  { value: 'cancelled', label: 'Cancelled', color: '#ef4444' },
]

function StateChip({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [q, setQ] = useState('')
  const current = STATES.find((s) => s.value === value) ?? STATES[0]
  const filtered = STATES.filter((s) =>
    s.label.toLowerCase().includes(q.toLowerCase()),
  )
  return (
    <PopoverPrimitive.Root onOpenChange={() => setQ('')}>
      <PopoverPrimitive.Trigger asChild>
        <button type="button" className={cn(chipCls, 'text-foreground')}>
          <span
            className="size-3.5 rounded-sm"
            style={{ background: current.color }}
          />
          {current.label}
        </button>
      </PopoverPrimitive.Trigger>
      <PopContent>
        <SearchBox value={q} onChange={setQ} />
        {filtered.map((s) => (
          <PopoverPrimitive.Close asChild key={s.value}>
            <button
              type="button"
              onClick={() => onChange(s.value)}
              className={optionCls}
            >
              <span
                className="size-3.5 rounded-sm"
                style={{ background: s.color }}
              />
              <span className="flex-1 text-left">{s.label}</span>
              {value === s.value && <Check className="size-3.5" />}
            </button>
          </PopoverPrimitive.Close>
        ))}
      </PopContent>
    </PopoverPrimitive.Root>
  )
}

// --- Visibility (local) ----------------------------------------------------
const VISIBILITY = [
  { value: 'private', label: 'Private', desc: 'Accessible only by invite', icon: Lock },
  {
    value: 'public',
    label: 'Public',
    desc: 'Anyone in the workspace can join',
    icon: Globe,
  },
] as const

function VisibilityChip({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const current = VISIBILITY.find((v) => v.value === value) ?? VISIBILITY[1]
  const Icon = current.icon
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button type="button" className={cn(chipCls, 'text-foreground')}>
          <Icon size={13} />
          {current.label}
        </button>
      </PopoverPrimitive.Trigger>
      <PopContent>
        {VISIBILITY.map((v) => (
          <PopoverPrimitive.Close asChild key={v.value}>
            <button
              type="button"
              onClick={() => onChange(v.value)}
              className={cn(optionCls, 'items-start')}
            >
              <v.icon size={15} className="mt-0.5 shrink-0" />
              <span className="flex-1 text-left">
                <span className="block">{v.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {v.desc}
                </span>
              </span>
              {value === v.value && <Check className="mt-0.5 size-3.5" />}
            </button>
          </PopoverPrimitive.Close>
        ))}
      </PopContent>
    </PopoverPrimitive.Root>
  )
}

// --- Date range (native inputs) -------------------------------------------
function DateChip({
  start,
  end,
  onChange,
}: {
  start: string
  end: string
  onChange: (start: string, end: string) => void
}) {
  const active = start || end
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button type="button" className={cn(chipCls, active && 'text-foreground')}>
          <CalendarRange size={13} />
          {active ? `${start || '…'} → ${end || '…'}` : 'Start date → End date'}
        </button>
      </PopoverPrimitive.Trigger>
      <PopContent className="w-64 p-3">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-muted-foreground">
            Start date
            <input
              type="date"
              value={start}
              max={end || undefined}
              onChange={(e) => onChange(e.target.value, end)}
              className="mt-1 h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
          </label>
          <label className="text-xs text-muted-foreground">
            End date
            <input
              type="date"
              value={end}
              min={start || undefined}
              onChange={(e) => onChange(start, e.target.value)}
              className="mt-1 h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
          </label>
        </div>
      </PopContent>
    </PopoverPrimitive.Root>
  )
}

// --- Priority (local) ------------------------------------------------------
const PRIORITIES: IssuePriority[] = ['urgent', 'high', 'medium', 'low', 'none']

function PriorityChip({
  value,
  onChange,
}: {
  value: IssuePriority
  onChange: (v: IssuePriority) => void
}) {
  const [q, setQ] = useState('')
  const current = PRIORITY_CONFIG[value]
  const CurIcon = current.icon
  const filtered = PRIORITIES.filter((p) =>
    PRIORITY_CONFIG[p].label.toLowerCase().includes(q.toLowerCase()),
  )
  return (
    <PopoverPrimitive.Root onOpenChange={() => setQ('')}>
      <PopoverPrimitive.Trigger asChild>
        <button type="button" className={cn(chipCls, 'text-foreground')}>
          <CurIcon size={13} className={current.iconColor} />
          {current.label}
        </button>
      </PopoverPrimitive.Trigger>
      <PopContent>
        <SearchBox value={q} onChange={setQ} />
        {filtered.map((p) => {
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

// --- Lead (single, persisted as lead_id) ----------------------------------
function LeadChip({
  members,
  value,
  onChange,
}: {
  members: WorkspaceMember[]
  value: WorkspaceMember | null
  onChange: (m: WorkspaceMember | null) => void
}) {
  const [q, setQ] = useState('')
  const filtered = members.filter((m) =>
    m.user.display_name.toLowerCase().includes(q.toLowerCase()),
  )
  return (
    <PopoverPrimitive.Root onOpenChange={() => setQ('')}>
      <PopoverPrimitive.Trigger asChild>
        <button type="button" className={cn(chipCls, value && 'text-foreground')}>
          {value ? <MemberAvatar m={value} /> : <User size={13} />}
          {value ? value.user.display_name : 'Lead'}
        </button>
      </PopoverPrimitive.Trigger>
      <PopContent>
        <SearchBox value={q} onChange={setQ} placeholder="Search members..." />
        {filtered.length === 0 && (
          <p className="px-2 py-2 text-sm text-muted-foreground">No members.</p>
        )}
        {filtered.map((m) => (
          <PopoverPrimitive.Close asChild key={m.user_id}>
            <button
              type="button"
              onClick={() =>
                onChange(value?.user_id === m.user_id ? null : m)
              }
              className={optionCls}
            >
              <MemberAvatar m={m} />
              <span className="flex-1 text-left">{m.user.display_name}</span>
              {value?.user_id === m.user_id && <Check className="size-3.5" />}
            </button>
          </PopoverPrimitive.Close>
        ))}
      </PopContent>
    </PopoverPrimitive.Root>
  )
}

// --- Members (multi, local) ------------------------------------------------
function MembersChip({
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
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])
  }
  return (
    <PopoverPrimitive.Root onOpenChange={() => setQ('')}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(chipCls, value.length && 'text-foreground')}
        >
          <Users size={13} />
          {value.length ? `${value.length} Members` : 'Members'}
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

// --- Labels (local) --------------------------------------------------------
function LabelsChip({
  value,
  onChange,
}: {
  value: string[]
  onChange: (labels: string[]) => void
}) {
  const [q, setQ] = useState('')
  const filtered = value.filter((l) =>
    l.toLowerCase().includes(q.toLowerCase()),
  )
  function add() {
    const name = q.trim()
    if (name && !value.includes(name)) onChange([...value, name])
    setQ('')
  }
  return (
    <PopoverPrimitive.Root onOpenChange={() => setQ('')}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(chipCls, value.length && 'text-foreground')}
        >
          <Tag size={13} />
          {value.length ? `${value.length} Labels` : 'Labels'}
        </button>
      </PopoverPrimitive.Trigger>
      <PopContent>
        <SearchBox value={q} onChange={setQ} />
        {filtered.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => onChange(value.filter((v) => v !== l))}
            className={optionCls}
          >
            <Tag size={14} className="text-lime-500" />
            <span className="flex-1 text-left">{l}</span>
            <Check className="size-3.5" />
          </button>
        ))}
        {q.trim() && !value.includes(q.trim()) && (
          <button
            type="button"
            onClick={add}
            className={cn(optionCls, 'border-t border-border')}
          >
            <Plus size={14} />
            Create new label “{q.trim()}”
          </button>
        )}
      </PopContent>
    </PopoverPrimitive.Root>
  )
}

export function AddProjectDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreated: () => void
}) {
  const workspace = useWorkspaceStore((s) => s.workspace)
  const [name, setName] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [description, setDescription] = useState('')
  const [busy, setBusy] = useState(false)

  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [state, setState] = useState('draft')
  const [visibility, setVisibility] = useState('public')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [priority, setPriority] = useState<IssuePriority>('none')
  const [lead, setLead] = useState<WorkspaceMember | null>(null)
  const [memberIds, setMemberIds] = useState<string[]>([])
  const [labels, setLabels] = useState<string[]>([])

  useEffect(() => {
    if (!open || !workspace) return
    getWorkspaceMembers(workspace.slug)
      .then(setMembers)
      .catch(() => setMembers([]))
  }, [open, workspace])

  function reset() {
    setName('')
    setIdentifier('')
    setDescription('')
    setState('draft')
    setVisibility('public')
    setStartDate('')
    setEndDate('')
    setPriority('none')
    setLead(null)
    setMemberIds([])
    setLabels([])
  }

  async function create() {
    if (!workspace || !name.trim() || !identifier) return
    setBusy(true)
    try {
      await createProject(workspace.slug, {
        name: name.trim(),
        identifier,
        description: description.trim() || undefined,
        lead_id: lead?.user_id ?? undefined,
      })
      toast.success('Project created')
      reset()
      onOpenChange(false)
      onCreated()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create project',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-0 overflow-hidden p-0">
        {/* Cover */}
        <div className="relative h-32 bg-gradient-to-r from-amber-200 via-rose-300 to-sky-300">
          <span className="absolute right-3 bottom-3 rounded bg-black/60 px-2 py-1 text-xs text-white">
            Change cover
          </span>
          <div className="absolute -bottom-5 left-4 flex h-11 w-11 items-center justify-center rounded-md bg-rose-500 text-white">
            <Pin size={18} />
          </div>
        </div>

        <div className="flex flex-col gap-3 px-4 pt-8 pb-4">
          <div className="grid grid-cols-[1fr_140px] gap-3">
            <Input
              autoFocus
              placeholder="Project name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setIdentifier(toIdent(e.target.value))
              }}
            />
            <Input
              placeholder="Project ID"
              value={identifier}
              onChange={(e) => setIdentifier(toIdent(e.target.value))}
            />
          </div>

          <Textarea
            placeholder="Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex flex-nowrap gap-1.5">
            <StateChip value={state} onChange={setState} />
            <VisibilityChip value={visibility} onChange={setVisibility} />
            <DateChip
              start={startDate}
              end={endDate}
              onChange={(s, e) => {
                setStartDate(s)
                setEndDate(e)
              }}
            />
            <PriorityChip value={priority} onChange={setPriority} />
            <LeadChip members={members} value={lead} onChange={setLead} />
            <MembersChip
              members={members}
              value={memberIds}
              onChange={setMemberIds}
            />
            <LabelsChip value={labels} onChange={setLabels} />
          </div>
        </div>

        <DialogFooter className="border-t border-border px-4 py-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={create}
            disabled={busy || !name.trim() || !identifier}
          >
            {busy ? 'Creating…' : 'Create project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
