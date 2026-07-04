import { useEffect, useState } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import {
  Trash2,
  Check,
  Search,
  Plus,
  CalendarRange,
  UserPlus,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AvatarGroup } from '@/components/ui/avatar-group'
import { PRIORITY_CONFIG } from '@/components/ui/status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import {
  updateIssue,
  deleteIssue,
  addAssignee,
  removeAssignee,
  addLabel,
  removeLabel,
  type Issue,
  type IssuePriorityValue,
} from '@/api/issue'
import type { State } from '@/api/state'
import type { Project } from '@/api/project'
import { getLabels, type Label } from '@/api/label'
import {
  getComments,
  createComment,
  deleteComment,
  type Comment,
} from '@/api/comment'
import { getActivity, type Activity } from '@/api/activity'
import { getWorkspaceMembers, type WorkspaceMember } from '@/api/workspace'

const PRIORITIES: IssuePriorityValue[] = [
  'urgent',
  'high',
  'medium',
  'low',
  'none',
]

const popCls =
  'z-50 w-56 overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95'
const optionCls =
  'flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground'

const errMsg = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

function initial(name?: string) {
  return name?.[0]?.toUpperCase() ?? '?'
}

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
        align="end"
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

function PropRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <span className="mt-1 w-20 shrink-0 text-xs text-muted-foreground">
        {label}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

const triggerCls =
  'flex w-full items-center gap-2 rounded-md border border-transparent px-2 py-1.5 text-sm text-foreground transition-colors hover:border-border hover:bg-accent'

