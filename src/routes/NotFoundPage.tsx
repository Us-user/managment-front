import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-[#1a1a1a] px-4">
      {/* Circle with 404 */}
      <div className="relative flex h-72 w-72 items-start justify-center rounded-full bg-[#f0f0f0]">
        <span className="mt-10 text-xs font-bold tracking-[0.35em] text-black uppercase">
          ERROR
        </span>
        <span className="absolute bottom-0 translate-y-1/4 text-[9rem] leading-none font-bold text-[#8a9099] select-none">
          404
        </span>
      </div>

      {/* Text */}
      <div className="w-full max-w-md space-y-2 text-center">
        <p className="text-base font-bold text-white">Oops! Something went wrong.</p>
        <p className="text-sm text-[#9ca3af]">
          Sorry, the page you are looking for cannot be found. It may have been removed, had its
          name changed, or is temporarily unavailable.
        </p>
      </div>

      {/* Button */}
      <Button asChild className="bg-[#2d2d2d] text-white hover:bg-[#3a3a3a] border-0">
        <Link to="/">Go to Home</Link>
      </Button>
    </div>
  )
}
