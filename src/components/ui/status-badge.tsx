import { cn } from '@/lib/utils'

export type IssueStatus = 'backlog' | 'todo' | 'in-progress' | 'done' | 'cancelled'
export type IssuePriority = 'urgent' | 'high' | 'medium' | 'low' | 'none'

const STATUS_CONFIG: Record<IssueStatus, { label: string; className: string }> = {
  backlog: {
    label: 'Backlog',
    className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  },
  todo: {
    label: 'Todo',
    className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  },
  done: {
    label: 'Done',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
  },
}

const PRIORITY_CONFIG: Record<IssuePriority, { label: string; className: string }> = {
  urgent: {
    label: 'Urgent',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  },
  high: {
    label: 'High',
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  },
  medium: {
    label: 'Medium',
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  },
  low: {
    label: 'Low',
    className: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  },
  none: {
    label: 'None',
    className: 'bg-muted text-muted-foreground',
  },
}

interface StatusBadgeProps {
  status: IssueStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, className: colorClass } = STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        colorClass,
        className,
      )}
    >
      {label}
    </span>
  )
}

interface PriorityBadgeProps {
  priority: IssuePriority
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const { label, className: colorClass } = PRIORITY_CONFIG[priority]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        colorClass,
        className,
      )}
    >
      {label}
    </span>
  )
}
