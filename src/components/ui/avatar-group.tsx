import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface AvatarGroupItem {
  src?: string
  name: string
}

interface AvatarGroupProps {
  avatars: AvatarGroupItem[]
  max?: number
  size?: 'sm' | 'md'
  className?: string
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function AvatarGroup({
  avatars,
  max = 4,
  size = 'sm',
  className,
}: AvatarGroupProps) {
  const visible = avatars.slice(0, max)
  const overflow = avatars.length - max

  const sizeClass = size === 'sm' ? 'h-6 w-6 text-[10px]' : 'h-8 w-8 text-xs'

  return (
    <div className={cn('flex items-center', className)}>
      {visible.map((avatar, i) => (
        <Avatar
          key={i}
          className={cn(sizeClass, 'ring-2 ring-background', i > 0 && '-ml-2')}
          title={avatar.name}
        >
          {avatar.src && <AvatarImage src={avatar.src} alt={avatar.name} />}
          <AvatarFallback className="bg-primary/15 text-primary font-medium">
            {getInitials(avatar.name)}
          </AvatarFallback>
        </Avatar>
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full ring-2 ring-background bg-muted text-muted-foreground font-medium -ml-2',
            sizeClass,
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  )
}
