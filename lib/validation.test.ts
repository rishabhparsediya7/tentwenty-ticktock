import { describe, expect, it } from "vitest";
import { validateEntry, isValidEntry } from "./validation";
import { EntryInput } from "./types";

const validEntry: EntryInput = {
  date: "2024-01-22",
  project: "Mobile App",
  typeOfWork: "Feature",
  description: "Build the login screen",
  hours: 8,
};

describe("validateEntry", () => {
  it("returns no errors for a valid entry", () => {
    expect(validateEntry(validEntry)).toEqual({});
    expect(isValidEntry(validEntry)).toBe(true);
  });

  it("flags every required field when empty", () => {
    const errors = validateEntry({});
    expect(errors.project).toBeDefined();
    expect(errors.typeOfWork).toBeDefined();
    expect(errors.description).toBeDefined();
    expect(errors.hours).toBeDefined();
    expect(errors.date).toBeDefined();
  });

  it("rejects a blank (whitespace-only) description", () => {
    const errors = validateEntry({ ...validEntry, description: "   " });
    expect(errors.description).toBeDefined();
  });

  it("rejects zero, negative, and out-of-range hours", () => {
    expect(validateEntry({ ...validEntry, hours: 0 }).hours).toBeDefined();
    expect(validateEntry({ ...validEntry, hours: -3 }).hours).toBeDefined();
    expect(validateEntry({ ...validEntry, hours: 25 }).hours).toBeDefined();
  });

  it("rejects a project or work type outside the allowed options", () => {
    expect(validateEntry({ ...validEntry, project: "Not a project" }).project).toBeDefined();
    expect(validateEntry({ ...validEntry, typeOfWork: "Nope" }).typeOfWork).toBeDefined();
  });
});
