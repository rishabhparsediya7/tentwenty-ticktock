import { EntryInput, PROJECT_OPTIONS, WORK_TYPE_OPTIONS } from "./types";

export type EntryErrors = Partial<Record<keyof EntryInput, string>>;

const MAX_HOURS_PER_ENTRY = 24;

export function validateEntry(input: Partial<EntryInput>): EntryErrors {
  const errors: EntryErrors = {};

  if (!input.project) {
    errors.project = "Please select a project.";
  } else if (!PROJECT_OPTIONS.includes(input.project as (typeof PROJECT_OPTIONS)[number])) {
    errors.project = "Unknown project.";
  }

  if (!input.typeOfWork) {
    errors.typeOfWork = "Please select a type of work.";
  } else if (
    !WORK_TYPE_OPTIONS.includes(input.typeOfWork as (typeof WORK_TYPE_OPTIONS)[number])
  ) {
    errors.typeOfWork = "Unknown type of work.";
  }

  if (!input.description || input.description.trim().length === 0) {
    errors.description = "Task description is required.";
  }

  if (input.hours === undefined || Number.isNaN(input.hours)) {
    errors.hours = "Hours are required.";
  } else if (input.hours <= 0) {
    errors.hours = "Hours must be greater than 0.";
  } else if (input.hours > MAX_HOURS_PER_ENTRY) {
    errors.hours = `Hours can't exceed ${MAX_HOURS_PER_ENTRY} in a day.`;
  }

  if (!input.date) {
    errors.date = "A date is required.";
  }

  return errors;
}

export function isValidEntry(input: Partial<EntryInput>): input is EntryInput {
  return Object.keys(validateEntry(input)).length === 0;
}
