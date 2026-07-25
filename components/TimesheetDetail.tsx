"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { deleteEntryRequest, fetchTimesheet, TimesheetDetail as Detail } from "@/lib/api";
import { FULL_WEEK_HOURS, TimesheetEntry } from "@/lib/types";
import { eachDayInRange, formatShortDay, formatWeekRange } from "@/lib/format";
import { EntryModal } from "./EntryModal";
import { EntryRow } from "./EntryRow";

// Which entry the modal is editing / which day a new entry is being added to.
type ModalState = { date: string; entry?: TimesheetEntry } | null;

export function TimesheetDetail({ id }: { id: string }) {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setDetail(await fetchTimesheet(id));
    } catch {
      setError("Couldn't load this timesheet. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function handleDelete(entry: TimesheetEntry) {
    // Optimistic UX would be nicer, but a reload keeps the derived total honest.
    await deleteEntryRequest(id, entry.id).catch(() => {});
    load();
  }

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !detail) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          {error ?? "Not found."}
          <button onClick={load} className="ml-2 font-semibold text-red-700 underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const days = eachDayInRange(detail.startDate, detail.endDate);
  const percent = Math.min(100, Math.round((detail.totalHours / FULL_WEEK_HOURS) * 100));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="mb-1 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="mb-2 inline-block text-sm font-medium text-gray-400 hover:text-gray-600"
            >
              ← Back to timesheets
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">This week&apos;s timesheet</h1>
            <p className="mt-1 text-sm text-gray-400">
              {formatWeekRange(detail.startDate, detail.endDate)}
            </p>
          </div>

          {/* Progress toward the 40h week */}
          <div className="w-52">
            <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
              <span className="font-medium text-gray-700">
                {detail.totalHours}/{FULL_WEEK_HOURS} hrs
              </span>
              <span>{percent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-orange-400 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {days.map((day) => {
            const dayEntries = detail.entries.filter((e) => e.date === day);
            return (
              <div key={day} className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                <div className="w-16 shrink-0 pt-3 text-sm font-semibold text-gray-700">
                  {formatShortDay(day)}
                </div>
                <div className="flex-1 space-y-2">
                  {dayEntries.map((entry) => (
                    <EntryRow
                      key={entry.id}
                      entry={entry}
                      onEdit={() => setModal({ date: day, entry })}
                      onDelete={() => handleDelete(entry)}
                    />
                  ))}
                  <button
                    onClick={() => setModal({ date: day })}
                    className="w-full rounded-lg border border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 hover:border-brand hover:text-brand"
                  >
                    + Add new task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="mt-6 text-center text-sm text-gray-400">
        © 2024 tentwenty. All rights reserved.
      </footer>

      {modal && (
        <EntryModal
          timesheetId={id}
          date={modal.date}
          entry={modal.entry}
          onClose={() => setModal(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6" aria-hidden>
      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-8">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-100" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
