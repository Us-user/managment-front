# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server with HMR
npm run build        # Type-check (tsc -b) then bundle
npm run lint         # Run ESLint
npm run format       # Prettier auto-fix
npm run format:check # Prettier check (no writes)
npm run preview      # Preview production build locally
```

There are no tests yet.

## Architecture

This is a **Vite + React 19 + TypeScript** SPA — not Next.js. Entry: `src/main.tsx` → `src/App.tsx`.

The project is a Plane-style project management UI. The design spec in `TZ_design_pages_shadcn.md` is the primary reference for what to build: layout, routes, color tokens, component choices, and typography.

### Folder conventions

```
src/
  api/          # HTTP client + backend request functions
  components/   # Shared UI components (not feature-specific)
  features/     # Domain modules (auth, tasks, projects…) — each self-contained
  lib/
    constants.ts
  routes/       # Route definitions and page-level components
```

Most subdirectories currently have only a `README.md` — the project is in early scaffolding. Build features inside `src/features/<name>/`.

### Path alias

`@/*` maps to `./src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`). Always use `@/` for internal imports.

### Planned libraries (not yet installed)

| Purpose | Library |
|---|---|
| Routing | `react-router-dom` |
| State | `zustand` |
| UI components | `shadcn/ui` |
| Icons | `lucide-react` |

Install these before building any feature that needs them.

## Code Style

Prettier config (`.prettierrc`): **no semicolons, single quotes, trailing commas everywhere**. ESLint uses flat config with `typescript-eslint` recommended. Run `npm run format` before committing.

## Layout (from design spec)

App shell: fixed **248px sidebar** + **48px topbar** + scrollable content area. Below `md` breakpoint the sidebar becomes a `Sheet` drawer. Colors are set as CSS variables mapped to shadcn tokens — accent `#3f76ff`, sidebar bg `#f8f8f9`, border `#e9e9ec`. Body font is Inter at 14px.

## Tailwind

Tailwind v4 — configured via the `@tailwindcss/vite` plugin only. There is no `tailwind.config.*` file. All custom design tokens go in `src/index.css` using `@theme` / CSS variables.
