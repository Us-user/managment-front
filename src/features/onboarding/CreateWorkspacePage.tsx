import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { createWorkspace } from '@/api/workspace'
import { useAuthStore } from '@/stores/authStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { toast } from 'sonner'

const toSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)

const schema = z.object({
  name: z.string().min(1, 'Name your workspace').max(100),
  slug: z
    .string()
    .min(2, 'URL is too short')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Lowercase, numbers and hyphens only'),
})

export function CreateWorkspacePage() {
  const navigate = useNavigate()
  const setWorkspace = useWorkspaceStore((s) => s.setWorkspace)
  const addWorkspace = useWorkspaceStore((s) => s.addWorkspace)
  const workspace = useWorkspaceStore((s) => s.workspace)
  const email = useAuthStore((s) => s.user?.email)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', slug: '' },
  })

  async function onSubmit({ name, slug }: z.infer<typeof schema>) {
    try {
      const created = await createWorkspace(name, slug)
      addWorkspace(created)
      setWorkspace(created)
      // Jump straight into the new workspace — no invite-members detour.
      navigate('/')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create workspace',
      )
    }
  }

  // Only offer "Go back" when there's already a workspace to return to.
  function goBack() {
    if (workspace) navigate('/')
    else navigate('/login')
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center bg-background px-4">
      {email && (
        <span className="absolute right-6 top-5 text-sm text-muted-foreground">
          {email}
        </span>
      )}
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Create your workspace
          </h1>
          <p className="mt-1 text-base text-muted-foreground">
            All your work — unified.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name your workspace <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter workspace name"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        form.setValue('slug', toSlug(e.target.value), {
                          shouldValidate: true,
                        })
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Set your workspace's URL{' '}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center overflow-hidden rounded-md border border-border focus-within:ring-1 focus-within:ring-ring">
                      <span className="shrink-0 border-r border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
                        app.plane.so/
                      </span>
                      <input
                        placeholder="Type or paste a URL"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]/g, ''),
                          )
                        }
                        className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                      />
                    </div>
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    You can only edit the slug of the URL
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating…' : 'Create workspace'}
              </Button>
              <Button type="button" variant="secondary" onClick={goBack}>
                Go back
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
