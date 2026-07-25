// PUT/DELETE /api/timesheets/[id]/entries/[entryId] — edit or remove an entry.
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteEntry, updateEntry } from "@/lib/store";
import { validateEntry } from "@/lib/validation";
import { EntryInput } from "@/lib/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, entryId } = await params;
  const body = (await request.json().catch(() => ({}))) as Partial<EntryInput>;
  const errors = validateEntry(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", errors }, { status: 422 });
  }

  const updated = updateEntry(id, entryId, body as EntryInput);
  if (!updated) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }
  return NextResponse.json({ data: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; entryId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, entryId } = await params;
  const ok = deleteEntry(id, entryId);
  if (!ok) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }
  return NextResponse.json({ data: { id: entryId } });
}
