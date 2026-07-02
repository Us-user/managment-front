import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import { MultiSelect } from '@/components/ui/multi-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const schema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.string().min(1, 'Pick a priority'),
  assignees: z.array(z.string()).min(1, 'Pick at least one assignee'),
  dueDate: z.string().min(1, 'Due date is required'),
})

type FormValues = z.infer<typeof schema>

const PRIORITY_OPTIONS = ['Urgent', 'High', 'Medium', 'Low', 'None']

const ASSIGNEE_OPTIONS = [
  { value: 'abdulloh', label: 'Abdulloh' },
  { value: 'amsurur', label: 'Amsurur' },
  { value: 'homidov', label: 'Homidov' },
]

export function FormDemoPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', priority: '', assignees: [], dueDate: '' },
  })

  function onSubmit(data: FormValues) {
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-1 text-xl font-semibold text-foreground">B4.1 — Form primitives</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        All fields wired to React Hook Form + Zod. Submit with empty values to see errors.
      </p>

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

          {/* Select */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map(p => (
                        <SelectItem key={p} value={p.toLowerCase()}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
    </div>
  )
}
