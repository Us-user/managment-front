# Session Notes

> Auto-updated by /stop. Read by /start to resume where the last session ended.

---

## Current position

- **Phase:** Post Phase 8 — Ticket work (TASKM series)
- **Last completed task:** TASKM-14 B0.1 follow-up — token documentation (`DESIGN_TOKENS.md`) + hardcoded value audit
- **Next task:** Next TASKM ticket (check board)

---

## Session history

### Session — 2026-07-02 (2nd)
**Completed:**
- [x] TASKM-14 B0.1 follow-up — created `DESIGN_TOKENS.md` at project root (all tokens documented from actual `src/index.css`: colors, radius, spacing, type scale)
- [x] TASKM-14 B0.1 follow-up — audited `ComingSoon`, `Topbar`, `AppShell`, `SidebarPanel`, `SidebarRail` for hardcoded values; confirmed `ComingSoon` fully passes token check
- [x] Moved `DESIGN_TOKENS.md` from `src/lib/` to project root per user request

**Stopped at:** TASKM-14 B0.1 fully complete — awaiting next ticket

**Notes:**
- `DESIGN_TOKENS.md` lives at project root alongside `CLAUDE.md`
- Hardcoded values still present (not fixed — reported for user decision): `bg-purple-600 text-white` on Avatar in Topbar; `bg-amber-50 border-amber-200 text-amber-700` on trial banner in SidebarPanel; `text-white` on project color badge in SidebarPanel (paired with data-driven inline bg style)
- `ComingSoon` sample page fully passes — all classes use token utilities

---

### Session — 2026-07-02
**Completed:**
- [x] Removed Notifications item from sidebar nav
- [x] TASKM-14 B0.1 — Set up shadcn CSS variable pattern (`@theme inline`, `:root`, `.dark`) for dark mode
- [x] TASKM-14 B0.1 — Added `ThemeProvider` context + `useTheme` hook (persists to localStorage, respects `prefers-color-scheme`)
- [x] TASKM-14 B0.1 — Added Sun/Switch/Moon theme toggle in Topbar
- [x] TASKM-14 B0.1 — Fixed layout hardcoded `bg-white` → `bg-background`/`bg-card`/`bg-sidebar` in AppShell, SidebarRail, SidebarPanel, AISidebarPanel
- [x] TASKM-14 B0.1 — Added spacing scale (`--spacing-xs` → `--spacing-2xl`) and type scale (`--text-xs` → `--text-3xl`) to `src/index.css`
- [x] TASKM-14 B0.1 — Replaced all remaining hardcoded hex/color values with token utilities across SidebarPanel, AISidebarPanel, ComingSoon, HomePage

**Stopped at:** TASKM-14 B0.1 complete — awaiting next ticket

**Notes:**
- User asked to add design tokens then remove the demo page (`/tokens`) and docs (`docs/design-tokens.md`) — only the token system and dark mode remain in code
- Dark mode toggle is a `shadcn Switch` component in the Topbar between Sun and Moon icons; state lives in `ThemeContext` and toggles `dark` class on `<html>`
- `--color-accent` in the old CSS meant brand blue but in shadcn convention `accent` = hover highlight. Brand blue is now `--primary` (#3f76ff). All components updated.
- `@radix-ui/react-switch` was installed as a dependency (shadcn Switch component)
- Shadcn CLI put `switch.tsx` in a literal `@/` directory — manually moved to `src/components/ui/switch.tsx`
- Dynamic project/assignee colors in `HomePage.tsx` RECENTS data (`item.color`, `item.assigneeColor`) kept as inline styles — they're data-driven, not design decisions
- Amber trial banner in SidebarPanel kept as-is (intentional semantic color, no amber token in system)

---

### Session — (pre-history)
**Completed:**
- [x] Phase 1 — Dependencies & Design Tokens (deps installed, shadcn init, CSS tokens)
- [x] Phase 2 — App Shell Layout
- [x] Phase 3 — Sidebar (all 8 sub-tasks)
- [x] Phase 4 — Topbar (all 3 sub-tasks)
- [x] Phase 5 — Routing & Active State
- [x] Phase 6 — Coming Soon Component
- [x] Phase 7 — All Pages (all 12 routes)
- [x] Phase 8 — Polish & Acceptance Check (all 8 criteria)

**Stopped at:** Phase 8 complete — all original roadmap done

**Notes:** All original ROADMAP phases 1–8 verified and committed on `design-test`.
