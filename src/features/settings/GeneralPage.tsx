import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { updateWorkspace, deleteWorkspace } from '@/api/workspace'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { useAuthStore } from '@/stores/authStore'

// Native timezone list — no lib needed.
const TIMEZONES = Intl.supportedValuesOf('timeZone')

export function GeneralPage() {
  const navigate = useNavigate()
  const workspace = useWorkspaceStore((s) => s.workspace)
  const workspaces = useWorkspaceStore((s) => s.workspaces)
  const setWorkspace = useWorkspaceStore((s) => s.setWorkspace)
  const setWorkspaces = useWorkspaceStore((s) => s.setWorkspaces)
  const reset = useWorkspaceStore((s) => s.reset)
  const userId = useAuthStore((s) => s.user?.id)

  const [name, setName] = useState(workspace?.name ?? '')
  // ponytail: backend has no timezone field — display-only. Default to the
  // browser's own zone instead of a hardcoded one.
  const [tz, setTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [busy, setBusy] = useState(false)
  const [logoOpen, setLogoOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const wsInitial = workspace?.name?.[0]?.toUpperCase() ?? 'W'

  // Only the owner may delete it. owner_id ships with the workspace, so this is
  // known immediately — no members fetch, button shows on first render.
  const isOwner = !!userId && workspace?.owner_id === userId

  async function remove() {
    if (!workspace) return
    try {
      await deleteWorkspace(workspace.slug)
      toast.success('Workspace deleted')
      const remaining = workspaces.filter((w) => w.id !== workspace.id)
      if (remaining.length > 0) {
        setWorkspaces(remaining)
        setWorkspace(remaining[0])
        navigate('/')
      } else {
        reset()
        navigate('/onboarding/workspace')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  async function save() {
    if (!workspace || !name.trim()) return
    setBusy(true)
    try {
      const updated = await updateWorkspace(workspace.slug, {
        name: name.trim(),
      })
      setWorkspace(updated)
      setWorkspaces(workspaces.map((w) => (w.id === updated.id ? updated : w)))
      toast.success('Workspace updated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="flex h-12 items-center gap-2 border-b border-border px-6 text-sm font-medium">
        <Building2 size={16} />
        General
      </div>

      <div className="max-w-3xl px-8 py-6">
        {/* Identity */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary text-2xl font-bold text-primary-foreground">
            {wsInitial}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold">{workspace?.name}</p>
            <p className="text-sm text-muted-foreground">
              app.plane.so/{workspace?.slug}
            </p>
            <button
              onClick={() => setLogoOpen(true)}
              className="text-sm text-primary hover:underline"
            >
              Upload logo
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">
              Workspace name
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">
              Workspace Timezone
            </label>
            <Select value={tz} onValueChange={setTz}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {TIMEZONES.map((z) => (
                  <SelectItem key={z} value={z}>
                    {z}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">
              Workspace URL
            </label>
            <Input disabled value={`app.plane.so/${workspace?.slug ?? ''}`} />
          </div>
        </div>

        <Button className="mt-6" onClick={save} disabled={busy || !name.trim()}>
          {busy ? 'Updating…' : 'Update workspace'}
        </Button>

        {/* Delete — owner only */}
        {isOwner && (
          <div className="mt-8 flex items-center justify-between gap-4 rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-semibold">Delete workspace</p>
              <p className="text-xs text-muted-foreground">
                When deleting a workspace, all of the data and resources within
                that workspace will be permanently removed and cannot be
                recovered.
              </p>
            </div>
            <Button
              variant="outline"
              className="shrink-0 border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => setConfirmOpen(true)}
            >
              Delete workspace
            </Button>
          </div>
        )}
      </div>

      <LogoDialog
        open={logoOpen}
        onOpenChange={setLogoOpen}
        initial={wsInitial}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete workspace?"
        description={`This permanently deletes “${workspace?.name}” and all its projects and work items. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={remove}
      />
    </div>
  )
}

// ponytail: no logo endpoint on the backend — modal is UI-only, save is a no-op
// toast until storage exists.
function LogoDialog({
  open,
  onOpenChange,
  initial,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial: string
}) {
  const [preview, setPreview] = useState<string | null>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>

        <label className="mx-auto flex aspect-square w-64 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-purple-500 text-7xl font-bold text-white">
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            initial
          )}
          <input
            type="file"
            accept=".jpeg,.jpg,.png,.webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) setPreview(URL.createObjectURL(f))
            }}
          />
        </label>

        <p className="text-xs text-muted-foreground">
          File formats supported- .jpeg, .jpg, .png, .webp
        </p>

        <DialogFooter className="sm:justify-between">
          <Button variant="destructive" onClick={() => setPreview(null)}>
            Remove
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              disabled={!preview}
              onClick={() => {
                toast.info('Logo upload isn’t supported by the backend yet')
                onOpenChange(false)
              }}
            >
              Upload &amp; Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
