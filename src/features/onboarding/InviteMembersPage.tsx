import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { inviteMember } from '@/api/workspace'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

type Role = 'member' | 'admin' | 'guest'

interface MemberRow {
  email: string
  role: Role | ''
}

export function InviteMembersPage() {
  const navigate = useNavigate()
  const token = useAuthStore(s => s.token)
  const workspace = useAuthStore(s => s.workspace)

  const [rows, setRows] = useState<MemberRow[]>([
    { email: '', role: '' },
    { email: '', role: '' },
    { email: '', role: '' },
  ])
  const [loading, setLoading] = useState(false)

  function addRow() {
    setRows(prev => [...prev, { email: '', role: '' }])
  }

  function updateRow(i: number, field: keyof MemberRow, value: string) {
    setRows(prev => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)))
  }

  async function handleContinue() {
    if (!token || !workspace) return
    const filled = rows.filter(r => r.email.trim() && r.role)
    if (filled.length === 0) {
      navigate('/')
      return
    }
    setLoading(true)
    try {
      await Promise.all(
        filled.map(r => inviteMember(workspace.slug, r.email.trim(), r.role, token)),
      )
      toast.success('Invitations sent!')
      navigate('/')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send invitations')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Invite your teammates</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Work in plane happens best with your team. Invite them now to use Plane to its
            potential.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[1fr_160px] gap-3">
            <span className="text-sm font-medium text-foreground">Email</span>
            <span className="text-sm font-medium text-foreground">Role</span>
          </div>

          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_160px] gap-3">
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={row.email}
                onChange={e => updateRow(i, 'email', e.target.value)}
              />
              <select
                value={row.role}
                onChange={e => updateRow(i, 'role', e.target.value)}
                className="rounded-md border border-border bg-transparent px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="" disabled className="bg-background">
                  Select role
                </option>
                <option value="admin" className="bg-background">
                  Admin
                </option>
                <option value="member" className="bg-background">
                  Member
                </option>
                <option value="guest" className="bg-background">
                  Guest
                </option>
              </select>
            </div>
          ))}

          <button
            type="button"
            onClick={addRow}
            className="flex w-fit items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <Plus size={14} />
            Add another
          </button>

          <div className="mt-4 flex flex-col gap-3">
            <Button onClick={handleContinue} className="w-full" disabled={loading}>
              {loading ? 'Sending…' : 'Continue'}
            </Button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-center text-sm font-medium text-foreground hover:underline"
            >
              I'll do it later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
