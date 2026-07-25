// Server-side data access. Wraps the mock data with the small amount of business
// logic the API routes need (status derivation, CRUD on entries). Importing this
// from a React component would pull mock data into the client bundle, so it stays
// server-only and is used exclusively by app/api/** route handlers.

import { timesheets, users } from "./mock-data";
import {
  EntryInput,
  FULL_WEEK_HOURS,
  Timesheet,
  TimesheetEntry,
  TimesheetStatus,
  TimesheetSummary,
} from "./types";

let nextEntryId = 1000;

export function deriveStatus(totalHours: number): TimesheetStatus {
  if (totalHours <= 0) return "MISSING";
  if (totalHours >= FULL_WEEK_HOURS) return "COMPLETED";
  return "INCOMPLETE";
}

export function totalHours(timesheet: Timesheet): number {
  return timesheet.entries.reduce((sum, e) => sum + e.hours, 0);
}

export function toSummary(timesheet: Timesheet): TimesheetSummary {
  const hours = totalHours(timesheet);
  return {
    id: timesheet.id,
    weekNumber: timesheet.weekNumber,
    startDate: timesheet.startDate,
    endDate: timesheet.endDate,
    totalHours: hours,
    status: deriveStatus(hours),
  };
}

export function validateCredentials(email: string, password: string) {
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) return null;
  // Never leak the password back out.
  return { id: user.id, name: user.name, email: user.email };
}

export interface ListFilters {
  status?: TimesheetStatus;
  /** ISO date — include weeks overlapping [from, to]. */
  from?: string;
  to?: string;
}

/** Two ranges overlap if each starts on or before the other ends. */
function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return aStart <= bEnd && bStart <= aEnd;
}

export function listTimesheets(filters: ListFilters = {}): TimesheetSummary[] {
  return timesheets
    .filter((ts) => {
      if (filters.from && filters.to) {
        // Show every week overlapping the selected range, per the spec note.
        if (!overlaps(ts.startDate, ts.endDate, filters.from, filters.to)) return false;
      }
      if (filters.status && deriveStatus(totalHours(ts)) !== filters.status) return false;
      return true;
    })
    .map(toSummary);
}

export function getTimesheet(id: string): Timesheet | undefined {
  return timesheets.find((ts) => ts.id === id);
}

export function addEntry(timesheetId: string, input: EntryInput): TimesheetEntry | null {
  const ts = getTimesheet(timesheetId);
  if (!ts) return null;
  const created: TimesheetEntry = {
    id: `e${nextEntryId++}`,
    timesheetId,
    ...input,
  };
  ts.entries.push(created);
  return created;
}

export function updateEntry(
  timesheetId: string,
  entryId: string,
  input: EntryInput
): TimesheetEntry | null {
  const ts = getTimesheet(timesheetId);
  if (!ts) return null;
  const target = ts.entries.find((e) => e.id === entryId);
  if (!target) return null;
  Object.assign(target, input);
  return target;
}

export function deleteEntry(timesheetId: string, entryId: string): boolean {
  const ts = getTimesheet(timesheetId);
  if (!ts) return false;
  const before = ts.entries.length;
  ts.entries = ts.entries.filter((e) => e.id !== entryId);
  return ts.entries.length < before;
}