export function IssueDetailPanel({
  issue,
  project,
  slug,
  projectId,
  states,
  onOpenChange,
  onUpdated,
  onDeleted,
}: {
  issue: Issue | null
  project: Project | null
  slug: string
  projectId: string
  states: State[]
  onOpenChange: (open: boolean) => void
  onUpdated: (issue: Issue) => void
  onDeleted: (issueId: string) => void
}) {
  const currentUserId = useAuthStore((s) => s.user?.id)

  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [labels, setLabels] = useState<Label[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [activity, setActivity] = useState<Activity[]>([])
  const [feedLoading, setFeedLoading] = useState(true)

  const [titleDraft, setTitleDraft] = useState('')
  const [descDraft, setDescDraft] = useState('')
  const [newComment, setNewComment] = useState('')

  const issueId = issue?.id

  // (Re)load everything whenever a different issue is opened.
  useEffect(() => {
    if (!issueId || !issue) return
    let cancelled = false
    ;(async () => {
      setTitleDraft(issue.title)
      setDescDraft(issue.description ?? '')
      setFeedLoading(true)
      const [cs, act, mem, lbl] = await Promise.all([
        getComments(slug, projectId, issueId).catch(() => []),
        getActivity(slug, projectId, issueId).catch(() => ({
          data: [],
          next_cursor: null,
        })),
        getWorkspaceMembers(slug).catch(() => []),
        getLabels(slug, projectId).catch(() => []),
      ])
      if (cancelled) return
      setComments(cs)
      setActivity(act.data)
      setMembers(mem)
      setLabels(lbl)
      setFeedLoading(false)
    })()
    return () => {
      cancelled = true
    }
    // Only re-run when the opened issue changes, not on every prop update.
  }, [issueId, slug, projectId]) // eslint-disable-line react-hooks/exhaustive-deps

  const memberName = (id: string | null) =>
    members.find((m) => m.user_id === id)?.user.display_name ?? 'someone'
  const labelName = (id: string | null) =>
    labels.find((l) => l.id === id)?.name ?? 'a label'
  const stateName = (id: string | null) =>
    states.find((s) => s.id === id)?.name ?? '—'

  async function refreshActivity() {
    if (!issueId) return
    const act = await getActivity(slug, projectId, issueId).catch(() => null)
    if (act) setActivity(act.data)
  }

  // Any issue mutation funnels through here: push the fresh issue to the board
  // and refresh the activity trail.
  async function apply(promise: Promise<Issue>, failMsg: string) {
    try {
      const updated = await promise
      onUpdated(updated)
      refreshActivity()
    } catch (err) {
      toast.error(errMsg(err, failMsg))
    }
  }

  if (!issue) {
    return (
      <Sheet open={false} onOpenChange={onOpenChange}>
        <SheetContent />
      </Sheet>
    )
  }

  const identifier = project
    ? `${project.identifier}-${issue.sequence_id}`
    : `#${issue.sequence_id}`
  const currentState = states.find((s) => s.id === issue.state_id)
  const priorityMeta = PRIORITY_CONFIG[issue.priority]
  const PriorityIcon = priorityMeta.icon
  const assignedIds = issue.assignees.map((a) => a.user_id)
  const attachedLabelIds = issue.labels.map((l) => l.label_id)

  function saveTitle() {
    const value = titleDraft.trim()
    if (!value || value === issue!.title) {
      setTitleDraft(issue!.title)
      return
    }
    apply(
      updateIssue(slug, projectId, issue!.id, { title: value }),
      'Could not rename work item',
    )
  }

  function saveDesc() {
    const value = descDraft.trim()
    if (value === (issue!.description ?? '')) return
    apply(
      updateIssue(slug, projectId, issue!.id, { description: value || null }),
      'Could not update description',
    )
  }

  async function handleDelete() {
    try {
      await deleteIssue(slug, projectId, issue!.id)
      toast.success('Work item deleted')
      onDeleted(issue!.id)
    } catch (err) {
      toast.error(errMsg(err, 'Could not delete work item'))
    }
  }

  async function addNewComment() {
    const value = newComment.trim()
    if (!value || !issueId) return
    try {
      const created = await createComment(slug, projectId, issueId, value)
      setComments((prev) => [...prev, created])
      setNewComment('')
      refreshActivity()
    } catch (err) {
      toast.error(errMsg(err, 'Could not post comment'))
    }
  }

  async function removeComment(commentId: string) {
    if (!issueId) return
    const snapshot = comments
    setComments((prev) => prev.filter((c) => c.id !== commentId))
    try {
      await deleteComment(slug, projectId, issueId, commentId)
    } catch (err) {
      setComments(snapshot)
      toast.error(errMsg(err, 'Could not delete comment'))
    }
  }

  function describeActivity(a: Activity): string {
    switch (a.action) {
      case 'issue.created':
        return 'created the work item'
      case 'issue.deleted':
        return 'deleted the work item'
      case 'issue.assignee_added':
        return `assigned ${memberName(a.new_value)}`
      case 'issue.assignee_removed':
        return `unassigned ${memberName(a.old_value)}`
      case 'issue.label_added':
        return `added label ${labelName(a.new_value)}`
      case 'issue.label_removed':
        return `removed label ${labelName(a.old_value)}`
      case 'comment.created':
        return 'added a comment'
      case 'comment.updated':
        return 'edited a comment'
      case 'comment.deleted':
        return 'deleted a comment'
      case 'issue.updated':
        switch (a.field) {
          case 'state_id':
            return `set state to ${stateName(a.new_value)}`
          case 'priority':
            return `set priority to ${a.new_value ?? 'none'}`
          case 'title':
            return 'renamed the work item'
          case 'description':
            return 'updated the description'
          case 'due_date':
            return a.new_value ? 'set the due date' : 'cleared the due date'
          case 'start_date':
            return a.new_value ? 'set the start date' : 'cleared the start date'
          case 'estimate_points':
            return 'updated the estimate'
          default:
            return `updated ${a.field ?? 'the work item'}`
        }
      default:
        return a.action.replace(/[._]/g, ' ')
    }
  }

  const dueValue = issue.due_date ? issue.due_date.slice(0, 10) : ''

  return (
    <Sheet open onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full max-w-full flex-col gap-0 p-0 sm:max-w-3xl">
        {/* Header */}
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border pl-4 pr-12">
          <span className="font-mono text-xs text-muted-foreground">
            {identifier}
          </span>
          <span
            className="ml-1 flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs"
            style={{
              background: `${currentState?.color ?? '#94a3b8'}22`,
              color: currentState?.color ?? undefined,
            }}
          >
            <span
              className="size-2 rounded-full"
              style={{ background: currentState?.color ?? '#94a3b8' }}
            />
            {currentState?.name ?? '—'}
          </span>
          <button
            onClick={handleDelete}
            className="ml-auto rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            title="Delete work item"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <SheetTitle className="sr-only">{issue.title}</SheetTitle>
        <SheetDescription className="sr-only">
          Work item details for {identifier}
        </SheetDescription>

        {/* Body: main + properties */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
          {/* Main column */}
          <div className="flex min-w-0 flex-1 flex-col md:overflow-y-auto">
            <div className="border-b border-border p-4">
              <Textarea
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    e.currentTarget.blur()
                  }
                }}
                rows={1}
                className="min-h-0 resize-none border-none bg-transparent p-0 text-lg font-semibold shadow-none focus-visible:ring-0"
                placeholder="Work item title"
              />

              <Textarea
                value={descDraft}
                onChange={(e) => setDescDraft(e.target.value)}
                onBlur={saveDesc}
                rows={3}
                className="mt-2 border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                placeholder="Add a description…"
              />
            </div>

            {/* Comments + activity, in separate tabs */}
            <div className="flex-1 p-4">
              <Tabs defaultValue="comments">
                <TabsList>
                  <TabsTrigger value="comments">
                    Comments{comments.length > 0 ? ` ${comments.length}` : ''}
                  </TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                {/* Comments tab */}
                <TabsContent value="comments" className="mt-4">
                  {/* Composer */}
                  <div className="mb-5 flex flex-col gap-2">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey))
                          addNewComment()
                      }}
                      rows={2}
                      placeholder="Leave a comment…"
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={addNewComment}
                        disabled={!newComment.trim()}
                      >
                        Comment
                      </Button>
                    </div>
                  </div>

                  {feedLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-3/4" />
                    </div>
                  ) : comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No comments yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((c) => (
                        <div key={c.id} className="group flex gap-2.5">
                          <Avatar className="size-7 shrink-0">
                            <AvatarImage
                              src={c.author?.avatar_url ?? undefined}
                            />
                            <AvatarFallback className="text-[11px]">
                              {initial(c.author?.display_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">
                                {c.author?.display_name ?? 'User'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {timeAgo(c.created_at)}
                              </span>
                              {c.author_id === currentUserId && (
                                <button
                                  onClick={() => removeComment(c.id)}
                                  className="ml-auto rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                                  title="Delete comment"
                                >
                                  <X size={13} />
                                </button>
                              )}
                            </div>
                            <p className="mt-0.5 whitespace-pre-wrap rounded-md bg-muted/50 px-3 py-2 text-sm text-foreground">
                              {c.body}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Activity tab */}
                <TabsContent value="activity" className="mt-4">
                  {feedLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-2/3" />
                    </div>
                  ) : activity.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No activity yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {activity.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center gap-2.5 text-xs text-muted-foreground"
                        >
                          <Avatar className="size-5 shrink-0">
                            <AvatarImage
                              src={a.actor?.avatar_url ?? undefined}
                            />
                            <AvatarFallback className="text-[9px]">
                              {initial(a.actor?.display_name)}
                            </AvatarFallback>
                          </Avatar>
                          <span>
                            <span className="font-medium text-foreground">
                              {a.actor?.display_name ?? 'Someone'}
                            </span>{' '}
                            {describeActivity(a)}
                          </span>
                          <span className="ml-auto shrink-0">
                            {timeAgo(a.created_at)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Properties sidebar */}
          <div className="shrink-0 border-t border-border p-4 md:w-64 md:overflow-y-auto md:border-l md:border-t-0">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Properties
            </h3>

            {/* State */}
            <PropRow label="State">
              <PopoverPrimitive.Root>
                <PopoverPrimitive.Trigger asChild>
                  <button className={triggerCls}>
                    <span
                      className="size-3 shrink-0 rounded-full"
                      style={{ background: currentState?.color ?? '#94a3b8' }}
                    />
                    <span className="flex-1 truncate text-left">
                      {currentState?.name ?? 'Select state'}
                    </span>
                  </button>
                </PopoverPrimitive.Trigger>
                <PopContent>
                  {states.map((s) => (
                    <PopoverPrimitive.Close asChild key={s.id}>
                      <button
                        className={optionCls}
                        onClick={() =>
                          s.id !== issue.state_id &&
                          apply(
                            updateIssue(slug, projectId, issue.id, {
                              state_id: s.id,
                            }),
                            'Could not change state',
                          )
                        }
                      >
                        <span
                          className="size-3 rounded-full"
                          style={{ background: s.color }}
                        />
                        <span className="flex-1 text-left">{s.name}</span>
                        {s.id === issue.state_id && (
                          <Check className="size-3.5" />
                        )}
                      </button>
                    </PopoverPrimitive.Close>
                  ))}
                </PopContent>
              </PopoverPrimitive.Root>
            </PropRow>

            {/* Priority */}
            <PropRow label="Priority">
              <PopoverPrimitive.Root>
                <PopoverPrimitive.Trigger asChild>
                  <button className={triggerCls}>
                    <PriorityIcon
                      size={15}
                      className={cn('shrink-0', priorityMeta.iconColor)}
                    />
                    <span className="flex-1 text-left">
                      {priorityMeta.label}
                    </span>
                  </button>
                </PopoverPrimitive.Trigger>
                <PopContent>
                  {PRIORITIES.map((p) => {
                    const meta = PRIORITY_CONFIG[p]
                    const Icon = meta.icon
                    return (
                      <PopoverPrimitive.Close asChild key={p}>
                        <button
                          className={optionCls}
                          onClick={() =>
                            p !== issue.priority &&
                            apply(
                              updateIssue(slug, projectId, issue.id, {
                                priority: p,
                              }),
                              'Could not change priority',
                            )
                          }
                        >
                          <Icon size={15} className={meta.iconColor} />
                          <span className="flex-1 text-left">{meta.label}</span>
                          {p === issue.priority && (
                            <Check className="size-3.5" />
                          )}
                        </button>
                      </PopoverPrimitive.Close>
                    )
                  })}
                </PopContent>
              </PopoverPrimitive.Root>
            </PropRow>

            {/* Assignees */}
            <PropRow label="Assignees">
              <PopoverPrimitive.Root>
                <PopoverPrimitive.Trigger asChild>
                  <button className={triggerCls}>
                    {issue.assignees.length ? (
                      <>
                        <AvatarGroup
                          avatars={issue.assignees.map((a) => ({
                            src: a.user?.avatar_url ?? undefined,
                            name: a.user?.display_name ?? '?',
                          }))}
                          max={4}
                        />
                        <span className="flex-1 truncate text-left text-xs text-muted-foreground">
                          {issue.assignees.length} assigned
                        </span>
                      </>
                    ) : (
                      <>
                        <UserPlus
                          size={15}
                          className="shrink-0 text-muted-foreground"
                        />
                        <span className="flex-1 text-left text-muted-foreground">
                          Unassigned
                        </span>
                      </>
                    )}
                  </button>
                </PopoverPrimitive.Trigger>
                <PopContent>
                  <MemberPicker
                    members={members}
                    selectedIds={assignedIds}
                    onToggle={(userId, selected) =>
                      apply(
                        selected
                          ? removeAssignee(slug, projectId, issue.id, userId)
                          : addAssignee(slug, projectId, issue.id, userId),
                        'Could not update assignees',
                      )
                    }
                  />
                </PopContent>
              </PopoverPrimitive.Root>
            </PropRow>

            {/* Labels */}
            <PropRow label="Labels">
              <div className="space-y-1.5">
                {issue.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {issue.labels.map((l) => (
                      <span
                        key={l.label_id}
                        className="flex items-center gap-1 rounded-full border border-border px-1.5 py-0.5 text-[11px] text-foreground"
                      >
                        <span
                          className="size-2 rounded-full"
                          style={{ background: l.label?.color }}
                        />
                        {l.label?.name}
                        <button
                          onClick={() =>
                            apply(
                              removeLabel(
                                slug,
                                projectId,
                                issue.id,
                                l.label_id,
                              ),
                              'Could not remove label',
                            )
                          }
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <PopoverPrimitive.Root>
                  <PopoverPrimitive.Trigger asChild>
                    <button className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent">
                      <Plus size={13} /> Add label
                    </button>
                  </PopoverPrimitive.Trigger>
                  <PopContent>
                    <LabelPicker
                      labels={labels}
                      selectedIds={attachedLabelIds}
                      onToggle={(labelId, selected) =>
                        apply(
                          selected
                            ? removeLabel(slug, projectId, issue.id, labelId)
                            : addLabel(slug, projectId, issue.id, labelId),
                          'Could not update labels',
                        )
                      }
                    />
                  </PopContent>
                </PopoverPrimitive.Root>
              </div>
            </PropRow>

            {/* Due date */}
            <PropRow label="Due date">
              <PopoverPrimitive.Root>
                <PopoverPrimitive.Trigger asChild>
                  <button className={triggerCls}>
                    <CalendarRange
                      size={15}
                      className="shrink-0 text-muted-foreground"
                    />
                    <span
                      className={cn(
                        'flex-1 text-left',
                        !dueValue && 'text-muted-foreground',
                      )}
                    >
                      {dueValue || 'No due date'}
                    </span>
                  </button>
                </PopoverPrimitive.Trigger>
                <PopContent className="w-56 p-3">
                  <input
                    type="date"
                    value={dueValue}
                    onChange={(e) =>
                      apply(
                        updateIssue(slug, projectId, issue.id, {
                          due_date: e.target.value
                            ? new Date(e.target.value).toISOString()
                            : null,
                        }),
                        'Could not set due date',
                      )
                    }
                    className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                  />
                  {dueValue && (
                    <button
                      onClick={() =>
                        apply(
                          updateIssue(slug, projectId, issue.id, {
                            due_date: null,
                          }),
                          'Could not clear due date',
                        )
                      }
                      className="mt-2 text-xs text-destructive hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </PopContent>
              </PopoverPrimitive.Root>
            </PropRow>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function MemberPicker({
  members,
  selectedIds,
  onToggle,
}: {
  members: WorkspaceMember[]
  selectedIds: string[]
  onToggle: (userId: string, alreadySelected: boolean) => void
}) {
  const [q, setQ] = useState('')
  const filtered = members.filter((m) =>
    m.user.display_name.toLowerCase().includes(q.toLowerCase()),
  )
  return (
    <>
      <SearchBox value={q} onChange={setQ} placeholder="Search members…" />
      {filtered.length === 0 && (
        <p className="px-2 py-2 text-sm text-muted-foreground">No members.</p>
      )}
      {filtered.map((m) => {
        const selected = selectedIds.includes(m.user_id)
        return (
          <button
            key={m.user_id}
            className={optionCls}
            onClick={() => onToggle(m.user_id, selected)}
          >
            <Avatar className="size-5">
              <AvatarImage src={m.user.avatar_url ?? undefined} />
              <AvatarFallback className="text-[10px]">
                {initial(m.user.display_name)}
              </AvatarFallback>
            </Avatar>
            <span className="flex-1 text-left">{m.user.display_name}</span>
            {selected && <Check className="size-3.5" />}
          </button>
        )
      })}
    </>
  )
}

function LabelPicker({
  labels,
  selectedIds,
  onToggle,
}: {
  labels: Label[]
  selectedIds: string[]
  onToggle: (labelId: string, alreadySelected: boolean) => void
}) {
  const [q, setQ] = useState('')
  const filtered = labels.filter((l) =>
    l.name.toLowerCase().includes(q.toLowerCase()),
  )
  return (
    <>
      <SearchBox value={q} onChange={setQ} placeholder="Search labels…" />
      {labels.length === 0 && (
        <p className="px-2 py-2 text-sm text-muted-foreground">
          No labels in this project.
        </p>
      )}
      {filtered.map((l) => {
        const selected = selectedIds.includes(l.id)
        return (
          <button
            key={l.id}
            className={optionCls}
            onClick={() => onToggle(l.id, selected)}
          >
            <span
              className="size-3 rounded-full"
              style={{ background: l.color }}
            />
            <span className="flex-1 text-left">{l.name}</span>
            {selected && <Check className="size-3.5" />}
          </button>
        )
      })}
    </>
  )
}
