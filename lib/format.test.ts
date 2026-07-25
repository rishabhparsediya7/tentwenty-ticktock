import { describe, expect, it } from "vitest";
import { formatWeekRange, formatShortDay } from "./format";

describe("formatWeekRange", () => {
  it("omits the repeated month within a single month", () => {
    expect(formatWeekRange("2024-01-01", "2024-01-05")).toBe("1 - 5 January, 2024");
  });

  it("shows both months when the week crosses a boundary", () => {
    expect(formatWeekRange("2024-01-28", "2024-02-01")).toBe(
      "28 January - 1 February, 2024"
    );
  });
});

describe("formatShortDay", () => {
  it("formats an ISO date as an abbreviated day label", () => {
    expect(formatShortDay("2024-01-21")).toBe("Jan 21");
  });
});
