# ТЗ — Design & Pages (shadcn/ui) — Plane-style UI

**Type:** Design / UI specification only
**Stack (already set up):** React + Vite + TypeScript + Tailwind + **shadcn/ui** + React Router DOM + Zustand
**This document covers:** page layouts and visual design **only**
**This document does NOT cover:** project setup/installation, any functionality, backend, data, or state logic

---

## 0. Scope & rules

- The Vite project is **already installed and configured** — this TZ contains **no setup or installation steps**.
- Build **design only**. **No functionality of any kind** (no data, no CRUD, no backend, no persistence, no local logic).
- Every page renders a **"Coming soon — no functionality yet"** placeholder.
- **Dropdowns** use shadcn/ui `DropdownMenu` — their open/close is the component's built-in behavior, **not** custom logic. Menu items are visual only and do nothing.
- **Routing** is basic page switching between static screens (React Router already present). No guards, no data loading.
- **Pages / wiki module is excluded** (per earlier decision). Project sub-nav = Work Items / Cycles / Modules / Views only.
- Must be **responsive** (desktop → mobile).

---

## 1. Design principles

Faithful replica of Plane's clean, neutral, modern PM look. Airy spacing, thin borders, restrained accent color, no heavy shadows. The design carries no decoration that isn't in Plane.

---

## 2. Design tokens

### 2.1 Color

| Token | Hex | Use |
|---|---|---|
| Accent | `#3f76ff` | Primary buttons, active nav, links, focus |
| Accent soft | `#eaf0ff` | Coming-soon icon bg, badges |
| Active bg | `#e9eefc` | Active sidebar/tab background |
| Background | `#ffffff` | Main content, topbar |
| Sidebar bg | `#f8f8f9` | Left sidebar |
| Border | `#e9e9ec` | All dividers/borders |
| Hover | `#efeff1` | Row/button hover |
| Text | `#1c1c1e` | Primary text |
| Muted | `#8b8b90` | Secondary text, icons, placeholders |
| Danger | `#e5484d` | Delete / sign out |

> Map these into your Tailwind/shadcn theme (CSS variables). Provide a **dark theme** variant as a follow-up (not required in v1 unless requested).

### 2.2 Typography

- Family: **Inter** (system-ui fallback).
- Sizes: page title `20px/600`, section label `11px/600 uppercase, tracking-wide, muted`, body/nav `14px/400` (active `500`), caption `12px`, badge `11px/500`.

### 2.3 Spacing, radius, shadow

- Base unit 4px. Sidebar width **248px**. Topbar height **48px**, secondary view bar **44px**.
- Radius: rows/buttons `6px`, dropdown/card `8px`, avatar square `6px`.
- Shadow: dropdowns only — `0 8px 24px rgba(0,0,0,0.10)`.

### 2.4 Icons

- **lucide-react** throughout. Nav icons `16px`, dropdown item icons `15px`, muted color by default, accent when active.

---

## 3. shadcn/ui components used

| Element | shadcn/ui component |
|---|---|
| Buttons (New, actions) | `Button` |
| All dropdowns / menus | `DropdownMenu` (+ `DropdownMenuItem`, `Separator`, `Label`) |
| Avatars (workspace, users) | `Avatar` |
| Notification/count badges | `Badge` |
| View switcher (List/Board/…) | `Tabs` or button group |
| Sidebar scroll area | `ScrollArea` |
| Dividers | `Separator` |
| Mobile sidebar drawer | `Sheet` |
| Search field (visual only) | `Input` (or `Command` shell, non-functional) |
| Hover hints | `Tooltip` |
| Coming-soon container | `Card` (optional) |

> These are **already-available** shadcn components — add them in the existing project as needed. No install steps documented here per scope.

---

## 4. Global layout — App shell

```
┌───────────┬──────────────────────────────────────────┐
│  SIDEBAR  │  TOPBAR (breadcrumb · avatars · New ▼)    │
│  248px    ├──────────────────────────────────────────┤
│           │  [view bar: List/Board/Cal/Timeline ·     │
│           │   Filters ▼ · Display ▼]  (project only)  │
│           ├──────────────────────────────────────────┤
│           │                                           │
│           │            PAGE CONTENT                   │
│           │        (Coming soon placeholder)          │
│           │                                           │
└───────────┴──────────────────────────────────────────┘
```

**Responsive:** below `md`, the sidebar hides and opens as a `Sheet` drawer via a hamburger (`Menu` icon) in the topbar. Content and topbar go full width.

---

## 5. Sidebar spec

Top → bottom:

