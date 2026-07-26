import { describe, expect, it } from "vitest";
import { deriveStatus, listTimesheets } from "./store";
import { timesheets } from "./mock-data";

// Weeks sorted oldest → newest, so tests can reference concrete ranges from the
// generated (relative-to-today) data instead of hard-coded calendar dates.
const byDate = [...timesheets].sort((a, b) => a.startDate.localeCompare(b.startDate));

function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

describe("deriveStatus", () => {
  it("maps hours to the statuses from the spec", () => {
    // missing = no hours, incomplete = under 40, completed = 40 (or more).
    expect(deriveStatus(0)).toBe("MISSING");
    expect(deriveStatus(1)).toBe("INCOMPLETE");
    expect(deriveStatus(39)).toBe("INCOMPLETE");
    expect(deriveStatus(40)).toBe("COMPLETED");
    expect(deriveStatus(48)).toBe("COMPLETED");
  });
});

describe("listTimesheets filters", () => {
  it("returns every week overlapping a multi-week date range", () => {
    // A range spanning the first three weeks should return all three of them.
    const [w1, w2, w3] = byDate;
    const ids = listTimesheets({ from: w1.startDate, to: w3.endDate }).map((t) => t.id);
    expect(ids).toContain(w1.id);
    expect(ids).toContain(w2.id);
    expect(ids).toContain(w3.id);
  });

  it("returns a single week when the range sits inside it", () => {
    // Weeks are Mon–Fri with a weekend gap, so a mid-week range hits only one week.
    const week = byDate[1];
    const ids = listTimesheets({
      from: addDays(week.startDate, 1),
      to: addDays(week.startDate, 2),
    }).map((t) => t.id);
    expect(ids).toEqual([week.id]);
  });

  it("filters by status", () => {
    const missing = listTimesheets({ status: "MISSING" });
    expect(missing.length).toBeGreaterThan(0);
    expect(missing.every((t) => t.status === "MISSING")).toBe(true);
  });
});
