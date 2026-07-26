import { describe, expect, it } from "vitest";
import { deriveStatus, listTimesheets } from "./store";

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
    const weeks = listTimesheets({ from: "2024-01-03", to: "2024-01-16" }).map(
      (t) => t.weekNumber
    );
    // Week 1 (Jan 1–5) and week 3 (Jan 15–19) partially overlap; week 2 is inside.
    expect(weeks).toEqual([1, 2, 3]);
  });

  it("returns a single week when the range sits inside it", () => {
    const weeks = listTimesheets({ from: "2024-01-16", to: "2024-01-17" }).map(
      (t) => t.weekNumber
    );
    expect(weeks).toEqual([3]);
  });

  it("filters by status", () => {
    const missing = listTimesheets({ status: "MISSING" });
    expect(missing.length).toBeGreaterThan(0);
    expect(missing.every((t) => t.status === "MISSING")).toBe(true);
  });
});
