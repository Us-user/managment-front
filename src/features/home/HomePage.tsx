import { useEffect, useState } from 'react'
import {
  Home,
  Maximize2,
  Plus,
  Mic,
  ArrowUp,
  PencilLine,
  Settings2,
  CircleDot,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { getProjects } from '@/api/project'
import { getIssues } from '@/api/issue'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDateTime() {
  return new Date().toLocaleString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

// ponytail: naive relative time — good enough for a "x ago" label.
function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `about ${hrs} hour${hrs === 1 ? '' : 's'} ago`
  const days = Math.round(hrs / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

const PALETTE = ['#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#3b82f6']
const colorFor = (s: string) =>
  PALETTE[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length]

interface HistoryItem {
  key: string
  code: string
  short: string
  title: string
  ago: string
  assignee: string
  assigneeColor: string
}

export function HomePage() {
  const user = useAuthStore((s) => s.user)
  const workspace = useWorkspaceStore((s) => s.workspace)

  const [message, setMessage] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  const wsName = workspace?.name ?? 'Workspace'
  const wsInitial = wsName[0]?.toUpperCase() ?? 'W'

  // History = the work items we've been doing, newest first. No workspace-wide
  // endpoint exists, so fan out across projects and merge.
  // ponytail: N+1 (one issues call per project) — fine for small workspaces; a
  // workspace-level activity endpoint would replace this.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      if (!workspace) return
      const projects = await getProjects(workspace.slug).catch(() => [])
      const perProject = await Promise.all(
        projects.map((p) =>
          getIssues(workspace.slug, p.id, {
            sort_by: 'updated_at',
            order: 'desc',
            limit: 5,
          })
            .then((r) => r.data.map((iss) => ({ iss, ident: p.identifier })))
            .catch(() => []),
        ),
      )
      const items: HistoryItem[] = perProject
        .flat()
        .sort(
          (a, b) =>
            new Date(b.iss.updated_at).getTime() -
            new Date(a.iss.updated_at).getTime(),
        )
        .slice(0, 8)
        .map(({ iss, ident }) => {
          const name = iss.assignees[0]?.user?.display_name ?? ''
          return {
            key: iss.id,
            code: `${ident}-${iss.sequence_id}`,
            short: ident.slice(0, 2).toUpperCase(),
            title: iss.title,
            ago: timeAgo(iss.updated_at),
            assignee: name[0]?.toUpperCase() ?? '?',
            assigneeColor: colorFor(iss.assignees[0]?.user_id ?? iss.id),
          }
        })
      if (!cancelled) setHistory(items)
    })().finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [workspace?.slug]) // eslint-disable-line react-hooks/exhaustive-deps

  // ponytail: demo chat — no AI backend, so sending just clears the box.
  function send() {
    if (!message.trim()) return
    setMessage('')
  }

  return (
    <div className="flex h-full flex-col">
      {/* Page top bar */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Home size={14} />
          <span>Home</span>
        </div>
        <button className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors">
          <Settings2 size={13} />
          Manage widgets
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-10">
          {/* Greeting */}
          <div className="mb-8 text-center">
            <h1 className="mb-1 text-2xl font-bold text-foreground">
              {getGreeting()}, {user?.display_name ?? 'there'}
            </h1>
            <p className="text-sm font-medium text-primary">
              ☁️ {formatDateTime()}
            </p>
          </div>

          {/* Ask AI — demo */}
          <section className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                Ask {wsName} AI
              </h2>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Maximize2 size={14} />
              </button>
            </div>
            <div className="rounded-lg border border-border bg-sidebar p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">
                  {wsInitial}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {wsName}
                </span>
              </div>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                placeholder="How can I help you today?"
                className="mb-4 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-3">
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <Plus size={16} />
                  </button>
                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <PencilLine size={13} />
                    <span>Build</span>
                    <span className="text-xs text-muted-foreground">⌄</span>
                  </button>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <Settings2 size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <Mic size={15} />
                  </button>
                  <button
                    onClick={send}
                    disabled={!message.trim()}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40"
                  >
                    <ArrowUp size={14} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* History — what we've been doing */}
          <section>
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-foreground">History</h2>
            </div>

            {loading ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Loading…
              </p>
            ) : history.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nothing here yet — work items you touch will show up.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  {history.map((item) => (
                    <div
                      key={item.key}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 hover:bg-muted transition-colors"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-indigo-500 text-[11px] font-bold text-white">
                        {item.short}
                      </div>
                      <div className="flex flex-1 items-center gap-2 overflow-hidden">
                        <span className="shrink-0 text-xs font-medium text-muted-foreground">
                          {item.code}
                        </span>
                        <span className="truncate text-sm text-foreground">
                          {item.title}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {item.ago}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <CircleDot size={14} />
                        </button>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <Settings2 size={14} />
                        </button>
                        <div
                          className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                          style={{ backgroundColor: item.assigneeColor }}
                        >
                          {item.assignee}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ponytail: demo link — no workspace-wide work-items page to route to yet */}
                <div className="mt-4 text-center">
                  <button className="text-sm font-medium text-primary hover:underline">
                    See all
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
