import { useEffect, useState } from 'react'
import { Mail, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import {
  getMyInvites,
  acceptInvite,
  declineInvite,
  type InviteInboxItem,
} from '@/api/invites'

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

function expiryLabel(iso: string) {
  const ms = new Date(iso).getTime() - Date.now()
  if (ms <= 0) return 'Expired'
  const days = Math.ceil(ms / (24 * 60 * 60 * 1000))
  if (days === 1) return 'Expires today'
  return `Expires in ${days} days`
}

export function WorkspaceInvitesPage() {
  const addWorkspace = useWorkspaceStore((s) => s.addWorkspace)
  const [invites, setInvites] = useState<InviteInboxItem[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const list = await getMyInvites().catch(() => [])
      if (!cancelled) {
        setInvites(list)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function accept(item: InviteInboxItem) {
    setBusyId(item.id)
    try {
      await acceptInvite(item.id)
      addWorkspace(item.workspace)
      toast.success(`You joined ${item.workspace.name}`)
      setInvites((list) => list.filter((i) => i.id !== item.id))
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to accept invite',
      )
    } finally {
      setBusyId(null)
    }
  }

  async function decline(item: InviteInboxItem) {
    setBusyId(item.id)
    try {
      await declineInvite(item.id)
      toast.success(`Declined invitation to ${item.workspace.name}`)
      setInvites((list) => list.filter((i) => i.id !== item.id))
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to decline invite',
      )
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      {/* Top bar */}
      <div className="flex h-12 items-center gap-2 border-b border-border px-6 text-sm font-medium">
        <Mail size={16} />
        Invitations
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Workspace invitations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Invitations to join other workspaces. Accepting one adds it to your
            workspace switcher.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[0, 1].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : invites.length === 0 ? (
          <EmptyState
            icon={Mail}
            title="No pending invitations"
            description="When someone invites you to their workspace, it'll show up here."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {invites.map((item) => {
              const busy = busyId === item.id
              return (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-4"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                      {item.workspace.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-foreground">
                        {item.workspace.name}
                      </p>
                      <Badge variant="secondary">{cap(item.role)}</Badge>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      Invited by {item.inviter.display_name} ·{' '}
                      {expiryLabel(item.expires_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      disabled={busy}
                      onClick={() => decline(item)}
                    >
                      <X size={14} /> Decline
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1.5"
                      disabled={busy}
                      onClick={() => accept(item)}
                    >
                      <Check size={14} /> {busy ? 'Joining…' : 'Accept'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
