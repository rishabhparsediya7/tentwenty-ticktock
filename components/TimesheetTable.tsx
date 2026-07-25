import { TimesheetStatus, TimesheetSummary } from "@/lib/types";
import { formatWeekRange } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

const ACTION_LABEL: Record<TimesheetStatus, string> = {
  COMPLETED: "View",
  INCOMPLETE: "Update",
  MISSING: "Create",
};

interface TimesheetTableProps {
  rows: TimesheetSummary[];
  onAction: (timesheet: TimesheetSummary) => void;
}

export function TimesheetTable({ rows, onAction }: TimesheetTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 p-10 text-center text-sm text-gray-500">
        No timesheets match your filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-gray-50 text-xs font-medium text-gray-500">
          <tr>
            <th className="px-6 py-3.5">WEEK #</th>
            <th className="px-6 py-3.5">DATE</th>
            <th className="px-6 py-3.5">STATUS</th>
            <th className="px-6 py-3.5 text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50/60">
              <td className="px-6 py-4 font-medium text-gray-700">{row.weekNumber}</td>
              <td className="px-6 py-4 text-gray-600">
                {formatWeekRange(row.startDate, row.endDate)}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onAction(row)}
                  className="font-semibold text-brand hover:underline"
                >
                  {ACTION_LABEL[row.status]}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
