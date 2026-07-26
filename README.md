# ticktock — Timesheet Management

A timesheet management app where a user logs in, views their weekly timesheets with a
status computed from logged hours, and adds, edits, or deletes time entries.

## Features

- **Login** — email/password authentication via next-auth (Credentials provider). The
  session token is stored in an httpOnly cookie and never exposed to client JS. Invalid
  credentials show an inline error; on success the user is redirected to the dashboard.
- **Protected routes** — the dashboard and timesheet APIs require an authenticated
  session; unauthenticated visitors are redirected to the login page.
- **Dashboard table** — Week #, Date, Status, and Actions. Status is derived from logged
  hours: `COMPLETED` (40h), `INCOMPLETE` (1–39h), `MISSING` (0h). The action label
  reflects the status: View / Update / Create.
- **Filters** — filter by status and by a from/to date range. A date range that spans
  multiple weeks returns every overlapping week.
- **Pagination** — per-page selector (5 / 10 / 20) and page controls with ellipsis.
- **Week detail** — a per-week view with entries grouped by day, a 40-hour progress bar,
  a per-entry Edit / Delete menu, and an "Add new task" action for each day.
- **Add / Edit entry modal** — project, type of work, task description, and an hours
  stepper, with validation and error handling on both the client and the API.
- **Responsive UI** with loading, error, and empty states.

## Tech stack

- **Next.js** (App Router) + **React**
- **TypeScript**
- **Tailwind CSS**
- **next-auth** (Credentials provider, JWT session)
- **Vitest** + **React Testing Library**

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create the env file and add an auth secret
cp .env.example .env.local
# then set AUTH_SECRET — generate one with: openssl rand -base64 33

# 3. Run the dev server
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build
npm test             # run the test suite
npm run lint         # lint
```

### Demo credentials

The login form is pre-filled with these:

```
Email:    john@tentwenty.com
Password: password123
```

## API routes

All data flows through internal API routes; components never read mock data directly.
Every route requires an authenticated session.

| Method   | Route                                    | Purpose                              |
| -------- | ---------------------------------------- | ------------------------------------ |
| `GET`    | `/api/timesheets`                        | List weeks (`?status`, `?from`, `?to`) |
| `GET`    | `/api/timesheets/[id]`                   | One week with its entries            |
| `POST`   | `/api/timesheets/[id]/entries`           | Add an entry                         |
| `PUT`    | `/api/timesheets/[id]/entries/[entryId]` | Update an entry                      |
| `DELETE` | `/api/timesheets/[id]/entries/[entryId]` | Delete an entry                      |

Data flow:

```
component → lib/api.ts → /api/* route handler → lib/store.ts → lib/mock-data.ts
```

## Project structure

```
app/
  login/page.tsx                 login screen
  dashboard/page.tsx             timesheet list
  dashboard/[id]/page.tsx        week detail
  api/                           auth + timesheet route handlers
auth.ts                          next-auth configuration
proxy.ts                         route protection
components/
  ui/                            Button, Field, Badge primitives
  Header, StatusBadge, TimesheetTable, TimesheetFilters, Pagination,
  TimesheetDashboard, TimesheetDetail, EntryRow, EntryModal
lib/
  types.ts                       shared domain types
  mock-data.ts                   in-memory data (API-only)
  store.ts                       status derivation + entry CRUD
  validation.ts                  entry validation (client + server)
  pagination.ts                  page slicing + page-number logic
  api.ts                         client fetch helpers
  format.ts                      date formatting
```

## Testing

```bash
npm test
```

Covers status derivation, date-range filtering, entry validation, pagination logic, the
timesheet table, the pagination controls, the badge, and the entry modal's defaults.

## Assumptions & notes

- **Dummy authentication** with one seeded user. The password is stored in plaintext
  because this is a demo; real auth would hash it and use a real user store.
- **Data is in-memory** and mutated by the API routes. It persists while the server is
  running and resets on restart — no database was in scope.
- **Weeks are generated relative to today**, newest first, so a visitor lands on the
  current week with recent weeks already filled in.
- **Status is derived** from logged hours rather than stored, so it stays in sync with
  the entries.
- **Pagination is client-side** — the list endpoint returns all filtered weeks and the
  dashboard pages them in memory.
- Dates are treated as plain calendar dates (parsed as UTC) so the displayed day does
  not shift with the viewer's timezone.

## Time spent

~5 hours.
