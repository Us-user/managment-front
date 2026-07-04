import { useState } from 'react'
import { Plus, MoreHorizontal, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AvatarGroup } from '@/components/ui/avatar-group'
import { PRIORITY_CONFIG } from '@/components/ui/status-badge'
import type { State } from '@/api/state'
import type { Issue } from '@/api/issue'
import type { Project } from '@/api/project'
import { InlineComposer } from './InlineComposer'

interface ListViewProps {
  states: State[]
  issues: Issue[]
  project: Project | null
  onCreate: (stateId: string, title: string) => void
  onOpen: (issue: Issue) => void
  onDelete: (issue: Issue) => void
}

function IssueRow({
  issue,
  project,
  onOpen,
  onDelete,
}: {
  issue: Issue
  project: Project | null
  onOpen: () => void
  onDelete: () => void
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
    <div
      onClick={onOpen}
      className="group flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted/60"
    >
      <PIcon size={14} className={meta.iconColor} />
      <span className="w-20 shrink-0 font-mono text-xs text-muted-foreground">
        {identifier}
      </span>
      <span className="flex-1 truncate text-sm text-foreground">
        {issue.title}
      </span>
      {assignees.length > 0 && <AvatarGroup avatars={assignees} max={3} />}
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
          <DropdownMenuItem className="text-destructive" onClick={onDelete}>
            <Trash2 size={14} className="mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function ListView({
  states,
  issues,
  project,
  onCreate,
  onOpen,
  onDelete,
}: ListViewProps) {
  const [composerFor, setComposerFor] = useState<string | null>(null)

  return (
    <div className="h-full overflow-y-auto">
      {states.map((state) => {
        const groupIssues = issues.filter((i) => i.state_id === state.id)
        return (
          <section key={state.id} className="border-b border-border">
            {/* Group header */}
            <div className="flex items-center gap-2 bg-muted/40 px-4 py-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: state.color }}
              />
              <span className="text-sm font-medium text-foreground">
                {state.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {groupIssues.length}
              </span>
              <button
                type="button"
                onClick={() => setComposerFor(state.id)}
                className="ml-auto rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                title="Add work item"
              >
                <Plus size={15} />
              </button>
            </div>

            {/* Rows */}
            <div className="px-1 py-1">
              {groupIssues.map((issue) => (
                <IssueRow
                  key={issue.id}
                  issue={issue}
                  project={project}
                  onOpen={() => onOpen(issue)}
                  onDelete={() => onDelete(issue)}
                />
              ))}

              {composerFor === state.id && (
                <div className="px-2 py-1.5">
                  <InlineComposer
                    placeholder="What needs to be done?"
                    onCreate={(title) => onCreate(state.id, title)}
                    onClose={() => setComposerFor(null)}
                  />
                </div>
              )}

              {groupIssues.length === 0 && composerFor !== state.id && (
                <button
                  type="button"
                  onClick={() => setComposerFor(state.id)}
                  className="flex w-full items-center gap-1.5 px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Plus size={13} /> New work item
                </button>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
