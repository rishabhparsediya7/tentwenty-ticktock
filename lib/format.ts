const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m: m - 1, d };
}

export function formatWeekRange(startIso: string, endIso: string): string {
  const s = parts(startIso);
  const e = parts(endIso);
  const startLabel =
    s.m === e.m ? `${s.d}` : `${s.d} ${MONTHS[s.m]}`;
  return `${startLabel} - ${e.d} ${MONTHS[e.m]}, ${e.y}`;
}

export function formatShortDay(iso: string): string {
  const { m, d } = parts(iso);
  return `${MONTHS[m].slice(0, 3)} ${d}`;
}

export function eachDayInRange(startIso: string, endIso: string): string[] {
  const days: string[] = [];
  const start = new Date(`${startIso}T00:00:00Z`);
  const end = new Date(`${endIso}T00:00:00Z`);
  for (let d = start; d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}
