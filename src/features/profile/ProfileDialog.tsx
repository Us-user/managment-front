import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateMe } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'

export function ProfileDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const user = useAuthStore((s) => s.user)

  // ponytail: first/last name aren't in the API — seeded from display_name,
  // not persisted. Only display_name is saved. (Mounted per-open, so these
  // initializers reseed each time the dialog opens.)
  const parts = (user?.display_name ?? '').split(' ')
  const [first, setFirst] = useState(parts[0] ?? '')
  const [last, setLast] = useState(parts.slice(1).join(' '))
  const [displayName, setDisplayName] = useState(user?.display_name ?? '')
  const [busy, setBusy] = useState(false)
  const [imgOpen, setImgOpen] = useState(false)
  const [deactivateOpen, setDeactivateOpen] = useState(false)

  const initial = (displayName || user?.email || 'U')[0]?.toUpperCase()

  async function save() {
    if (!displayName.trim()) return
    setBusy(true)
    try {
      const updated = await updateMe({ display_name: displayName.trim() })
      useAuthStore.setState({ user: updated })
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-0 overflow-hidden p-0">
        {/* Cover */}
        <div className="relative h-32 bg-muted">
          <span className="absolute right-3 bottom-3 rounded border border-border bg-background/80 px-2 py-1 text-xs">
            Change cover
          </span>
          <button
            onClick={() => setImgOpen(true)}
            className="absolute -bottom-6 left-6 flex h-16 w-16 items-center justify-center rounded-md bg-purple-500 text-3xl font-bold text-white"
          >
            {initial}
          </button>
        </div>

        <div className="px-6 pb-6 pt-9">
          <p className="text-lg font-semibold">{user?.display_name}</p>
          <p className="mb-6 text-sm text-muted-foreground">{user?.email}</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="First name" required>
              <Input value={first} onChange={(e) => setFirst(e.target.value)} />
            </Field>
            <Field label="Last name">
              <Input value={last} onChange={(e) => setLast(e.target.value)} />
            </Field>
            <Field label="Display name" required>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </Field>
          </div>

          <div className="mt-4 max-w-sm">
            <Field label="Email" required>
              {/* Disabled — no change-email endpoint. */}
              <Input disabled value={user?.email ?? ''} />
            </Field>
            <button className="mt-1 text-xs text-foreground underline underline-offset-2 hover:text-primary">
              Change email
            </button>
          </div>

          <Button
            className="mt-5"
            onClick={save}
            disabled={busy || !displayName.trim()}
          >
            {busy ? 'Saving…' : 'Save changes'}
          </Button>

          {/* Deactivate */}
          <div className="mt-8 flex items-center justify-between gap-4 rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-semibold">Deactivate account</p>
              <p className="text-xs text-muted-foreground">
                When deactivating an account, all of the data and resources
                within that account will be permanently removed and cannot be
                recovered.
              </p>
            </div>
            <Button
              variant="outline"
              className="shrink-0 border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => setDeactivateOpen(true)}
            >
              Deactivate account
            </Button>
          </div>
        </div>
      </DialogContent>

      <ImageUploadDialog
        open={imgOpen}
        onOpenChange={setImgOpen}
        initial={initial}
      />

      <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <DialogContent className="max-w-md">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <Trash2 size={18} />
            </div>
            <div>
              <DialogTitle>Deactivate your account</DialogTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Once deactivated, you can't be assigned work items and be billed
                for your workspace. To reactivate your account, you will need an
                invite to a workspace at this email address.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              // ponytail: no deactivate endpoint yet — stub until the backend adds one.
              onClick={() => {
                toast.info('Account deactivation isn’t supported yet')
                setDeactivateOpen(false)
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-muted-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

// ponytail: mirrors the workspace logo dialog — no avatar-upload endpoint, so
// preview only, save is a stub.
function ImageUploadDialog({
  open,
  onOpenChange,
  initial,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial?: string
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
                toast.info('Avatar upload isn’t supported by the backend yet')
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
