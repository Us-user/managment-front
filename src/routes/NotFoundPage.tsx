import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col justify-center gap-8 bg-background px-4">
      {/* Circle with 404 */}
      <div className="relative mx-auto flex h-72 w-72 flex-shrink-0 items-start justify-center rounded-full bg-muted border border-border">
        <span className="mt-10 text-xs font-bold tracking-[0.35em] text-foreground uppercase">
          ERROR
        </span>
        <span className="absolute bottom-0 translate-y-1/4 select-none text-[9rem] leading-none font-bold text-muted-foreground">
          404
        </span>
      </div>

      {/* Text */}
      <div className="mx-auto w-full max-w-md space-y-2 text-center">
        <p className="text-base font-bold text-foreground">Oops! Something went wrong.</p>
        <p className="text-sm text-muted-foreground">
          Sorry, the page you are looking for cannot be found. It may have been removed, had its
          name changed, or is temporarily unavailable.
        </p>
      </div>

      {/* Button */}
      <div className="flex justify-center">
        <Button asChild>
          <Link to="/">Go to Home</Link>
        </Button>
      </div>
    </div>
  )
}
