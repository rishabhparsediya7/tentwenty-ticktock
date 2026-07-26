import { Timesheet, User } from "./types";

export const users: User[] = [
  {
    id: "u1",
    name: "John Doe",
    email: "john@tentwenty.com",
    password: "password123",
  },
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
    entry(`${tsId}-e${i + 1}`, tsId, addDays(startDate, i), project, "Feature", "Development work", 8)
  );
}

export const timesheets: Timesheet[] = [
  {
    id: "ts1",
    weekNumber: 1,
    startDate: "2024-01-01",
    endDate: "2024-01-05",
    entries: [
      entry("e1", "ts1", "2024-01-01", "Homepage Development", "Feature", "Hero section", 8),
      entry("e2", "ts1", "2024-01-02", "Homepage Development", "Feature", "Nav bar", 8),
      entry("e3", "ts1", "2024-01-03", "Homepage Development", "Bug fixes", "Layout fixes", 8),
      entry("e4", "ts1", "2024-01-04", "Homepage Development", "Feature", "Footer", 8),
      entry("e5", "ts1", "2024-01-05", "Homepage Development", "Documentation", "Handoff notes", 8),
    ],
  },
  {
    id: "ts2",
    weekNumber: 2,
    startDate: "2024-01-08",
    endDate: "2024-01-12",
    entries: [
      entry("e6", "ts2", "2024-01-08", "Mobile App", "Feature", "Login flow", 8),
      entry("e7", "ts2", "2024-01-09", "Mobile App", "Feature", "Onboarding", 8),
      entry("e8", "ts2", "2024-01-10", "Mobile App", "Bug fixes", "Crash on launch", 8),
      entry("e9", "ts2", "2024-01-11", "Mobile App", "Meeting", "Sprint planning", 8),
      entry("e10", "ts2", "2024-01-12", "Mobile App", "Feature", "Profile screen", 8),
    ],
  },
  {
    id: "ts3",
    weekNumber: 3,
    startDate: "2024-01-15",
    endDate: "2024-01-19",
    entries: [
      entry("e11", "ts3", "2024-01-15", "Dashboard Redesign", "Feature", "Charts", 8),
      entry("e12", "ts3", "2024-01-16", "Dashboard Redesign", "Research", "Competitor review", 8),
      entry("e13", "ts3", "2024-01-17", "Dashboard Redesign", "Bug fixes", "Filter bug", 8),
    ],
  },
  {
    id: "ts4",
    weekNumber: 4,
    startDate: "2024-01-22",
    endDate: "2024-01-26",
    entries: [
      entry("e14", "ts4", "2024-01-22", "Marketing Website", "Feature", "Blog page", 8),
      entry("e15", "ts4", "2024-01-23", "Marketing Website", "Feature", "SEO tags", 8),
      entry("e16", "ts4", "2024-01-24", "Marketing Website", "Bug fixes", "Broken links", 8),
      entry("e17", "ts4", "2024-01-25", "Marketing Website", "Meeting", "Client review", 8),
      entry("e18", "ts4", "2024-01-26", "Marketing Website", "Documentation", "Release notes", 8),
    ],
  },
  {
    id: "ts5",
    weekNumber: 5,
    startDate: "2024-01-28",
    endDate: "2024-02-01",
    entries: [],
  },
  {
    id: "ts6",
    weekNumber: 6,
    startDate: "2024-02-05",
    endDate: "2024-02-09",
    entries: buildWeek("ts6", "2024-02-05", "Mobile App", 5), // COMPLETED
  },
  {
    id: "ts7",
    weekNumber: 7,
    startDate: "2024-02-12",
    endDate: "2024-02-16",
    entries: buildWeek("ts7", "2024-02-12", "Dashboard Redesign", 2), // INCOMPLETE
  },
  {
    id: "ts8",
    weekNumber: 8,
    startDate: "2024-02-19",
    endDate: "2024-02-23",
    entries: [], // MISSING
  },
  {
    id: "ts9",
    weekNumber: 9,
    startDate: "2024-02-26",
    endDate: "2024-03-01",
    entries: buildWeek("ts9", "2024-02-26", "Marketing Website", 5), // COMPLETED
  },
  {
    id: "ts10",
    weekNumber: 10,
    startDate: "2024-03-04",
    endDate: "2024-03-08",
    entries: buildWeek("ts10", "2024-03-04", "Homepage Development", 4), // INCOMPLETE
  },
  {
    id: "ts11",
    weekNumber: 11,
    startDate: "2024-03-11",
    endDate: "2024-03-15",
    entries: buildWeek("ts11", "2024-03-11", "Mobile App", 5), // COMPLETED
  },
  {
    id: "ts12",
    weekNumber: 12,
    startDate: "2024-03-18",
    endDate: "2024-03-22",
    entries: [], // MISSING
  },
];
