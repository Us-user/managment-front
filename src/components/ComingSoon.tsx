import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ComingSoonProps {
  icon: LucideIcon
  title: string
  subtitle: string
}

export function ComingSoon({ icon: Icon, title, subtitle }: ComingSoonProps) {
  return (
    <div className="flex h-full min-h-[calc(100vh-48px)] flex-col justify-center gap-4 px-4 text-center">
      <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-nav-active-bg">
        <Icon size={28} className="text-primary" strokeWidth={1.5} />
      </div>
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      <div className="flex justify-center">
        <Badge variant="secondary">Coming soon</Badge>
      </div>
      <p className="mx-auto w-full max-w-xs text-sm text-muted-foreground">
        {subtitle}
      </p>
      <p className="mx-auto w-full max-w-xs text-xs text-muted-foreground opacity-60">
        This feature is currently in development.
      </p>
    </div>
  )
}
