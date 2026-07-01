# Project Roadmap — Plane-style UI (from TZ)

> Design-only build. No functionality, no backend, no data.
> Branch: `design-test`. Commit + push after every task and phase.

---

## Phase 1 — Dependencies & Design Tokens
**Goal:** All required libraries installed; Tailwind CSS variables match the TZ tokens.

- [x] 1.1 Install missing deps: `react-router-dom`, `lucide-react`, `zustand`
- [x] 1.2 Initialize shadcn/ui (`npx shadcn@latest init`) and add components: Button, DropdownMenu, Avatar, Badge, Tabs, ScrollArea, Separator, Sheet, Input, Tooltip, Card
- [x] 1.3 Add CSS design tokens in `src/index.css` (colors, radius, shadow, Inter font import)

---

## Phase 2 — App Shell Layout
**Goal:** Fixed 248px sidebar + 48px topbar + scrollable content area renders correctly. Responsive skeleton in place.

- [ ] 2.1 Create `src/components/layout/AppShell.tsx` — sidebar + topbar + `<Outlet />` content slot
- [ ] 2.2 Wire responsive logic: below `md` sidebar hidden, full-width content
- [ ] 2.3 Create root router in `src/routes/index.tsx` with `<AppShell>` as layout wrapper

---

## Phase 3 — Sidebar
**Goal:** Full sidebar spec from TZ §5 implemented (visual only).

- [ ] 3.1 Workspace switcher — square avatar "D", "Duo Workspace", ChevronDown, DropdownMenu (visual items + Sign out danger)
- [ ] 3.2 Search input — visual only (Search icon, placeholder)
- [ ] 3.3 Primary nav rows — Home, Your Work, Notifications (Badge "3"), Drafts
- [ ] 3.4 Projects section — "PROJECTS" label + Plus DropdownMenu; two sample project rows with emoji, name, MoreHorizontal menu
- [ ] 3.5 Project row expand/collapse — chevron toggles indented sub-rows: Work Items / Cycles / Modules / Views
- [ ] 3.6 Bottom nav — AI, Analytics, Trash + Separator + User DropdownMenu (avatar "A", name, menu items)
- [ ] 3.7 Nav row states — default / hover (`#efeff1`) / active (accent text + `#e9eefc` bg)
- [ ] 3.8 Mobile sidebar — Sheet drawer triggered by hamburger in topbar

---

## Phase 4 — Topbar
**Goal:** Both topbar rows implemented per TZ §6.

- [ ] 4.1 Row 1 (48px) — mobile hamburger (md:hidden), breadcrumb "Duo Workspace › Section", member avatars, New button + DropdownMenu
- [ ] 4.2 Row 2 (44px) — view tabs List/Board/Calendar/Timeline, Filters DropdownMenu, Display DropdownMenu
- [ ] 4.3 Row 2 visible **only** on `/projects/:id/work-items` route

---

## Phase 5 — Routing & Active State
**Goal:** All 12 routes in TZ §7 work; active route updates sidebar highlight and breadcrumb.

- [ ] 5.1 Define all routes (/, /your-work, /notifications, /drafts, /ai, /analytics, /trash, /settings, /projects/:id/work-items, /projects/:id/cycles, /projects/:id/modules, /projects/:id/views)
- [ ] 5.2 Active route drives sidebar nav highlight (accent text + active bg)
- [ ] 5.3 Breadcrumb in topbar reflects current route ("Duo Workspace › Home", etc.)

---

## Phase 6 — Coming Soon Component
**Goal:** Shared reusable placeholder component per TZ §9.

- [ ] 6.1 Create `src/components/ComingSoon.tsx` — 64×64 icon tile (#eaf0ff bg, 28px accent icon), title (20px/600), Badge "Coming soon", subtitle (14px muted), fine print (12px muted)
- [ ] 6.2 Verify component renders correctly on all pages

---

## Phase 7 — All Pages
**Goal:** Every route renders the Coming Soon component with correct icon/title/subtitle per TZ §8.

- [ ] 7.1 Home — `Home` icon, "Home", "Your workspace overview will live here."
- [ ] 7.2 Your Work — `Briefcase`, "Your Work", "Everything assigned to you, in one place."
- [ ] 7.3 Notifications — `Bell`, "Notifications", "Mentions, assignments, and updates."
- [ ] 7.4 Drafts — `FileText`, "Drafts", "Unsaved work items you started."
- [ ] 7.5 AI — `Sparkles`, "AI", "Your AI assistant panel. Interface only for now."
- [ ] 7.6 Analytics — `BarChart3`, "Analytics", "Charts and reports across your projects."
- [ ] 7.7 Trash — `Trash2`, "Trash", "Deleted items you can restore."
- [ ] 7.8 Settings — `Settings`, "Settings", "Profile, workspace, and project settings."
- [ ] 7.9 Project · Work Items — `CircleDot`, "{Project} · Work Items", "Tasks, board and list views for this project."
- [ ] 7.10 Project · Cycles — `RefreshCw`, "{Project} · Cycles", "Time-boxed sprints with progress tracking."
- [ ] 7.11 Project · Modules — `Layers`, "{Project} · Modules", "Group work by feature or deliverable."
- [ ] 7.12 Project · Views — `PanelsTopLeft`, "{Project} · Views", "Saved filtered views for this project."

---

## Phase 8 — Polish & Acceptance Check
**Goal:** All 8 acceptance criteria from TZ §11 verified and passing.

- [ ] 8.1 Verify sidebar/topbar/shell match design tokens (colors, spacing, radius, typography)
- [ ] 8.2 Verify all 12 routes switch correctly with active nav + breadcrumb update
- [ ] 8.3 Verify all dropdowns open/close (shadcn default), items non-functional
- [ ] 8.4 Verify project expand/collapse works
- [ ] 8.5 Verify view bar appears only on Work Items page
- [ ] 8.6 Verify full responsiveness — sidebar becomes Sheet drawer under md
- [ ] 8.7 Visible keyboard focus (accent ring), reduced-motion respected
- [ ] 8.8 No Pages/wiki, no functionality anywhere

---

## Progress legend
- `[ ]` Not started
- `[~]` In progress
- `[x]` Done (committed to `design-test`)
