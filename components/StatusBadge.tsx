import { TimesheetStatus } from "@/lib/types";

const STYLES: Record<TimesheetStatus, string> = {
  COMPLETED: "bg-status-completed-bg text-status-completed-fg",
  INCOMPLETE: "bg-status-incomplete-bg text-status-incomplete-fg",
  MISSING: "bg-status-missing-bg text-status-missing-fg",
};

const LABELS: Record<TimesheetStatus, string> = {
  COMPLETED: "COMPLETED",
  INCOMPLETE: "INCOMPLETE",
  MISSING: "MISSING",
};

export function StatusBadge({ status }: { status: TimesheetStatus }) {
  return (
    <span
      className={`inline-flex rounded px-2.5 py-1 text-xs font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
