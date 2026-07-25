"use client";

import { useState } from "react";
import { TimesheetStatus } from "@/lib/types";
import { formatShortDay } from "@/lib/format";

export interface Filters {
  status: TimesheetStatus | "";
  from: string;
  to: string;
}

interface TimesheetFiltersProps {
  value: Filters;
  onChange: (next: Filters) => void;
}

function Chevron() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="shrink-0 text-gray-400"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function TimesheetFilters({ value, onChange }: TimesheetFiltersProps) {
  const [rangeOpen, setRangeOpen] = useState(false);
  const hasRange = value.from && value.to;
  const rangeLabel = hasRange
    ? `${formatShortDay(value.from)} – ${formatShortDay(value.to)}`
    : "Date Range";

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      {/* Date Range — dropdown pill opening a from/to popover */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setRangeOpen((o) => !o)}
          aria-haspopup="dialog"
          aria-expanded={rangeOpen}
          className="flex w-40 max-w-[152px] items-center justify-between gap-2.5 rounded-lg border border-gray-300 bg-white p-3 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/40"
        >
          <span className={hasRange ? "text-gray-800" : "text-gray-500"}>
            {rangeLabel}
          </span>
          <Chevron />
        </button>

        {rangeOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setRangeOpen(false)} />
            <div className="absolute left-0 z-20 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
              <div className="mb-3">
                <label className="mb-1 block text-xs font-medium text-gray-500">From</label>
                <input
                  type="date"
                  value={value.from}
                  max={value.to || undefined}
                  onChange={(e) => onChange({ ...value, from: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium text-gray-500">To</label>
                <input
                  type="date"
                  value={value.to}
                  min={value.from || undefined}
                  onChange={(e) => onChange({ ...value, to: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => onChange({ ...value, from: "", to: "" })}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setRangeOpen(false)}
                  className="text-sm font-semibold text-brand hover:underline"
                >
                  Done
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Status — dropdown pill (native select styled to match) */}
      <div className="relative">
        <select
          value={value.status}
          onChange={(e) =>
            onChange({ ...value, status: e.target.value as TimesheetStatus | "" })
          }
          className={`w-40 max-w-[152px] appearance-none rounded-lg border border-gray-300 bg-white p-3 gap-2.5 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/40 ${
            value.status ? "text-gray-800" : "text-gray-500"
          }`}
        >
          <option value="">Status</option>
          <option value="COMPLETED">Completed</option>
          <option value="INCOMPLETE">Incomplete</option>
          <option value="MISSING">Missing</option>
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <Chevron />
        </span>
      </div>
    </div>
  );
}
