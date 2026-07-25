"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchTimesheets } from "@/lib/api";
import { TimesheetSummary } from "@/lib/types";
import { TimesheetTable } from "./TimesheetTable";
import { Filters, TimesheetFilters } from "./TimesheetFilters";

const EMPTY_FILTERS: Filters = { status: "", from: "", to: "" };

export function TimesheetDashboard() {
  const router = useRouter();
  const [rows, setRows] = useState<TimesheetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTimesheets({
        status: filters.status || undefined,
        // The range filter only applies when both ends are set.
        from: filters.from && filters.to ? filters.from : undefined,
        to: filters.from && filters.to ? filters.to : undefined,
      });
      setRows(data);
    } catch {
      setError("Couldn't load timesheets. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // Fetching from our API is exactly the external-system sync effects are for;
    // the loading-state update inside load() is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Your Timesheets</h1>

        <TimesheetFilters value={filters} onChange={setFilters} />

        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
            {error}
            <button
              onClick={load}
              className="ml-2 font-semibold text-red-700 underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <TimesheetTable
            rows={rows}
            onAction={(sheet) => router.push(`/dashboard/${sheet.id}`)}
          />
        )}
      </div>

      <footer className="mt-6 text-center text-sm text-gray-400">
        © 2024 tentwenty. All rights reserved.
      </footer>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
      ))}
    </div>
  );
}
