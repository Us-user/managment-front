import { cn } from '@/lib/utils'
import { PenSquare, Search, PanelLeftClose } from 'lucide-react'

const RECENT_CHATS = [
  'Understanding Drafts Visibility ...',
  'Starting A Conversation About ...',
]

export function AISidebarPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex w-[240px] shrink-0 flex-col border-r border-border bg-card',
        className,
      )}
    >
      {/* Header */}
      <div className="flex h-10 items-center justify-between border-b border-border px-3">
        <span className="text-sm font-semibold">Plane AI</span>
        <button className="rounded p-1 text-muted-foreground hover:bg-muted transition-colors">
          <PanelLeftClose size={13} />
        </button>
      </div>

      {/* New chat + search */}
      <div className="flex items-center gap-2 px-3 py-2">
        <button className="flex flex-1 items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
          <PenSquare size={13} />
          New chat
        </button>
        <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors">
          <Search size={14} />
        </button>
      </div>

      {/* Recents */}
      <div className="flex-1 overflow-y-auto px-3 pb-2">
        <p className="py-1 text-xs font-medium text-muted-foreground">
          Recents
        </p>
        <div className="mt-0.5 space-y-0.5">
          {RECENT_CHATS.map((chat) => (
            <button
              key={chat}
              className="w-full truncate rounded-md px-2 py-1.5 text-left text-sm text-foreground hover:bg-muted transition-colors"
            >
              {chat}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
