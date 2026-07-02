import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 text-center">
      <SearchX className="text-muted-foreground h-12 w-12" />
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">404 — Page not found</h1>
        <p className="text-muted-foreground text-sm">
          The page you're looking for doesn't exist or was moved.
        </p>
      </div>
      <Button asChild size="sm">
        <Link to="/">Go home</Link>
      </Button>
    </div>
  )
}
