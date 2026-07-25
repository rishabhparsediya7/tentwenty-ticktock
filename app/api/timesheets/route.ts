import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { listTimesheets } from "@/lib/store";
import { TimesheetStatus } from "@/lib/types";

const VALID_STATUSES: TimesheetStatus[] = ["COMPLETED", "INCOMPLETE", "MISSING"];

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const statusParam = searchParams.get("status");
  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;

  const status =
    statusParam && VALID_STATUSES.includes(statusParam as TimesheetStatus)
      ? (statusParam as TimesheetStatus)
      : undefined;

  const data = listTimesheets({ status, from, to });
  return NextResponse.json({ data });
}
