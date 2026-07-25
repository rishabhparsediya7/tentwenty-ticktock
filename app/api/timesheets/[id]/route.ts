// GET /api/timesheets/[id] — full timesheet with its entries and computed status.
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getTimesheet, toSummary } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const timesheet = getTimesheet(id);
  if (!timesheet) {
    return NextResponse.json({ error: "Timesheet not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: { ...toSummary(timesheet), entries: timesheet.entries },
  });
}
