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

  const cell =
    "min-w-9 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium transition-colors";

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

      <nav aria-label="Pagination" className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={`${cell} text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          Previous
        </button>

        {pages.map((p, i) =>
          p === DOTS ? (
            <span key={`dots-${i}`} className="px-2 text-sm text-gray-400">
              {DOTS}
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={`${cell} ${
                p === page
                  ? "border-brand/30 bg-brand/5 text-brand"
                  : "text-gray-600 hover:bg-gray-50"
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
          className={`${cell} text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          Next
        </button>
      </nav>
    </div>
  );
}
