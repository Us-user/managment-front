import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            'bg-popover text-popover-foreground border border-border shadow-md rounded-lg text-sm',
          title: 'font-medium',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
          error: 'border-destructive/40 bg-destructive/5 text-destructive',
          success: 'border-green-500/40 bg-green-500/5 text-green-700 dark:text-green-400',
          warning: 'border-yellow-500/40 bg-yellow-500/5 text-yellow-700 dark:text-yellow-400',
        },
      }}
    />
  )
}
