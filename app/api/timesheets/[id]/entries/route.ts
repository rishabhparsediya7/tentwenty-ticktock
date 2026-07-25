// POST /api/timesheets/[id]/entries — add a new entry to a week.
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { addEntry, getTimesheet } from "@/lib/store";
import { validateEntry } from "@/lib/validation";
import { EntryInput } from "@/lib/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!getTimesheet(id)) {
    return NextResponse.json({ error: "Timesheet not found" }, { status: 404 });
  }

  const body = (await request.json().catch(() => ({}))) as Partial<EntryInput>;
  const errors = validateEntry(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", errors }, { status: 422 });
  }

  const created = addEntry(id, body as EntryInput);
  return NextResponse.json({ data: created }, { status: 201 });
}
