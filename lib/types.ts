export type TimesheetStatus = "COMPLETED" | "INCOMPLETE" | "MISSING";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
} 

export interface TimesheetEntry {
  id: string;
  timesheetId: string;
  date: string; /** ISO date (YYYY-MM-DD). */
  project: string;
  typeOfWork: string;
  description: string;
  hours: number;
}

export interface Timesheet {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  entries: TimesheetEntry[];
}

export interface TimesheetSummary {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalHours: number;
  status: TimesheetStatus;
}

export interface EntryInput {
  date: string;
  project: string;
  typeOfWork: string;
  description: string;
  hours: number;
}

export const PROJECT_OPTIONS = [
  "Homepage Development",
  "Mobile App",
  "Dashboard Redesign",
  "Marketing Website",
] as const;

export const WORK_TYPE_OPTIONS = [
  "Bug fixes",
  "Feature",
  "Meeting",
  "Research",
  "Documentation",
] as const;

export const FULL_WEEK_HOURS = 40;
