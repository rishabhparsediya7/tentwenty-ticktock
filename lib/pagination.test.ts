import { describe, expect, it } from "vitest";
import { DOTS, getPageNumbers, paginate, totalPages } from "./pagination";

const items = Array.from({ length: 12 }, (_, i) => i + 1);

describe("paginate", () => {
  it("returns the slice for the requested page", () => {
    expect(paginate(items, 1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(paginate(items, 2, 5)).toEqual([6, 7, 8, 9, 10]);
    expect(paginate(items, 3, 5)).toEqual([11, 12]); // last, partial page
  });
});

describe("totalPages", () => {
  it("rounds up and is at least 1", () => {
    expect(totalPages(12, 5)).toBe(3);
    expect(totalPages(10, 5)).toBe(2);
    expect(totalPages(0, 5)).toBe(1);
  });
});

describe("getPageNumbers", () => {
  it("lists every page when they fit without eliding", () => {
    expect(getPageNumbers(1, 3)).toEqual([1, 2, 3]);
  });

  it("elides on the right near the start", () => {
    expect(getPageNumbers(1, 99)).toEqual([1, 2, 3, 4, 5, DOTS, 99]);
  });

  it("elides on both sides in the middle", () => {
    expect(getPageNumbers(50, 99)).toEqual([1, DOTS, 49, 50, 51, DOTS, 99]);
  });

  it("elides on the left near the end", () => {
    expect(getPageNumbers(99, 99)).toEqual([1, DOTS, 95, 96, 97, 98, 99]);
  });
});
