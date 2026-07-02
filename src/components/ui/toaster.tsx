import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      richColors
      toastOptions={{
        classNames: {
          toast: 'shadow-md rounded-lg text-sm font-sans',
          title: 'font-medium',
          description: 'text-[0.8rem] opacity-80',
        },
      }}
    />
  )
}
