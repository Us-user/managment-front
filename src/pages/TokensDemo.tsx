import { useTheme } from '@/contexts/ThemeContext'
import { Switch } from '@/components/ui/switch'
import { Sun, Moon } from 'lucide-react'

const COLOR_SWATCHES = [
  { name: 'background', bg: 'bg-background', text: 'text-foreground', label: 'Background' },
  { name: 'foreground', bg: 'bg-foreground', text: 'text-background', label: 'Foreground' },
  { name: 'card', bg: 'bg-card', text: 'text-card-foreground', label: 'Card' },
  { name: 'primary', bg: 'bg-primary', text: 'text-primary-foreground', label: 'Primary' },
  { name: 'secondary', bg: 'bg-secondary', text: 'text-secondary-foreground', label: 'Secondary' },
  { name: 'muted', bg: 'bg-muted', text: 'text-muted-foreground', label: 'Muted' },
  { name: 'accent', bg: 'bg-accent', text: 'text-accent-foreground', label: 'Accent' },
  { name: 'destructive', bg: 'bg-destructive', text: 'text-destructive-foreground', label: 'Destructive' },
  { name: 'border', bg: 'bg-border', text: 'text-foreground', label: 'Border' },
  { name: 'sidebar', bg: 'bg-sidebar', text: 'text-foreground', label: 'Sidebar' },
  { name: 'nav-active-bg', bg: 'bg-nav-active-bg', text: 'text-primary', label: 'Nav Active' },
]

const SPACING_TOKENS = [
  { name: 'xs', cls: 'w-xs', value: '0.25rem / 4px' },
  { name: 'sm', cls: 'w-sm', value: '0.5rem / 8px' },
  { name: 'md', cls: 'w-md', value: '1rem / 16px' },
  { name: 'lg', cls: 'w-lg', value: '1.5rem / 24px' },
  { name: 'xl', cls: 'w-xl', value: '2rem / 32px' },
  { name: '2xl', cls: 'w-2xl', value: '3rem / 48px' },
]

const TEXT_TOKENS = [
  { name: 'xs', cls: 'text-xs', value: '0.75rem' },
  { name: 'sm', cls: 'text-sm', value: '0.875rem' },
  { name: 'base', cls: 'text-base', value: '1rem' },
  { name: 'lg', cls: 'text-lg', value: '1.125rem' },
  { name: 'xl', cls: 'text-xl', value: '1.25rem' },
  { name: '2xl', cls: 'text-2xl', value: '1.5rem' },
  { name: '3xl', cls: 'text-3xl', value: '1.875rem' },
]

export function TokensDemo() {
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground p-md">
      <div className="mx-auto max-w-3xl space-y-2xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Design Tokens</h1>
            <p className="text-muted-foreground mt-xs">B0.1 — shadcn/ui tokens + spacing + type scale</p>
          </div>
          <div className="flex items-center gap-sm">
            <Sun size={14} className="text-muted-foreground" />
            <Switch checked={theme === 'dark'} onCheckedChange={toggle} aria-label="Toggle dark mode" />
            <Moon size={14} className="text-muted-foreground" />
          </div>
        </div>

        {/* Color swatches */}
        <section>
          <h2 className="text-xl font-semibold mb-md">Color Tokens</h2>
          <div className="grid grid-cols-2 gap-sm sm:grid-cols-3 md:grid-cols-4">
            {COLOR_SWATCHES.map(s => (
              <div key={s.name} className="rounded-lg overflow-hidden border border-border">
                <div className={`${s.bg} ${s.text} h-16 flex items-center justify-center text-xs font-medium`}>
                  {s.label}
                </div>
                <div className="bg-card px-sm py-xs">
                  <p className="text-xs font-mono text-foreground">{s.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Spacing scale */}
        <section>
          <h2 className="text-xl font-semibold mb-md">Spacing Scale</h2>
          <div className="space-y-sm">
            {SPACING_TOKENS.map(t => (
              <div key={t.name} className="flex items-center gap-md">
                <span className="text-xs font-mono text-muted-foreground w-8">--{t.name}</span>
                <div className={`${t.cls} h-6 bg-primary rounded-sm shrink-0`} />
                <span className="text-xs text-muted-foreground">{t.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Type scale */}
        <section>
          <h2 className="text-xl font-semibold mb-md">Type Scale</h2>
          <div className="space-y-sm border border-border rounded-lg p-md bg-card">
            {TEXT_TOKENS.map(t => (
              <div key={t.name} className="flex items-baseline gap-md">
                <span className="text-xs font-mono text-muted-foreground w-12 shrink-0">text-{t.name}</span>
                <span className={`${t.cls} font-medium leading-tight`}>
                  The quick brown fox
                </span>
                <span className="text-xs text-muted-foreground ml-auto shrink-0">{t.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Radius */}
        <section>
          <h2 className="text-xl font-semibold mb-md">Border Radius</h2>
          <div className="flex flex-wrap gap-md">
            {[
              { label: 'rounded-sm', cls: 'rounded-sm' },
              { label: 'rounded-md', cls: 'rounded-md' },
              { label: 'rounded-lg', cls: 'rounded-lg' },
              { label: 'rounded-xl', cls: 'rounded-xl' },
              { label: 'rounded-full', cls: 'rounded-full' },
            ].map(r => (
              <div key={r.label} className="flex flex-col items-center gap-xs">
                <div className={`${r.cls} bg-primary h-12 w-12`} />
                <span className="text-xs font-mono text-muted-foreground">{r.label}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
