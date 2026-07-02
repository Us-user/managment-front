import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createWorkspace } from '@/api/workspace'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)
}

export function CreateWorkspacePage() {
  const navigate = useNavigate()
  const token = useAuthStore(s => s.token)
  const setWorkspace = useAuthStore(s => s.setWorkspace)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)

  function handleNameChange(value: string) {
    setName(value)
    setSlug(toSlug(value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    setLoading(true)
    try {
      const workspace = await createWorkspace(name, slug, token)
      setWorkspace(workspace)
      navigate('/onboarding/members')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create workspace')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Create your workspace</h1>
          <p className="mt-1 text-base text-muted-foreground">All your work — unified.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-foreground">
              Name your workspace <span className="text-red-500">*</span>
            </label>
            <Input
              required
              placeholder="Enter workspace name"
              value={name}
              onChange={e => handleNameChange(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-foreground">
              Set your workspace's URL <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center overflow-hidden rounded-md border border-border focus-within:ring-1 focus-within:ring-ring">
              <span className="shrink-0 border-r border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
                app.plane.so/
              </span>
              <input
                required
                minLength={2}
                maxLength={50}
                placeholder="Type or paste a URL"
                value={slug}
                onChange={e =>
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                }
                className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <p className="text-xs text-muted-foreground">You can only edit the slug of the URL</p>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !name || !slug}>
            {loading ? 'Creating…' : 'Continue'}
          </Button>
        </form>
      </div>
    </div>
  )
}
