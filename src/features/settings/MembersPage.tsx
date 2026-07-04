import { useEffect, useState } from 'react'
import {
  Users,
  Search,
  ChevronDown,
  Upload,
  MoreHorizontal,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { useAuthStore } from '@/stores/authStore'
import {
  getWorkspaceMembers,
  changeMemberRole,
  removeMember,
  type WorkspaceMember,
  type AssignableRole,
} from '@/api/workspace'
import { AddMemberDialog } from './AddMemberDialog'

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const joined = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : '—'

// Per-row change-role / remove menu. Only rendered for rows the current user is
// allowed to manage (see MembersPage below), so it doesn't guard permissions itself.
function MemberRowActions({
  member,
  onChanged,
}: {
  member: WorkspaceMember
  onChanged: () => void
}) {
  const workspace = useWorkspaceStore((s) => s.workspace)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  async function setRole(role: AssignableRole) {
    if (!workspace || role === member.role || busy) return
    setBusy(true)
    try {
      await changeMemberRole(workspace.slug, member.user_id, role)
      toast.success(`${member.user.display_name} is now ${role}`)
      onChanged()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to change role')
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!workspace) return
    setBusy(true)
    try {
      await removeMember(workspace.slug, member.user_id)
      toast.success(`Removed ${member.user.display_name}`)
      onChanged()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to remove member',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={busy}
          >
            <MoreHorizontal size={16} />
            <span className="sr-only">Member actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Change role</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={member.role}
            onValueChange={(v) => setRole(v as AssignableRole)}
          >
            <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="member">Member</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="guest">Guest</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 size={14} className="mr-2" />
            Remove from workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Remove ${member.user.display_name}?`}
        description="They will lose access to this workspace. This can't be undone, but you can invite them again."
        confirmLabel="Remove"
        onConfirm={remove}
      />
    </>
  )
}

export function MembersPage() {
  const workspace = useWorkspaceStore((s) => s.workspace)
  const currentUserId = useAuthStore((s) => s.user?.id)
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [query, setQuery] = useState('')

  async function load() {
    if (!workspace) return
    const list = await getWorkspaceMembers(workspace.slug).catch(() => [])
    setMembers(list)
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!workspace) return
      const list = await getWorkspaceMembers(workspace.slug).catch(() => [])
      if (!cancelled) setMembers(list)
    })()
    return () => {
      cancelled = true
    }
  }, [workspace?.slug]) // eslint-disable-line react-hooks/exhaustive-deps

  // Only owners/admins can manage members (the backend enforces it too).
  const myRole = members.find((m) => m.user_id === currentUserId)?.role
  const canManage = myRole === 'owner' || myRole === 'admin'

  const rows = members.filter((m) => {
    const q = query.toLowerCase()
    return (
      m.user.display_name.toLowerCase().includes(q) ||
      m.user.email.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      {/* Top bar */}
      <div className="flex h-12 items-center gap-2 border-b border-border px-6 text-sm font-medium">
        <Users size={16} />
        Members
      </div>

      <div className="px-8 py-6">
        {/* Heading + actions */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            Members
            <span className="rounded-full bg-muted px-2 py-0.5 text-sm font-medium text-muted-foreground">
              {members.length}
            </span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="h-9 w-56 pl-8"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              Filters <ChevronDown size={14} />
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Upload size={14} /> Import
            </Button>
            <AddMemberDialog onAdded={load} />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full name</TableHead>
                <TableHead>Display name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Billing Status</TableHead>
                <TableHead>Authentication</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((m) => {
                // Owner and self can't be managed (backend rejects both).
                const manageable =
                  canManage && m.role !== 'owner' && m.user_id !== currentUserId
                return (
                  <TableRow key={m.user_id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
                            {m.user.display_name[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {m.user.display_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {m.user.display_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {m.user.email}
                    </TableCell>
                    <TableCell>{cap(m.role)}</TableCell>
                    <TableCell className="text-green-600">Active</TableCell>
                    <TableCell className="text-muted-foreground">—</TableCell>
                    <TableCell className="text-muted-foreground">
                      {joined(m.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      {manageable && (
                        <MemberRowActions member={m} onChanged={load} />
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-muted-foreground"
                  >
                    No members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
