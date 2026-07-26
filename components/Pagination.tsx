"use client";

import { DOTS, getPageNumbers, totalPages as computeTotalPages } from "@/lib/pagination";

interface PaginationProps {
  page: number;
  perPage: number;
  totalItems: number;
  perPageOptions?: number[];
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

const DEFAULT_PER_PAGE_OPTIONS = [5, 10, 20];

export function Pagination({
  page,
  perPage,
  totalItems,
  perPageOptions = DEFAULT_PER_PAGE_OPTIONS,
  onPageChange,
  onPerPageChange,
}: PaginationProps) {
  const pageCount = computeTotalPages(totalItems, perPage);
  const pages = getPageNumbers(page, pageCount);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
      <div className="relative">
        <select
          aria-label="Rows per page"
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3.5 pr-9 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/40"
        >
          {perPageOptions.map((n) => (
            <option key={n} value={n}>
              {n} per page
            </option>
          ))}
        </select>
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <nav
        aria-label="Pagination"
        className="inline-flex items-center divide-x divide-gray-200 overflow-hidden rounded-lg border border-gray-200"
      >
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-2 text-sm font-medium text-tertiary hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        {pages.map((p, i) =>
          p === DOTS ? (
            <span
              key={`dots-${i}`}
              className="min-w-[3rem] select-none px-4 py-2 text-center text-sm text-gray-400"
            >
              {DOTS}
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={`min-w-[3rem] px-4 py-2 text-center text-sm cursor-pointer ${
                p === page
                  ? "bg-brand/5 font-semibold text-text-brand"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-2 text-sm font-medium text-tertiary hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </nav>
    </div>
  );
}
