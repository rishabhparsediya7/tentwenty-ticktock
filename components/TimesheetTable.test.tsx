import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimesheetTable } from "./TimesheetTable";
import { TimesheetSummary } from "@/lib/types";

const rows: TimesheetSummary[] = [
  { id: "ts1", weekNumber: 1, startDate: "2024-01-01", endDate: "2024-01-05", totalHours: 40, status: "COMPLETED" },
  { id: "ts3", weekNumber: 3, startDate: "2024-01-15", endDate: "2024-01-19", totalHours: 24, status: "INCOMPLETE" },
  { id: "ts5", weekNumber: 5, startDate: "2024-01-28", endDate: "2024-02-01", totalHours: 0, status: "MISSING" },
];

describe("TimesheetTable", () => {
  it("renders a status-appropriate action label for each row", () => {
    render(<TimesheetTable rows={rows} onAction={vi.fn()} />);
    expect(screen.getByRole("button", { name: "View" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("formats the week date range", () => {
    render(<TimesheetTable rows={rows} onAction={vi.fn()} />);
    expect(screen.getByText("1 - 5 January, 2024")).toBeInTheDocument();
    expect(screen.getByText("28 January - 1 February, 2024")).toBeInTheDocument();
  });

  it("calls onAction with the row when its action is clicked", async () => {
    const onAction = vi.fn();
    render(<TimesheetTable rows={rows} onAction={onAction} />);
    await userEvent.click(screen.getByRole("button", { name: "Create" }));
    expect(onAction).toHaveBeenCalledWith(rows[2]);
  });

  it("shows an empty state when there are no rows", () => {
    render(<TimesheetTable rows={[]} onAction={vi.fn()} />);
    expect(screen.getByText(/no timesheets match/i)).toBeInTheDocument();
  });
});
