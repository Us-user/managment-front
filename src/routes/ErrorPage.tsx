import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'
import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ErrorPage() {
  const error = useRouteError()

  let message = 'Something went wrong.'
  if (isRouteErrorResponse(error)) {
    message = error.statusText || String(error.status)
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 text-center">
      <TriangleAlert className="text-destructive h-12 w-12" />
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground max-w-sm text-sm">{message}</p>
      </div>
      <Button asChild size="sm" variant="outline">
        <Link to="/">Go home</Link>
      </Button>
    </div>
  )
}
