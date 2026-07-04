import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { inviteExistingUser, type AssignableRole } from '@/api/workspace'
import { useWorkspaceStore } from '@/stores/workspaceStore'

export function AddMemberDialog({ onAdded }: { onAdded: () => void }) {
  const workspace = useWorkspaceStore((s) => s.workspace)
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<AssignableRole>('member')
  const [busy, setBusy] = useState(false)

  async function submit() {
    const trimmed = email.trim()
    if (!workspace || !trimmed) return
    setBusy(true)
    try {
      const { delivered_to } = await inviteExistingUser(workspace.slug, {
        email: trimmed,
        role,
      })
      const via = delivered_to.length ? ` via ${delivered_to.join(' & ')}` : ''
      toast.success(`Invitation sent to ${trimmed}${via}`, {
        description: 'It will appear in their invitations inbox.',
      })
      setEmail('')
      setRole('member')
      setOpen(false)
      onAdded()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to invite member',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <UserPlus size={14} /> Add member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
          <DialogDescription>
            Invite an existing user by email. They'll get the invitation in
            their in-app inbox (and by email or Telegram where available).
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              autoFocus
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit()
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-role">Role</Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as AssignableRole)}
            >
              <SelectTrigger id="invite-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy || !email.trim()}>
            {busy ? 'Sending…' : 'Send invite'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
