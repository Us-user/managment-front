# Design Tokens — B0.1

All tokens are defined in `src/index.css`. Colors use CSS variable indirection so
dark mode works by toggling the `dark` class on `<html>`.

---

## Color tokens

Defined in `:root` (light) and `.dark` (dark). Mapped to Tailwind utilities via
`@theme inline { --color-*: var(--*) }`.

| Token | Tailwind utility | Light value | Dark value | When to use |
|---|---|---|---|---|
| `--background` | `bg-background` / `text-background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | Page / app shell background |
| `--foreground` | `text-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Primary body text |
| `--card` | `bg-card` / `text-card-foreground` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | Panels, sidebars, cards |
| `--card-foreground` | `text-card-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Text inside cards |
| `--popover` | `bg-popover` / `text-popover-foreground` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | Dropdowns, tooltips, popovers |
| `--popover-foreground` | `text-popover-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Text inside popovers |
| `--primary` | `bg-primary` / `text-primary` | `#3f76ff` | `#3f76ff` | Brand blue — buttons, active states, links |
| `--primary-foreground` | `text-primary-foreground` | `#ffffff` | `#ffffff` | Text/icons on primary backgrounds |
| `--secondary` | `bg-secondary` / `text-secondary-foreground` | `oklch(0.961 0 0)` | `oklch(0.269 0 0)` | Secondary buttons, tags |
| `--secondary-foreground` | `text-secondary-foreground` | `oklch(0.21 0 0)` | `oklch(0.985 0 0)` | Text on secondary backgrounds |
| `--muted` | `bg-muted` | `oklch(0.961 0 0)` | `oklch(0.269 0 0)` | Hover states, input fill, subtle chips |
| `--muted-foreground` | `text-muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` | Placeholder text, de-emphasized labels |
| `--accent` | `bg-accent` / `text-accent-foreground` | `oklch(0.961 0 0)` | `oklch(0.269 0 0)` | Hover highlight on interactive items |
| `--accent-foreground` | `text-accent-foreground` | `oklch(0.21 0 0)` | `oklch(0.985 0 0)` | Text on accent backgrounds |
| `--destructive` | `bg-destructive` / `text-destructive` | `#ef4444` | `#f87171` | Errors, delete actions |
| `--destructive-foreground` | `text-destructive-foreground` | `#ffffff` | `#ffffff` | Text on destructive backgrounds |
| `--border` | `border-border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | Default border on all elements |
| `--input` | `border-input` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 15%)` | Input field border |
| `--ring` | `ring-ring` | `#3f76ff` | `#3f76ff` | Focus ring |
| `--sidebar` | `bg-sidebar` | `oklch(0.975 0 0)` | `oklch(0.185 0 0)` | Sidebar rail and panel background |
| `--sidebar-border` | `border-sidebar-border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | Sidebar divider lines |
| `--nav-active-bg` | `bg-nav-active-bg` | `#e9eefc` | `oklch(0.25 0.07 264)` | Active nav item background |
| `--nav-hover-bg` | `bg-nav-hover-bg` | `oklch(0.944 0 0)` | `oklch(0.25 0 0)` | Nav item hover background |

---

## Radius tokens

Derived from `--radius: 0.5rem` via `@theme inline`. Respond to any future radius
override automatically.

| Token | Tailwind utility | Value |
|---|---|---|
| `--radius-sm` | `rounded-sm` | `calc(0.5rem - 4px)` = 4px |
| `--radius-md` | `rounded-md` | `calc(0.5rem - 2px)` = 6px |
| `--radius-lg` | `rounded-lg` | `0.5rem` = 8px |
| `--radius-xl` | `rounded-xl` | `calc(0.5rem + 4px)` = 12px |

---

## Spacing scale

Defined in `@theme {}` as `--spacing-*`. Usable as any Tailwind spacing utility:
`p-xs`, `gap-md`, `m-lg`, `w-xl`, etc.

| Token | Value | Example utilities |
|---|---|---|
| `--spacing-xs` | `0.25rem` (4px) | `p-xs`, `gap-xs` |
| `--spacing-sm` | `0.5rem` (8px) | `p-sm`, `m-sm` |
| `--spacing-md` | `1rem` (16px) | `p-md`, `gap-md` |
| `--spacing-lg` | `1.5rem` (24px) | `p-lg`, `m-lg` |
| `--spacing-xl` | `2rem` (32px) | `p-xl`, `gap-xl` |
| `--spacing-2xl` | `3rem` (48px) | `p-2xl`, `m-2xl` |

---

## Type scale

Defined in `@theme {}` as `--text-*`. Maps to Tailwind `text-{size}` utilities.

| Token | Tailwind utility | Value | When to use |
|---|---|---|---|
| `--text-xs` | `text-xs` | `0.75rem` | Labels, badges, helper text |
| `--text-sm` | `text-sm` | `0.875rem` | Secondary body, captions |
| `--text-base` | `text-base` | `1rem` | Default body text |
| `--text-lg` | `text-lg` | `1.125rem` | Emphasized body, sub-headings |
| `--text-xl` | `text-xl` | `1.25rem` | Section headings |
| `--text-2xl` | `text-2xl` | `1.5rem` | Page sub-titles |
| `--text-3xl` | `text-3xl` | `1.875rem` | Page titles |

---

## Dark mode

Toggle by adding/removing the `dark` class on `<html>`. Wired via
`@custom-variant dark (&:is(.dark *))` in Tailwind v4.

Theme state is managed by `ThemeProvider` in `src/contexts/ThemeContext.tsx`, which
persists to `localStorage` and respects `prefers-color-scheme` on first load.

The toggle control lives in the topbar (`src/features/topbar/Topbar.tsx`) as a
shadcn `Switch` component between Sun and Moon icons.

---

## Live demo

Navigate to `/tokens` in the running app to see all tokens rendered.
