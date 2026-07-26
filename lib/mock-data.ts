import { Timesheet, User } from "./types";

export const users: User[] = [
  {
    id: "u1",
    name: "John Doe",
    email: "john@tentwenty.com",
    password: "password123",
  },
];

const WORK_TYPES = ["Feature", "Bug fixes", "Meeting", "Research", "Documentation"];
const DESCRIPTIONS = [
  "Homepage development",
  "Fixed layout issues",
  "Sprint planning",
  "API integration",
  "Release notes",
];
const PROJECTS = [
  "Homepage Development",
  "Mobile App",
  "Dashboard Redesign",
  "Marketing Website",
];

function entry(
  id: string,
  timesheetId: string,
  date: string,
  project: string,
  typeOfWork: string,
  description: string,
  hours: number
) {
  return { id, timesheetId, date, project, typeOfWork, description, hours };
}

function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function buildWeek(tsId: string, startDate: string, project: string, filledDays: number) {
  return Array.from({ length: filledDays }, (_, i) =>
    entry(
      `${tsId}-e${i + 1}`,
      tsId,
      addDays(startDate, i),
      project,
      WORK_TYPES[i % WORK_TYPES.length],
      DESCRIPTIONS[i % DESCRIPTIONS.length],
      8
    )
  );
}

function startOfWeek(base: Date): Date {
  const d = new Date(Date.UTC(base.getFullYear(), base.getMonth(), base.getDate()));
  const dow = d.getUTCDay(); // 0 = Sunday … 6 = Saturday
  const toMonday = dow === 0 ? -6 : 1 - dow;
  d.setUTCDate(d.getUTCDate() + toMonday);
  return d;
}

function isoWeekNumber(d: Date): number {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (t.getUTCDay() + 6) % 7; // Monday = 0
  t.setUTCDate(t.getUTCDate() - dayNum + 3); // shift to the Thursday of this week
  const firstThursday = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  return 1 + Math.round((t.getTime() - firstThursday.getTime()) / (7 * 86_400_000));
}

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

const WEEK_PLAN = [3, 5, 5, 4, 5, 0, 5, 5, 2, 5, 5, 0];

const currentMonday = startOfWeek(new Date());

export const timesheets: Timesheet[] = WEEK_PLAN.map((filledDays, i) => {
  const monday = new Date(currentMonday);
  monday.setUTCDate(monday.getUTCDate() - i * 7); // i = 0 → current week
  const friday = new Date(monday);
  friday.setUTCDate(friday.getUTCDate() + 4);

  const id = `ts${i}`;
  const startDate = isoDate(monday);
  const project = PROJECTS[i % PROJECTS.length];

  return {
    id,
    weekNumber: isoWeekNumber(monday),
    startDate,
    endDate: isoDate(friday),
    entries: buildWeek(id, startDate, project, filledDays),
  };
});
