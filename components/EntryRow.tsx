"use client";

import { useState } from "react";
import { TimesheetEntry } from "@/lib/types";

interface EntryRowProps {
  entry: TimesheetEntry;
  onEdit: () => void;
  onDelete: () => void;
}

/** A single task row with an overflow menu for Edit / Delete. */
export function EntryRow({ entry, onEdit, onDelete }: EntryRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
      <span className="flex-1 truncate text-sm text-gray-800">{entry.description}</span>
      <span className="shrink-0 text-sm text-gray-400">{entry.hours} hrs</span>
      <span className="shrink-0 rounded bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
        {entry.project}
      </span>

      <div className="relative shrink-0">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Entry actions"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="px-1.5 text-gray-400 hover:text-gray-600"
        >
          ⋯
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 z-20 mt-1 w-32 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit();
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
