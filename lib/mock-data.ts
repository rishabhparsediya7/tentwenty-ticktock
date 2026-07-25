// In-memory mock data. This simulates a database and is ONLY imported by the
// internal API routes (app/api/**) — never by React components directly.
// Mutations from the API routes persist for the lifetime of the server process.

import { Timesheet, User } from "./types";

export const users: User[] = [
  {
    id: "u1",
    name: "John Doe",
    email: "john@tentwenty.com",
    password: "password123",
  },
];

// Helper to keep the entry fixtures compact.
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

// Five weeks of January 2024, mirroring the statuses shown in the Figma:
// week 1 & 2 & 4 = 40h (COMPLETED), week 3 = 24h (INCOMPLETE), week 5 = 0h (MISSING).
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
];
