"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchTimesheets } from "@/lib/api";
import { TimesheetSummary } from "@/lib/types";
import { paginate, totalPages } from "@/lib/pagination";
import { TimesheetTable } from "./TimesheetTable";
import { Filters, TimesheetFilters } from "./TimesheetFilters";
import { Pagination } from "./Pagination";

const EMPTY_FILTERS: Filters = { status: "", from: "", to: "" };
const DEFAULT_PER_PAGE = 5;

export function TimesheetDashboard() {
  const router = useRouter();
  const [rows, setRows] = useState<TimesheetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTimesheets({
        status: filters.status || undefined,
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
    load();
  }, [load]);

  function handleFilterChange(next: Filters) {
    setFilters(next);
    setPage(1);
  }

  function handlePerPageChange(next: number) {
    setPerPage(next);
    setPage(1);
  }

  const pageCount = totalPages(rows.length, perPage);
  const currentPage = Math.min(page, pageCount);
  const pagedRows = paginate(rows, currentPage, perPage);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Your Timesheets</h1>

        <TimesheetFilters value={filters} onChange={handleFilterChange} />

        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
            {error}
            <button onClick={load} className="ml-2 font-semibold text-red-700 underline">
              Retry
            </button>
          </div>
        ) : (
          <>
            <TimesheetTable
              rows={pagedRows}
              onAction={(sheet) => router.push(`/dashboard/${sheet.id}`)}
            />
            {rows.length > 0 && (
              <Pagination
                page={currentPage}
                perPage={perPage}
                totalItems={rows.length}
                onPageChange={setPage}
                onPerPageChange={handlePerPageChange}
              />
            )}
          </>
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
