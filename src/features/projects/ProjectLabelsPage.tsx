import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Tag, Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import {
  getLabels,
  createLabel,
  updateLabel,
  deleteLabel,
  type Label,
} from '@/api/label'

const errMsg = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback

// A tidy default palette; a native colour input covers anything else.
const PALETTE = [
  '#6366f1',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#64748b',
]

function ColorPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (color: string) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      {PALETTE.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={cn(
            'size-5 rounded-full ring-offset-2 ring-offset-background transition-transform hover:scale-110',
            value.toLowerCase() === c.toLowerCase() && 'ring-2 ring-ring',
          )}
          style={{ background: c }}
          aria-label={`Use ${c}`}
        />
      ))}
      <label
        className="relative size-5 shrink-0 cursor-pointer rounded-full border border-border"
        style={{ background: value }}
        title="Custom colour"
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
    </div>
  )
}

function LabelRow({
  label,
  onSave,
  onDelete,
}: {
  label: Label
  onSave: (data: { name: string; color: string }) => Promise<void>
  onDelete: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(label.name)
  const [color, setColor] = useState(label.color)
  const [busy, setBusy] = useState(false)

  function start() {
    setName(label.name)
    setColor(label.color)
    setEditing(true)
  }

  async function save() {
    if (!name.trim() || busy) return
    setBusy(true)
    try {
      await onSave({ name: name.trim(), color })
      setEditing(false)
    } finally {
      setBusy(false)
    }
  }

  if (editing) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-md border border-border px-3 py-2">
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save()
            if (e.key === 'Escape') setEditing(false)
          }}
          className="h-8 w-56"
        />
        <ColorPicker value={color} onChange={setColor} />
        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" onClick={save} disabled={busy || !name.trim()}>
            <Check size={14} /> Save
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
            <X size={14} />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex items-center gap-3 rounded-md border border-border px-3 py-2">
      <span
        className="size-3 shrink-0 rounded-full"
        style={{ background: label.color }}
      />
      <span className="flex-1 truncate text-sm text-foreground">
        {label.name}
      </span>
      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={start}
          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          title="Edit"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export function ProjectLabelsPage() {
  const { projectId } = useParams()
  const workspace = useWorkspaceStore((s) => s.workspace)
  const slug = workspace?.slug

  const [labels, setLabels] = useState<Label[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(PALETTE[0])
  const [creating, setCreating] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Label | null>(null)

  useEffect(() => {
    if (!slug || !projectId) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const list = await getLabels(slug, projectId).catch(() => [])
      if (!cancelled) {
        setLabels(list)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug, projectId])

  async function create() {
    if (!slug || !projectId || !newName.trim() || creating) return
    setCreating(true)
    try {
      const label = await createLabel(slug, projectId, {
        name: newName.trim(),
        color: newColor,
      })
      setLabels((prev) => [...prev, label])
      setNewName('')
      setNewColor(PALETTE[0])
      toast.success('Label created')
    } catch (err) {
      toast.error(errMsg(err, 'Could not create label'))
    } finally {
      setCreating(false)
    }
  }

  async function save(id: string, data: { name: string; color: string }) {
    if (!slug || !projectId) return
    try {
      const updated = await updateLabel(slug, projectId, id, data)
      setLabels((prev) => prev.map((l) => (l.id === id ? updated : l)))
      toast.success('Label updated')
    } catch (err) {
      toast.error(errMsg(err, 'Could not update label'))
      throw err
    }
  }

  async function remove(label: Label) {
    if (!slug || !projectId) return
    try {
      await deleteLabel(slug, projectId, label.id)
      setLabels((prev) => prev.filter((l) => l.id !== label.id))
      toast.success('Label deleted')
    } catch (err) {
      toast.error(errMsg(err, 'Could not delete label'))
    }
  }

  return (
    <div>
      <div className="flex h-12 items-center gap-2 border-b border-border px-6 text-sm font-medium">
        <Tag size={16} />
        Labels
      </div>

      <div className="max-w-3xl px-8 py-6">
        {/* Create */}
        <div className="mb-6 rounded-lg border border-border p-4">
          <p className="mb-3 text-sm font-medium">Create a new label</p>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Label name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') create()
              }}
              className="h-9 w-56"
            />
            <ColorPicker value={newColor} onChange={setNewColor} />
            <Button
              onClick={create}
              disabled={creating || !newName.trim()}
              className="ml-auto"
            >
              <Plus size={15} />
              {creating ? 'Adding…' : 'Add label'}
            </Button>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        ) : labels.length === 0 ? (
          <EmptyState
            icon={Tag}
            title="No labels yet"
            description="Create labels to categorise work items in this project."
          />
        ) : (
          <div className="space-y-2">
            {labels.map((label) => (
              <LabelRow
                key={label.id}
                label={label}
                onSave={(data) => save(label.id, data)}
                onDelete={() => setDeleteTarget(label)}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete label?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" will be removed from all work items it's attached to.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && remove(deleteTarget)}
      />
    </div>
  )
}
