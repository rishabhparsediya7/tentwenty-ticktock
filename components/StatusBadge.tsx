import { TimesheetStatus } from "@/lib/types";
import { Badge, BadgeTheme } from "./ui/Badge";

const STATUS_THEME: Record<TimesheetStatus, BadgeTheme> = {
  COMPLETED: "green",
  INCOMPLETE: "yellow",
  MISSING: "pink",
};

export function StatusBadge({ status }: { status: TimesheetStatus }) {
  return <Badge theme={STATUS_THEME[status]} text={status} size="small" />;
}
