import { cn } from '@/lib/utils'
import { LayoutGrid, BookOpen, Sparkles, Settings } from 'lucide-react'

const RAIL_NAV = [
  { label: 'Projects', icon: LayoutGrid },
  { label: 'Wiki', icon: BookOpen },
  { label: 'AI', icon: Sparkles },
]

export function SidebarRail({ className }: { className?: string }) {
  return (
    <div className={cn('flex w-14 shrink-0 flex-col items-center bg-[#18181b] py-2 gap-0.5', className)}>
      {RAIL_NAV.map((item, i) => (
        <button
          key={item.label}
          className={cn(
            'flex w-full flex-col items-center gap-0.5 px-1 py-2 transition-colors',
            i === 0 ? 'text-white' : 'text-[#71717a] hover:text-[#a1a1aa]',
          )}
        >
          <item.icon size={17} />
          <span className="text-[9px] font-medium">{item.label}</span>
        </button>
      ))}

      <div className="my-1 w-8 border-t border-[#3f3f46]" />

      <button className="flex w-full flex-col items-center gap-0.5 px-1 py-2 text-[#71717a] hover:text-[#a1a1aa] transition-colors">
        <Settings size={17} />
        <span className="text-[9px] font-medium">Settings</span>
      </button>
    </div>
  )
}
