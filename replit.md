# Workspace — Daibilet

## Overview

pnpm workspace monorepo using TypeScript. Daibilet Admin V3 + Supplier Cabinet frontend UI built in React + Vite, served at `/`.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite (artifacts/admin), wouter routing, shadcn/ui, Tailwind CSS v4

## Frontend Structure (`artifacts/admin/src/`)

### Routing
- `/` → redirects to `/admin`
- `/admin/*` — Admin Panel (all admin modules)
- `/supplier/*` — Supplier Cabinet

### Admin Pages
- `/admin` — Dashboard (stats, recent orders, charts)
- `/admin/events` + `/admin/events/:id` — Events list & detail
- `/admin/venues` + `/admin/venues/:id` — Venues list & detail
- `/admin/cities` + `/admin/cities/:id` — Cities list & detail
- `/admin/suppliers` + `/admin/suppliers/:id` — Suppliers list & detail
- `/admin/orders` + `/admin/orders/:id` — Orders list & detail (with refund requests)
- `/admin/landings` + `/admin/landings/:id` — Landings list & detail
- `/admin/promo-blocks` + `/admin/promo-blocks/:id` — Promo blocks list & detail
- `/admin/settings` — Platform settings

### Supplier Cabinet Pages (MVP)
- `/supplier` — Supplier dashboard
- `/supplier/events` + `/supplier/events/:id` — Own events (read-only imported fields)
- `/supplier/orders` — Own orders
- `/supplier/profile` — Company profile (editable contact fields, read-only legal fields)
- `/supplier/reports` — Reports placeholder
- `/supplier/support` — Support request flow

### Shared Components (`src/components/`)
- `layout/AdminLayout.tsx` — sidebar + topbar wrapper for admin
- `layout/SupplierLayout.tsx` — sidebar + topbar wrapper for supplier
- `layout/AdminSidebar.tsx` — collapsible dark sidebar with nav groups
- `layout/SupplierSidebar.tsx` — supplier nav sidebar
- `layout/Topbar.tsx` — breadcrumbs, theme toggle, notifications
- `shared/StatCard.tsx` — metric card with trend indicator
- `shared/DataTable.tsx` — generic sortable table with loading skeleton
- `shared/StatusBadge.tsx` — colored status pill (multi-variant)
- `shared/PageHeader.tsx` — page title + action buttons
- `shared/FilterBar.tsx` — search input + filter slot
- `shared/DetailField.tsx` — field label/value pair with read-only indicator

### Design
- Color theme: slate/navy dark sidebar, light card background
- CSS variables in `src/index.css` (HSL pattern)
- Dark mode support via `.dark` class toggle
- Inter font via Google Fonts

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/admin run dev` — run admin frontend locally

## Important Constraints
- Backend API contracts are fixed — do not redesign endpoints
- Imported/source-owned fields must remain read-only in the UI
- Supplier cabinet must not show other suppliers' data
- URL-state driven filters (search params) preferred over local-only state for pagination/filters
