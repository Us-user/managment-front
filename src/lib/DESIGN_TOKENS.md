# Design Tokens

Source of truth: `src/index.css`. Do not edit token values here — this file is documentation only.

Dark mode is **automatic**: the same utility classes work in both modes. Values swap
when the `dark` class is on `<html>`. No `dark:` variants needed in components.

---

## Color tokens

Defined in `:root` (light) and `.dark` (dark). Exposed to Tailwind via
`@theme inline { --color-*: var(--*) }`, which generates the utility classes below.

### Surface / layout

| CSS variable | Tailwind utilities | Light | Dark | Use for |
|---|---|---|---|---|
| `--background` | `bg-background`, `text-background` | white | near-black | page/app shell background |
| `--foreground` | `text-foreground` | near-black | near-white | primary body text |
| `--card` | `bg-card`, `text-card-foreground` | white | dark gray | panels, sidebars, surface cards |
| `--card-foreground` | `text-card-foreground` | near-black | near-white | text inside card surfaces |
| `--popover` | `bg-popover`, `text-popover-foreground` | white | dark gray | dropdowns, tooltips, modals |
| `--popover-foreground` | `text-popover-foreground` | near-black | near-white | text inside popovers |
| `--sidebar` | `bg-sidebar` | very light gray | dark charcoal | sidebar rail and panel background |
| `--sidebar-border` | `border-sidebar-border` | light gray | 10% white | sidebar divider lines |

### Interactive / brand

| CSS variable | Tailwind utilities | Light | Dark | Use for |
|---|---|---|---|---|
| `--primary` | `bg-primary`, `text-primary`, `border-primary` | `#3f76ff` | `#3f76ff` | brand blue — buttons, active states, links |
| `--primary-foreground` | `text-primary-foreground` | white | white | text/icons on primary-colored backgrounds |
| `--secondary` | `bg-secondary`, `text-secondary-foreground` | light gray | dark gray | secondary buttons, chips, tags |
| `--secondary-foreground` | `text-secondary-foreground` | dark | near-white | text on secondary backgrounds |
| `--accent` | `bg-accent`, `text-accent-foreground` | light gray | dark gray | hover highlight on interactive rows/items |
| `--accent-foreground` | `text-accent-foreground` | dark | near-white | text on accent backgrounds |
| `--destructive` | `bg-destructive`, `text-destructive` | `#ef4444` | `#f87171` | errors, delete/danger actions |
| `--destructive-foreground` | `text-destructive-foreground` | white | white | text on destructive-colored backgrounds |

### Navigation states

| CSS variable | Tailwind utilities | Light | Dark | Use for |
|---|---|---|---|---|
| `--nav-active-bg` | `bg-nav-active-bg` | `#e9eefc` (blue tint) | muted blue | active/selected nav item background |
| `--nav-hover-bg` | `bg-nav-hover-bg` | light gray | dark gray | nav item hover background |

### Form / utility

| CSS variable | Tailwind utilities | Light | Dark | Use for |
|---|---|---|---|---|
| `--muted` | `bg-muted` | light gray | dark gray | subtle fills, input backgrounds, hover states |
| `--muted-foreground` | `text-muted-foreground` | mid gray | light gray | placeholder text, secondary labels, hints |
| `--border` | `border-border` | light gray | 10% white | default border on all elements (also set on `*`) |
| `--input` | `border-input` | light gray | 15% white | input field border specifically |
| `--ring` | `ring-ring` | `#3f76ff` | `#3f76ff` | focus ring on interactive elements |

---

## Radius tokens

Derived from a single base `--radius: 0.5rem` via `@theme inline`. All four values
move together if the base ever changes.

| CSS variable | Tailwind utility | Value (light = dark) | Use for |
|---|---|---|---|
| `--radius-sm` | `rounded-sm` | `0.5rem − 4px = 4px` | small chips, badges, tight inputs |
| `--radius-md` | `rounded-md` | `0.5rem − 2px = 6px` | buttons, input fields |
| `--radius-lg` | `rounded-lg` | `0.5rem = 8px` | cards, panels, dropdowns |
| `--radius-xl` | `rounded-xl` | `0.5rem + 4px = 12px` | large cards, modal dialogs |

---

## Spacing scale

Defined in `@theme {}` as static values. Extend all spacing utilities:
`p-xs`, `m-sm`, `gap-md`, `w-lg`, `h-xl`, etc.

| CSS variable | Value | px equiv | Example utilities |
|---|---|---|---|
| `--spacing-xs` | `0.25rem` | 4 px | `p-xs`, `gap-xs` |
| `--spacing-sm` | `0.5rem` | 8 px | `p-sm`, `m-sm` |
| `--spacing-md` | `1rem` | 16 px | `p-md`, `gap-md` |
| `--spacing-lg` | `1.5rem` | 24 px | `p-lg`, `m-lg` |
| `--spacing-xl` | `2rem` | 32 px | `p-xl`, `gap-xl` |
| `--spacing-2xl` | `3rem` | 48 px | `p-2xl`, `m-2xl` |

---

## Type scale

Defined in `@theme {}`. Maps directly to `text-{size}` utilities.

| CSS variable | Tailwind utility | Value | Use for |
|---|---|---|---|
| `--text-xs` | `text-xs` | `0.75rem` | labels, badges, captions, fine print |
| `--text-sm` | `text-sm` | `0.875rem` | secondary body, sidebar items, form labels |
| `--text-base` | `text-base` | `1rem` | default body text |
| `--text-lg` | `text-lg` | `1.125rem` | emphasized body, minor headings |
| `--text-xl` | `text-xl` | `1.25rem` | section headings |
| `--text-2xl` | `text-2xl` | `1.5rem` | page sub-titles |
| `--text-3xl` | `text-3xl` | `1.875rem` | page titles |

---

## Notes

- **Body base**: `font-family: Inter` at `14px / 1.5` is set on `body` in `index.css` — no utility class needed.
- **Border default**: `border-color: var(--border)` is set globally on `*` — `border` alone draws a themed border without adding `border-border`.
- **Theme toggle**: dark mode state lives in `src/contexts/ThemeContext.tsx`; the UI control is a shadcn `Switch` in the Topbar.
