import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LayoutGrid, BookOpen, Sparkles, Settings } from 'lucide-react'

const RAIL_NAV = [
  { label: 'Projects', icon: LayoutGrid, to: '/', matchPaths: ['/', '/drafts', '/your-work', '/stickies', '/notifications', '/projects'] },
  { label: 'Wiki', icon: BookOpen, to: '/wiki', matchPaths: ['/wiki'] },
  { label: 'AI', icon: Sparkles, to: '/ai', matchPaths: ['/ai'] },
]

export function SidebarRail({ className }: { className?: string }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  function isActive(matchPaths: string[]) {
    return matchPaths.some(p =>
      p === '/' ? pathname === '/' : pathname.startsWith(p),
    )
  }

  return (
    <div className={cn('flex w-14 shrink-0 flex-col items-center border-r border-border bg-white py-2 gap-0.5', className)}>
      {RAIL_NAV.map(item => {
        const active = isActive(item.matchPaths)
        return (
          <button
            key={item.label}
            onClick={() => navigate(item.to)}
            className={cn(
              'flex w-full flex-col items-center gap-0.5 px-1 py-2 transition-colors rounded-md mx-1',
              active
                ? 'text-[#3f76ff]'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <item.icon size={17} />
            <span className="text-[9px] font-medium">{item.label}</span>
          </button>
        )
      })}

      <div className="my-1 w-8 border-t border-border" />

      <button
        onClick={() => navigate('/settings')}
        className={cn(
          'flex w-full flex-col items-center gap-0.5 px-1 py-2 transition-colors rounded-md mx-1',
          pathname.startsWith('/settings')
            ? 'text-[#3f76ff]'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <Settings size={17} />
        <span className="text-[9px] font-medium">Settings</span>
      </button>
    </div>
  )
}
