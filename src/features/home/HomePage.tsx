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

// ponytail: demo history — swagger has no workspace-wide activity/recent
// endpoint (only per-issue activity), so this stays mock like the chat above.
const HISTORY = [
  { id: 'TASKM-22', title: 'Notification by Telegramm', ago: 'about 22 hours ago', assignee: 'Y', assigneeColor: '#f59e0b' },
  { id: 'TASKM-11', title: 'A1.2 — Login page.', ago: '3 days ago', assignee: 'Y', assigneeColor: '#f59e0b' },
  { id: 'TASKM-10', title: 'Register with Google and github (addition telegram)', ago: '3 days ago', assignee: 'Y', assigneeColor: '#f59e0b' },
  { id: 'TASKM-12', title: 'A1.3 — Logout.', ago: '3 days ago', assignee: 'Y', assigneeColor: '#f59e0b' },
  { id: 'TASKM-13', title: 'A1.4 — Profile page.', ago: '3 days ago', assignee: 'Y', assigneeColor: '#f59e0b' },
  { id: 'TASKM-14', title: 'B0.1 — Design tokens + Tailwind theme.', ago: '2 days ago', assignee: 'A', assigneeColor: '#8b5cf6' },
  { id: 'TASKM-15', title: 'B0.2 — App shell + layout.', ago: '2 days ago', assignee: 'A', assigneeColor: '#8b5cf6' },
]

export function HomePage() {
  const user = useAuthStore((s) => s.user)

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

          {/* Ask Plane AI — demo */}
          <section className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                Ask Plane AI
              </h2>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Maximize2 size={14} />
              </button>
            </div>
            <div className="rounded-lg border border-border bg-sidebar p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">
                  A
                </div>
                <span className="text-sm font-medium text-foreground">
                  Alfa-Bots
                </span>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                How can I help you today?
              </p>
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
                  <button className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    <ArrowUp size={14} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* History — what we did */}
          <section>
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-foreground">History</h2>
            </div>
            <div className="space-y-2">
              {HISTORY.map((item) => (
                <div
                  key={item.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 hover:bg-muted transition-colors"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-indigo-500 text-[11px] font-bold text-white">
                    TM
                  </div>
                  <div className="flex flex-1 items-center gap-2 overflow-hidden">
                    <span className="shrink-0 text-xs font-medium text-muted-foreground">
                      {item.id}
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
          </section>
        </div>
      </div>
    </div>
  )
}
