"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FieldError, Label, Select, Textarea } from "@/components/ui/Field";
import {
  EntryInput,
  PROJECT_OPTIONS,
  TimesheetEntry,
  WORK_TYPE_OPTIONS,
} from "@/lib/types";
import { EntryErrors, validateEntry } from "@/lib/validation";
import { ApiError, createEntry, updateEntryRequest } from "@/lib/api";

interface EntryModalProps {
  timesheetId: string;
  /** ISO date the entry is filed under. */
  date: string;
  /** When provided, the modal edits this entry instead of creating a new one. */
  entry?: TimesheetEntry;
  onClose: () => void;
  onSaved: () => void;
}

const emptyForm = (date: string): EntryInput => ({
  date,
  project: "",
  typeOfWork: "",
  description: "",
  hours: 8,
});

export function EntryModal({ timesheetId, date, entry, onClose, onSaved }: EntryModalProps) {
  const isEdit = !!entry;
  const [form, setForm] = useState<EntryInput>(
    entry
      ? {
          date: entry.date,
          project: entry.project,
          typeOfWork: entry.typeOfWork,
          description: entry.description,
          hours: entry.hours,
        }
      : emptyForm(date)
  );
  const [errors, setErrors] = useState<EntryErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Close on Escape for keyboard accessibility.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function setField<K extends keyof EntryInput>(key: K, value: EntryInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    // Clear a field's error as soon as the user edits it.
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const validationErrors = validateEntry(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit && entry) {
        await updateEntryRequest(timesheetId, entry.id, form);
      } else {
        await createEntry(timesheetId, form);
      }
      onSaved();
      onClose();
    } catch (err) {
      // Surface server-side field errors, or a generic message otherwise.
      if (err instanceof ApiError && err.errors) {
        setErrors(err.errors);
      }
      setFormError(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="entry-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 id="entry-modal-title" className="text-lg font-bold text-gray-900">
            {isEdit ? "Edit Entry" : "Add New Entry"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5" noValidate>
          {formError && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600"
            >
              {formError}
            </div>
          )}

          <div className="mb-4">
            <Label htmlFor="project">Select Project *</Label>
            <Select
              id="project"
              value={form.project}
              error={errors.project}
              onChange={(e) => setField("project", e.target.value)}
            >
              <option value="" disabled>
                Project Name
              </option>
              {PROJECT_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
            <FieldError message={errors.project} />
          </div>

          <div className="mb-4">
            <Label htmlFor="typeOfWork">Type of Work *</Label>
            <Select
              id="typeOfWork"
              value={form.typeOfWork}
              error={errors.typeOfWork}
              onChange={(e) => setField("typeOfWork", e.target.value)}
            >
              <option value="" disabled>
                Bug fixes
              </option>
              {WORK_TYPE_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </Select>
            <FieldError message={errors.typeOfWork} />
          </div>

          <div className="mb-4">
            <Label htmlFor="description">Task description *</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Write text here ..."
              value={form.description}
              error={errors.description}
              onChange={(e) => setField("description", e.target.value)}
            />
            {errors.description ? (
              <FieldError message={errors.description} />
            ) : (
              <p className="mt-1 text-xs text-gray-400">A note for extra info</p>
            )}
          </div>

          <div className="mb-6">
            <Label htmlFor="hours">Hours *</Label>
            <div className="flex items-center gap-0">
              <button
                type="button"
                aria-label="Decrease hours"
                onClick={() => setField("hours", Math.max(0, form.hours - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-l-lg border border-gray-300 bg-gray-50 text-lg text-gray-700 hover:bg-gray-100"
              >
                −
              </button>
              <input
                id="hours"
                type="number"
                min={0}
                value={form.hours}
                onChange={(e) => setField("hours", Number(e.target.value))}
                className="h-11 w-16 border-y border-gray-300 text-center text-sm text-gray-900 focus:outline-none"
                aria-invalid={!!errors.hours}
              />
              <button
                type="button"
                aria-label="Increase hours"
                onClick={() => setField("hours", form.hours + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-r-lg border border-gray-300 bg-gray-50 text-lg text-gray-700 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <FieldError message={errors.hours} />
          </div>

          <div className="flex gap-3">
            <Button type="submit" loading={submitting} className="flex-1">
              {isEdit ? "Save changes" : "Add entry"}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
