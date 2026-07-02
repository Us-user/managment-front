import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import { MultiSelect } from '@/components/ui/multi-select'
import { Button } from '@/components/ui/button'
import { ErrorBanner } from '@/components/ui/error-banner'
import { PrioritySelect } from '@/components/ui/priority-select'

const schema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.string().min(1, 'Pick a priority'),
  assignees: z.array(z.string()).min(1, 'Pick at least one assignee'),
  dueDate: z.string().min(1, 'Due date is required'),
})

type FormValues = z.infer<typeof schema>

const ASSIGNEE_OPTIONS = [
  { value: 'abdulloh', label: 'Abdulloh' },
  { value: 'amsurur', label: 'Amsurur' },
  { value: 'homidov', label: 'Homidov' },
]

const SIMULATED_ERRORS = [
  { code: 'CONFLICT', label: 'Conflict' },
  { code: 'FORBIDDEN', label: 'Forbidden' },
  { code: 'SERVER_ERROR', label: 'Server error' },
  { code: 'NETWORK_ERROR', label: 'Network error' },
]

export function FormDemoPage() {
  const [apiError, setApiError] = useState<{ code: string } | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', priority: '', assignees: [], dueDate: '' },
  })

  function onSubmit(data: FormValues) {
    setApiError(null)
    toast.success('Work item created', {
      description: `"${data.title}" was added successfully.`,
    })
  }

  function simulateError(code: string) {
    setApiError({ code })
    toast.error('Action failed', { description: code })
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-1 text-xl font-semibold text-foreground">B4.3 — Feedback</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Toast/notification system + inline error banner. Submit the form or trigger a simulated API
        error below.
      </p>

      {/* Inline error banner */}
      <ErrorBanner error={apiError} onDismiss={() => setApiError(null)} className="mb-6" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Input */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Work item title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Textarea */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe this work item…" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Priority */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <PrioritySelect
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select priority"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* MultiSelect */}
          <FormField
            control={form.control}
            name="assignees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignees</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={ASSIGNEE_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select assignees"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* DatePicker */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due date</FormLabel>
                <FormControl>
                  <DatePicker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Disabled state demo */}
          <div className="space-y-1.5 border-t border-border pt-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Disabled state
            </p>
            <Input placeholder="Disabled input" disabled />
            <Textarea placeholder="Disabled textarea" disabled />
          </div>

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>

      {/* Toast + ErrorBanner trigger panel */}
      <div className="mt-10 border-t border-border pt-6 space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          B4.3 — Simulate API errors
        </p>
        <div className="flex flex-wrap gap-2">
          {SIMULATED_ERRORS.map(({ code, label }) => (
            <Button
              key={code}
              variant="outline"
              size="sm"
              onClick={() => simulateError(code)}
            >
              {label}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Success', { description: 'Everything went fine.' })}
          >
            Success toast
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.warning('Warning', { description: 'Proceed with caution.' })}
          >
            Warning toast
          </Button>
        </div>
      </div>
    </div>
  )
}
