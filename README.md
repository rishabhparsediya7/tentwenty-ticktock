# ticktock — Timesheet Management App

A small SaaS-style timesheet manager built for the TenTwenty front-end technical
assessment. Users log in, see their weekly timesheets with a computed status, and
add/edit/delete time entries through a validated modal.

> **Scope note:** This is the **lean v1**. It covers the full login → dashboard →
> add/edit entry flow end to end. A few screens from the Figma are intentionally
> deferred — see [Deferred to v2](#deferred-to-v2).

## Tech stack

| Concern        | Choice                                             |
| -------------- | -------------------------------------------------- |
| Framework      | Next.js 16 (App Router) + React 19                 |
| Language       | TypeScript                                         |
| Styling        | Tailwind CSS v4                                     |
| Auth           | next-auth v5 (Auth.js), Credentials provider (JWT) |
| Data           | In-memory mock data behind internal API routes     |
| Testing        | Vitest + React Testing Library                      |
| Font           | Inter (`next/font`)                                 |

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create your env file and add an auth secret
cp .env.example .env.local
# then set AUTH_SECRET — generate one with:
#   openssl rand -base64 33

# 3. Run the dev server
npm run dev        # http://localhost:3000

# Other scripts
npm run build      # production build
npm test           # run the test suite
npm run lint       # eslint
```

> A working `.env.local` with a generated `AUTH_SECRET` is required for next-auth.
> `.env.local` is gitignored; `.env.example` shows the shape.

### Demo credentials

The login form is **pre-filled** with these for convenience:

```
Email:    john@tentwenty.com
Password: password123
```

## What's implemented

- **Login** — email/password with next-auth Credentials provider. The session is a
  JWT stored in an httpOnly cookie (token kept in the session, never exposed to JS).
  Invalid credentials show an inline error. On success → redirect to the dashboard.
- **Route protection** — the dashboard is gated by `proxy.ts` (Next 16's middleware
  convention) via next-auth's `authorized` callback. Unauthenticated users are sent
  to `/login`; the protected API returns `401`.
- **Dashboard table** — Week #, Date, Status, Actions. The status is **derived from
  logged hours** (`COMPLETED` = 40h, `INCOMPLETE` = 1–39h, `MISSING` = 0h) and the
  action label follows it (`View` / `Update` / `Create`).
- **Filters** — status filter and a from/to date range. Per the brief, a range that
  spans multiple weeks returns **every overlapping week**. Filtering happens on the
  server (in the API route).
- **Pagination** — a per-page selector (5 / 10 / 20) and page controls with ellipsis
  (`1 2 3 … 99`). Changing a filter or page size resets to page one, and the page is
  clamped if the row count shrinks. The mock data spans 12 weeks so it actually pages.
- **Week detail screen** (`/dashboard/[id]`) — "This week's timesheet" with a 40h
  progress bar, entries grouped per day (Mon–Fri), a per-row overflow menu
  (Edit / Delete), and an "+ Add new task" action on each day. Row actions on the
  dashboard navigate here.
- **Add / Edit Entry modal** — project, type of work, task description, and an hours
  stepper, with **client + server validation** and error handling. Saving refreshes
  the view (status/progress recompute automatically).
- **UX states** — loading skeletons, error state with retry, empty state, keyboard
  (Esc-to-close) and click-away on the modal/menus, responsive layout down to mobile.

## Architecture

The brief requires that **client code never touches mock data directly** — all data
flows through internal API routes. That layering is the backbone of the structure:

```
Component  ──►  lib/api.ts  ──►  /api/* route handler  ──►  lib/store.ts  ──►  mock-data.ts
 (client)      (fetch client)     (server, auth-gated)      (business logic)   (fixtures)
```

```
app/
  layout.tsx                     root layout (Inter font + SessionProvider)
  page.tsx                       redirects based on auth
  login/page.tsx                 login screen
  dashboard/page.tsx             dashboard (Header + TimesheetDashboard)
  dashboard/[id]/page.tsx        week detail screen (per-day entries)
  api/
    auth/[...nextauth]/route.ts  next-auth handlers
    timesheets/route.ts          GET list (+ status / date-range filters)
    timesheets/[id]/route.ts     GET one week with entries
    timesheets/[id]/entries/…    POST create, PUT update, DELETE entry
auth.ts                          next-auth config (Credentials provider)
proxy.ts                         route protection (Next 16 middleware)
components/
  ui/                            Button, Field, Badge primitives
  Header, StatusBadge, TimesheetTable, TimesheetFilters, Pagination,
  TimesheetDashboard, TimesheetDetail, EntryRow, EntryModal
lib/
  types.ts                       shared domain types + option lists
  mock-data.ts                   in-memory fixtures (API-only)
  store.ts                       status derivation + CRUD (server-only)
  validation.ts                  shared form validation (client + server)
  pagination.ts                  page-slicing + ellipsis logic
  api.ts                         client fetch helpers
  format.ts                      date/label formatting
```

### API endpoints

| Method   | Route                                    | Purpose                          |
| -------- | ---------------------------------------- | -------------------------------- |
| `GET`    | `/api/timesheets`                        | List summaries (`?status`, `?from`, `?to`) |
| `GET`    | `/api/timesheets/[id]`                   | One week with its entries        |
| `POST`   | `/api/timesheets/[id]/entries`           | Add an entry                     |
| `PUT`    | `/api/timesheets/[id]/entries/[entryId]` | Update an entry                  |
| `DELETE` | `/api/timesheets/[id]/entries/[entryId]` | Delete an entry                  |

All are auth-gated and return `{ data }` on success or `{ error, errors? }` on failure.

## Testing

```bash
npm test
```

29 tests across 7 files covering the highest-value, framework-agnostic logic:

- `lib/store.test.ts` — status derivation at the boundaries + date-range overlap filtering
- `lib/validation.test.ts` — entry validation rules (required fields, hour bounds, allowed options)
- `lib/pagination.test.ts` — page slicing and the page-number/ellipsis logic
- `lib/format.test.ts` — week-range and day formatting
- `components/TimesheetTable.test.tsx` — status→action mapping, date rendering, click handling, empty state
- `components/Pagination.test.tsx` — Previous/Next enablement, active page, per-page changes
- `components/ui/Badge.test.tsx` — theme/text/close-icon props

## Assumptions & notes

- **Dummy auth** with one seeded user; the password is stored in plaintext in the
  mock data purely because it's a demo. Real auth would hash + use a real user store.
- **Data is in-memory.** Entries you add/edit persist while the server runs and reset
  on restart — appropriate for a mock-data assessment (no DB was in scope).
- Status is **always derived** from hours rather than stored, so it can't drift out
  of sync with the entries.
- Dates are treated as plain calendar dates (parsed as UTC) so the displayed day
  never shifts with the viewer's timezone.
- Dashboard row actions (`View` / `Update` / `Create`) all navigate to the same
  week detail screen; the label just reflects the week's status.
- **Pagination is client-side** — the list endpoint returns all filtered weeks and
  the dashboard pages them in memory. Fine at this scale; a larger dataset would move
  `page`/`perPage` into the API query.

## Deferred to v2

Deliberately out of scope for the lean version, to keep it focused and correct:

- Broader test coverage (modal submit flow, API route handlers).
- Server-side pagination and sorting.

## Time spent

~4 hours (setup + API layer + UI + tests + docs).
