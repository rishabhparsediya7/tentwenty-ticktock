import { EntryErrors } from "./validation";
import { EntryInput, TimesheetEntry, TimesheetStatus, TimesheetSummary } from "./types";

export interface TimesheetDetail extends TimesheetSummary {
  entries: TimesheetEntry[];
}

export class ApiError extends Error {
  errors?: EntryErrors;
  status: number;
  constructor(message: string, status: number, errors?: EntryErrors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function handle<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(body.error ?? "Request failed", res.status, body.errors);
  }
  return body.data as T;
}

export interface ListParams {
  status?: TimesheetStatus;
  from?: string;
  to?: string;
}

export async function fetchTimesheets(params: ListParams = {}): Promise<TimesheetSummary[]> {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.from) qs.set("from", params.from);
  if (params.to) qs.set("to", params.to);
  const query = qs.toString();
  const res = await fetch(`/api/timesheets${query ? `?${query}` : ""}`);
  return handle<TimesheetSummary[]>(res);
}

export async function fetchTimesheet(id: string): Promise<TimesheetDetail> {
  const res = await fetch(`/api/timesheets/${id}`);
  return handle<TimesheetDetail>(res);
}

export async function createEntry(
  timesheetId: string,
  input: EntryInput
): Promise<TimesheetEntry> {
  const res = await fetch(`/api/timesheets/${timesheetId}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handle<TimesheetEntry>(res);
}

export async function updateEntryRequest(
  timesheetId: string,
  entryId: string,
  input: EntryInput
): Promise<TimesheetEntry> {
  const res = await fetch(`/api/timesheets/${timesheetId}/entries/${entryId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handle<TimesheetEntry>(res);
}

export async function deleteEntryRequest(
  timesheetId: string,
  entryId: string
): Promise<void> {
  const res = await fetch(`/api/timesheets/${timesheetId}/entries/${entryId}`, {
    method: "DELETE",
  });
  await handle<{ id: string }>(res);
}