1. **Workspace switcher** (`DropdownMenu`): square accent avatar with initial `D`, "Duo Workspace", `ChevronDown`. Menu items (visual): workspace label, Workspace settings, Invite members, `Separator`, Create workspace, `Separator`, Sign out (danger).
2. **Search** (`Input`, visual only): `Search` icon + "Search" placeholder, white field with border.
3. **Primary nav rows:** Home, Your Work, Notifications (with `Badge` "3"), Drafts.
4. **Projects group:** section label "PROJECTS" + `Plus` `DropdownMenu` (Create project / New work item / New cycle / New module — visual).
   - Each project row: chevron (expand), emoji, name, and on hover a `MoreHorizontal` `DropdownMenu` (Project settings, Copy link, `Separator`, Delete — danger).
   - Expanded project shows indented sub-rows: **Work Items, Cycles, Modules, Views**.
5. **Bottom (pinned, above a `Separator`):** AI, Analytics, Trash, then a **user** `DropdownMenu` (round avatar `A`, name, `ChevronDown` → Profile, Settings, Theme, Help, `Separator`, Sign out danger).

**Nav row states:** default (text/muted icon), hover (`#efeff1` bg), active (accent text + `#e9eefc` bg + accent icon, weight 500).

---

## 6. Topbar spec

- **Row 1 (48px):** mobile hamburger (`md:hidden`), breadcrumb "Duo Workspace › Section", spacer, overlapping **member avatars** (A purple, B blue), **New** `Button` (accent) with `DropdownMenu` (Work item / Cycle / Module — visual).
- **Row 2 (44px, only on a project's Work Items page):** view tabs **List / Board / Calendar / Timeline** (active tab = accent + `#e9eefc`), spacer, **Filters** `DropdownMenu` (Priority/State/Assignee/Labels), **Display** `DropdownMenu` (Group by/Order by/Show sub-items). All items visual only.

---

## 7. Routing map (design-level page switching)

| Route | Screen |
|---|---|
| `/` | Home |
| `/your-work` | Your Work |
| `/notifications` | Notifications |
| `/drafts` | Drafts |
| `/ai` | AI (placeholder) |
| `/analytics` | Analytics |
| `/trash` | Trash |
| `/settings` | Settings |
| `/projects/:id/work-items` | Project · Work Items (shows view bar) |
| `/projects/:id/cycles` | Project · Cycles |
| `/projects/:id/modules` | Project · Modules |
| `/projects/:id/views` | Project · Views |

Active route drives sidebar highlight + breadcrumb. No data, no loaders.

---

## 8. Page designs (all "Coming soon", no functionality)

Every page uses the **shared Coming-soon component** (§9), centered in the content area, with its own icon/title/subtitle:

| Page | Icon (lucide) | Title | Subtitle |
|---|---|---|---|
| Home | `Home` | Home | Your workspace overview will live here. |
| Your Work | `Briefcase` | Your Work | Everything assigned to you, in one place. |
| Notifications | `Bell` | Notifications | Mentions, assignments, and updates. |
| Drafts | `FileText` | Drafts | Unsaved work items you started. |
| AI | `Sparkles` | AI | Your AI assistant panel. Interface only for now. |
| Analytics | `BarChart3` | Analytics | Charts and reports across your projects. |
| Trash | `Trash2` | Trash | Deleted items you can restore. |
| Settings | `Settings` | Settings | Profile, workspace, and project settings. |
| Project · Work Items | `CircleDot` | {Project} · Work Items | Tasks, board and list views for this project. |
| Project · Cycles | `RefreshCw` | {Project} · Cycles | Time-boxed sprints with progress tracking. |
| Project · Modules | `Layers` | {Project} · Modules | Group work by feature or deliverable. |
| Project · Views | `PanelsTopLeft` | {Project} · Views | Saved filtered views for this project. |

---

## 9. Shared "Coming soon" component

Centered vertically & horizontally in the content area:

- Rounded-2xl icon tile `64×64`, background `#eaf0ff`, `28px` accent icon.
- Title (`20px/600`) + a `Badge` "Coming soon" (accent-soft bg, accent text, pill).
- Subtitle line (`14px`, muted).
- Fine print (`12px`, muted): **"No functionality yet — design preview only."**

---

## 10. Interaction & states (visual only)

- **Dropdowns:** open on click, close on outside-click / item-click (shadcn `DropdownMenu` default). Items perform **no action**.
- **Project expand/collapse:** chevron toggles the indented sub-rows.
- **Hover** on all rows/buttons; **visible keyboard focus** (accent ring); **reduced-motion** respected.
- No toasts required (the preview toast was a demo aid — omit unless you want it).

---

## 11. Acceptance criteria (design-only)

1. Sidebar, topbar, and content shell match the Plane-style tokens in §2.
2. All routes in §7 switch between static screens; active nav + breadcrumb update.
3. Every page shows the Coming-soon placeholder with correct icon/title/subtitle.
4. All dropdowns in §5–6 open/close correctly; items are non-functional.
5. Project rows expand to Work Items / Cycles / Modules / Views.
6. The view bar appears **only** on a project's Work Items page.
7. Fully responsive; sidebar becomes a `Sheet` drawer under `md`.
8. **No** Pages/wiki, **no** functionality, **no** setup steps anywhere.

---

_End of design TZ. Reference build: the interactive shell already shared._
