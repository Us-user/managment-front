import { useState } from 'react'
import { CircleDot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge, PriorityBadge, type IssueStatus, type IssuePriority } from '@/components/ui/status-badge'
import { AvatarGroup } from '@/components/ui/avatar-group'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'

interface Issue {
  id: string
  title: string
  status: IssueStatus
  priority: IssuePriority
  assignees: { name: string }[]
  dueDate: string
}

const ISSUES: Issue[] = [
  {
    id: 'TASKM-1',
    title: 'Set up CI/CD pipeline',
    status: 'done',
    priority: 'high',
    assignees: [{ name: 'Abdulloh' }, { name: 'Amsurur' }],
    dueDate: 'Jun 28',
  },
  {
    id: 'TASKM-2',
    title: 'Design system tokens — colors & typography',
    status: 'done',
    priority: 'medium',
    assignees: [{ name: 'Homidov' }],
    dueDate: 'Jun 30',
  },
  {
    id: 'TASKM-3',
    title: 'Implement sidebar navigation',
    status: 'in-progress',
    priority: 'high',
    assignees: [{ name: 'Abdulloh' }, { name: 'Amsurur' }, { name: 'Homidov' }],
    dueDate: 'Jul 3',
  },
  {
    id: 'TASKM-4',
    title: 'Form primitives — RHF + Zod',
    status: 'in-progress',
    priority: 'medium',
    assignees: [{ name: 'Amsurur' }],
    dueDate: 'Jul 4',
  },
  {
    id: 'TASKM-5',
    title: 'Overlay components (Modal, Drawer, Confirm)',
    status: 'todo',
    priority: 'medium',
    assignees: [{ name: 'Homidov' }, { name: 'Abdulloh' }],
    dueDate: 'Jul 5',
  },
  {
    id: 'TASKM-6',
    title: 'Toast / feedback system',
    status: 'todo',
    priority: 'low',
    assignees: [{ name: 'Amsurur' }, { name: 'Homidov' }, { name: 'Abdulloh' }, { name: 'Dev D' }, { name: 'Dev E' }],
    dueDate: 'Jul 6',
  },
  {
    id: 'TASKM-7',
    title: 'Auth screens (login / register)',
    status: 'backlog',
    priority: 'urgent',
    assignees: [],
    dueDate: 'Jul 10',
  },
  {
    id: 'TASKM-8',
    title: 'Remove legacy CSS overrides',
    status: 'cancelled',
    priority: 'none',
    assignees: [{ name: 'Abdulloh' }],
    dueDate: '—',
  },
]

function TableSkeleton() {
  return (
    <div className="space-y-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-border px-4 py-3">
          <Skeleton className="h-4 w-16 shrink-0" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-5 w-20 rounded-full shrink-0" />
          <Skeleton className="h-5 w-16 rounded-full shrink-0" />
          <div className="flex -space-x-2 shrink-0">
            <Skeleton className="h-6 w-6 rounded-full ring-2 ring-background" />
            <Skeleton className="h-6 w-6 rounded-full ring-2 ring-background" />
          </div>
          <Skeleton className="h-4 w-12 shrink-0" />
        </div>
      ))}
    </div>
  )
}

export function DataDisplayDemoPage() {
  const [loading, setLoading] = useState(false)
  const [empty, setEmpty] = useState(false)

  const issues = empty ? [] : ISSUES

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground mb-1">B4.4 — Data display</h1>
        <p className="text-sm text-muted-foreground">
          Table, StatusBadge, PriorityBadge, AvatarGroup, EmptyState, Skeleton — issue list demo.
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setLoading(true)
            setTimeout(() => setLoading(false), 2000)
          }}
        >
          Simulate loading (2 s)
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEmpty(v => !v)}
        >
          {empty ? 'Show issues' : 'Show empty state'}
        </Button>
      </div>

      {/* Badge showcase */}
      <section className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Status &amp; Priority badges
        </p>
        <div className="flex flex-wrap gap-2">
          {(['backlog', 'todo', 'in-progress', 'done', 'cancelled'] as IssueStatus[]).map(s => (
            <StatusBadge key={s} status={s} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(['urgent', 'high', 'medium', 'low', 'none'] as IssuePriority[]).map(p => (
            <PriorityBadge key={p} priority={p} />
          ))}
        </div>
      </section>

      {/* AvatarGroup showcase */}
      <section className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          AvatarGroup
        </p>
        <div className="flex items-center gap-6">
          <AvatarGroup
            avatars={[{ name: 'Abdulloh' }, { name: 'Amsurur' }, { name: 'Homidov' }]}
            size="sm"
          />
          <AvatarGroup
            avatars={[
              { name: 'Abdulloh' },
              { name: 'Amsurur' },
              { name: 'Homidov' },
              { name: 'Dev D' },
              { name: 'Dev E' },
            ]}
            max={3}
            size="md"
          />
        </div>
      </section>

      {/* Issue list table */}
      <section className="space-y-2 rounded-lg border border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border">
          <p className="text-sm font-medium text-foreground">All issues</p>
          <span className="text-xs text-muted-foreground">{issues.length} items</span>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : issues.length === 0 ? (
          <EmptyState
            icon={CircleDot}
            title="No issues yet"
            description="Create your first issue to start tracking work."
            action={{ label: 'New issue', onClick: () => setEmpty(false) }}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-24">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-28">Priority</TableHead>
                <TableHead className="w-28">Assignees</TableHead>
                <TableHead className="w-20">Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map(issue => (
                <TableRow key={issue.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {issue.id}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{issue.title}</TableCell>
                  <TableCell>
                    <StatusBadge status={issue.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={issue.priority} />
                  </TableCell>
                  <TableCell>
                    {issue.assignees.length > 0 ? (
                      <AvatarGroup avatars={issue.assignees} max={3} size="sm" />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{issue.dueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      {/* Standalone skeleton showcase */}
      <section className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Skeleton loaders
        </p>
        <div className="space-y-2 max-w-sm">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
