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

### Admin Pages — full operator surface (not just CRUD)
**Operations**
- `/admin` — Dashboard

**Каталог**
- `/admin/events` + `/:id` — source-aware events with inventorySource/salesMode/syncStatus, override indicators, SEO+quality issues, tabs (Обзор / Источник&Sync / Контент / SEO / Качество / Аудит)
- `/admin/venues` + `/:id`, `/admin/cities` + `/:id`
- `/admin/categories` — hierarchical tree with subcategories

**Продажи**
- `/admin/orders` + `/:id` — channel + inventory owner + payment provider columns, dual visibility flags (ЛК покупателя / ЛК поставщика), buyer-link icons, tabs (Обзор / Канал&провайдер / Билеты / Возвраты / Аудит)
- `/admin/refunds` + `/:id` — dedicated refund queue with decision flow
- `/admin/users` + `/:id` — buyer accounts with order history
- `/admin/reviews` — moderation queue

**Партнёры**
- `/admin/suppliers` + `/:id` — list shows Тип/Роль (import_only | internal | api) + ЛК активен/нет; detail shows role badge, role description alert, ЛК activation status, and integration summary (when role ≠ internal) with link to Integrations
- `/admin/integrations` — connected sources (Ticketon mirror, Ticketscloud API, etc.) with sync status, diagnostics, frequency; managed centrally in admin (NOT in supplier cabinet)

**Маркетинг**
- `/admin/landings` + `/:id`, `/admin/promo-blocks` + `/:id`
- `/admin/articles` + `/:id` — blog management
- `/admin/collections` + `/:id` — event collections with ordering
- `/admin/seo-audit` — aggregated SEO issues across events/landings/venues/articles with score

**Поддержка / Система**
- `/admin/support` + `/:id` — ticket inbox with priority + reply flow
- `/admin/logs` — system events (sync, checkout, payment, audit) with level/source filters
- `/admin/settings`

### Supplier Cabinet Pages (only for suppliers with cabinetActive=true)
- `/supplier` — Dashboard
- `/supplier/events` + `/:id` — manual vs imported vs hybrid awareness; imported events show read-only Lock alert + dedicated «Запрос на коррекцию» tab
- `/supplier/orders` — Own orders
- `/supplier/refunds` — Refund requests on supplier's events (read-only — admin decides)
- `/supplier/profile`, `/supplier/reports`, `/supplier/support`
- Note: Integrations management is admin-only — suppliers do not configure their own integrations.

### Supplier Roles (`SupplierRole`)
- `import_only` — events come from external mirror; **ЛК не активен** (no cabinet user). Shown in admin only.
- `internal` — supplier creates events themselves in own cabinet; **полный ЛК**.
- `api` — events arrive via partner API; **ЛК опционален** (cabinetActive flag determines if they can log in to view orders/reports).

### Shared Components (`src/components/`)
- `layout/AdminLayout.tsx`, `SupplierLayout.tsx`, `Topbar.tsx`
- `layout/AdminSidebar.tsx` — grouped sections (Operations / Каталог / Продажи / Партнёры / Маркетинг / Поддержка / Система)
- `layout/SupplierSidebar.tsx` — grouped supplier nav including Integrations + Refunds
- `shared/StatCard.tsx`, `DataTable.tsx`, `StatusBadge.tsx`, `PageHeader.tsx` (accepts ReactNode description), `FilterBar.tsx`, `DetailField.tsx`
- `shared/SourceBadge.tsx` — `InventorySource` (manual|imported|api|hybrid) + `SalesMode` (internal_checkout|external_redirect|mirror|hybrid) badges
- `shared/SyncStatusBadge.tsx` — sync status pill (ok|stale|error|syncing|never)
- `shared/SupplierRoleBadge.tsx` — role badge for supplier type (import_only|internal|api) with tooltip description
- `shared/IssueList.tsx` + `IssueCount` — typed issues (critical|warning|info) for SEO/quality surfaces
- `shared/Tabs.tsx` — tab strip used in event/order detail tabs

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
