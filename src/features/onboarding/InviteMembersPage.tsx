import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form } from '@/components/ui/form'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { inviteMember } from '@/api/workspace'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

interface FormValues {
  members: { email: string; role: string }[]
}

const EMPTY = { email: '', role: '' }

export function InviteMembersPage() {
  const navigate = useNavigate()
  const workspace = useAuthStore((s) => s.workspace)

  const form = useForm<FormValues>({
    defaultValues: { members: [EMPTY, EMPTY, EMPTY] },
  })
  const { fields, append } = useFieldArray({
    control: form.control,
    name: 'members',
  })

  async function onSubmit({ members }: FormValues) {
    if (!workspace) return
    const filled = members.filter((m) => m.email.trim() && m.role)
    if (filled.length === 0) {
      navigate('/')
      return
    }
    try {
      await Promise.all(
        filled.map((m) => inviteMember(workspace.slug, m.email.trim(), m.role)),
      )
      toast.success('Invitations sent!')
      navigate('/')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to send invitations',
      )
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Invite your teammates
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Work in plane happens best with your team. Invite them now to use
            Plane to its potential.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <div className="grid grid-cols-[1fr_160px] gap-3">
              <span className="text-sm font-medium text-foreground">Email</span>
              <span className="text-sm font-medium text-foreground">Role</span>
            </div>

            {fields.map((f, i) => (
              <div key={f.id} className="grid grid-cols-[1fr_160px] gap-3">
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  {...form.register(`members.${i}.email`)}
                />
                <Controller
                  control={form.control}
                  name={`members.${i}.role`}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="guest">Guest</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => append(EMPTY)}
              className="flex w-fit items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <Plus size={14} />
              Add another
            </button>

            <div className="mt-4 flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Sending…' : 'Continue'}
              </Button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-center text-sm font-medium text-foreground hover:underline"
              >
                I'll do it later
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
