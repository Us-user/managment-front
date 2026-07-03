import { useState } from 'react'
import {
  Circle,
  Globe,
  CalendarRange,
  Ban,
  User,
  Users,
  Tag,
  Pin,
} from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createProject } from '@/api/project'
import { useWorkspaceStore } from '@/stores/workspaceStore'

const toIdent = (name: string) =>
  name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 10)

// ponytail: chips below are decorative — the API only stores name/identifier/
// description. Wire them when the backend grows those fields.
const CHIPS = [
  { icon: Circle, label: 'Draft' },
  { icon: Globe, label: 'Public' },
  { icon: CalendarRange, label: 'Start date → End date' },
  { icon: Ban, label: 'None' },
  { icon: User, label: 'Lead' },
  { icon: Users, label: 'Members' },
  { icon: Tag, label: 'Labels' },
]

export function AddProjectDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreated: () => void
}) {
  const workspace = useWorkspaceStore((s) => s.workspace)
  const [name, setName] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [description, setDescription] = useState('')
  const [busy, setBusy] = useState(false)

  function reset() {
    setName('')
    setIdentifier('')
    setDescription('')
  }

  async function create() {
    if (!workspace || !name.trim() || !identifier) return
    setBusy(true)
    try {
      await createProject(workspace.slug, {
        name: name.trim(),
        identifier,
        description: description.trim() || undefined,
      })
      toast.success('Project created')
      reset()
      onOpenChange(false)
      onCreated()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create project',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-0 overflow-hidden p-0">
        {/* Cover */}
        <div className="relative h-32 bg-gradient-to-r from-amber-200 via-rose-300 to-sky-300">
          <span className="absolute right-3 bottom-3 rounded bg-black/60 px-2 py-1 text-xs text-white">
            Change cover
          </span>
          <div className="absolute -bottom-5 left-4 flex h-11 w-11 items-center justify-center rounded-md bg-rose-500 text-white">
            <Pin size={18} />
          </div>
        </div>

        <div className="flex flex-col gap-3 px-4 pt-8 pb-4">
          <div className="grid grid-cols-[1fr_140px] gap-3">
            <Input
              autoFocus
              placeholder="Project name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setIdentifier(toIdent(e.target.value))
              }}
            />
            <Input
              placeholder="Project ID"
              value={identifier}
              onChange={(e) => setIdentifier(toIdent(e.target.value))}
            />
          </div>

          <Textarea
            placeholder="Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            {CHIPS.map((c) => (
              <span
                key={c.label}
                className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground"
              >
                <c.icon size={13} />
                {c.label}
              </span>
            ))}
          </div>
        </div>

        <DialogFooter className="border-t border-border px-4 py-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={create}
            disabled={busy || !name.trim() || !identifier}
          >
            {busy ? 'Creating…' : 'Create project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
