import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { EntryModal } from "./EntryModal";
import { WORK_TYPE_OPTIONS } from "@/lib/types";

function renderModal() {
  render(
    <EntryModal
      timesheetId="ts0"
      date="2026-07-20"
      onClose={vi.fn()}
      onSaved={vi.fn()}
    />
  );
}

describe("EntryModal defaults", () => {
  it("defaults Type of Work to a real option so it isn't a silently-invalid placeholder", () => {
    // Regression: the field used to *display* "Bug fixes" while its value was "",
    // which blocked submission for a user who didn't touch it.
    renderModal();
    const select = screen.getByLabelText(/type of work/i) as HTMLSelectElement;
    expect(select.value).toBe(WORK_TYPE_OPTIONS[0]);
    expect(select.value).not.toBe("");
  });

  it("keeps Project empty so it must be chosen explicitly", () => {
    renderModal();
    const select = screen.getByLabelText(/select project/i) as HTMLSelectElement;
    expect(select.value).toBe("");
  });
});
