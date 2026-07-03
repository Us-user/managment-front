import { useEffect, useState } from 'react'
import { Users, Search, ChevronDown, Upload } from 'lucide-react'
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
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { getWorkspaceMembers, type WorkspaceMember } from '@/api/workspace'
import { AddMemberDialog } from './AddMemberDialog'

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const joined = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : '—'

export function MembersPage() {
  const workspace = useWorkspaceStore((s) => s.workspace)
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((m) => (
                <TableRow key={m.user_id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
                          {m.user.display_name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{m.user.display_name}</span>
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
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
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
