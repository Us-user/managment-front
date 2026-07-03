import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Settings, Globe } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  getProject,
  updateProject,
  deleteProject,
  type Project,
} from '@/api/project'
import { useWorkspaceStore } from '@/stores/workspaceStore'

// ponytail: backend has no timezone field — display-only.
const TIMEZONES = Intl.supportedValuesOf('timeZone')

export function ProjectGeneralPage() {
  const navigate = useNavigate()
  const { projectId } = useParams()
  const workspace = useWorkspaceStore((s) => s.workspace)

  const [project, setProject] = useState<Project | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [network, setNetwork] = useState('public') // ponytail: mock, not in API
  const [tz, setTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [busy, setBusy] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!workspace || !projectId) return
      const p = await getProject(workspace.slug, projectId).catch(() => null)
      if (cancelled || !p) return
      setProject(p)
      setName(p.name)
      setDescription(p.description ?? '')
    })()
    return () => {
      cancelled = true
    }
  }, [workspace?.slug, projectId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function save() {
    if (!workspace || !projectId || !name.trim()) return
    setBusy(true)
    try {
      const updated = await updateProject(workspace.slug, projectId, {
        name: name.trim(),
        description: description.trim() || null,
      })
      setProject(updated)
      toast.success('Project updated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!workspace || !projectId) return
    try {
      await deleteProject(workspace.slug, projectId)
      toast.success('Project deleted')
      navigate('/projects-list')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  return (
    <div>
      <div className="flex h-12 items-center gap-2 border-b border-border px-6 text-sm font-medium">
        <Settings size={16} />
        General
      </div>

      <div className="max-w-3xl px-8 py-6">
        {/* Cover + identity */}
        <div className="relative mb-6 h-40 rounded-lg bg-gradient-to-r from-slate-700 via-rose-600 to-sky-700">
          <span className="absolute right-3 bottom-3 rounded bg-black/60 px-2 py-1 text-xs text-white">
            Change cover
          </span>
          <div className="absolute -bottom-4 left-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-amber-400 text-2xl">
              📊
            </div>
          </div>
        </div>
        <div className="mb-6 pl-1">
          <p className="text-lg font-semibold">{project?.name}</p>
          <p className="text-sm text-muted-foreground">
            {project?.identifier} ·{' '}
            {network === 'public' ? 'Public' : 'Private'}
          </p>
        </div>

        {/* Fields */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm text-muted-foreground">
            Project name
          </label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm text-muted-foreground">
            Description
          </label>
          <Textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">
              Project ID
            </label>
            <Input disabled value={project?.identifier ?? ''} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">
              Network
            </label>
            {/* ponytail: mock — network not in project API */}
            <Select value={network} onValueChange={setNetwork}>
              <SelectTrigger>
                <span className="flex items-center gap-2">
                  <Globe size={14} />
                  <SelectValue />
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">
              Project Timezone
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
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={save} disabled={busy || !name.trim()}>
            {busy ? 'Updating…' : 'Update project'}
          </Button>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            Delete project
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete project?"
        description="This permanently deletes the project and its work items."
        confirmLabel="Delete"
        onConfirm={remove}
      />
    </div>
  )
}
