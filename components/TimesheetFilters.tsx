import { TimesheetStatus } from "@/lib/types";
import { Select } from "./ui/Field";

export interface Filters {
  status: TimesheetStatus | "";
  from: string;
  to: string;
}

interface TimesheetFiltersProps {
  value: Filters;
  onChange: (next: Filters) => void;
}

export function TimesheetFilters({ value, onChange }: TimesheetFiltersProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end gap-3">
      <div className="flex flex-col">
        <label className="mb-1 text-xs font-medium text-gray-500">From</label>
        <input
          type="date"
          value={value.from}
          onChange={(e) => onChange({ ...value, from: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-xs font-medium text-gray-500">To</label>
        <input
          type="date"
          value={value.to}
          onChange={(e) => onChange({ ...value, to: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
        />
      </div>
      <div className="flex w-40 flex-col">
        <label className="mb-1 text-xs font-medium text-gray-500">Status</label>
        <Select
          value={value.status}
          onChange={(e) =>
            onChange({ ...value, status: e.target.value as TimesheetStatus | "" })
          }
        >
          <option value="">All statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="INCOMPLETE">Incomplete</option>
          <option value="MISSING">Missing</option>
        </Select>
      </div>
      {(value.from || value.to || value.status) && (
        <button
          onClick={() => onChange({ status: "", from: "", to: "" })}
          className="py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
      )}
    </div>
  );
}
