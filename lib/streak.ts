const DAY_MS = 24 * 60 * 60 * 1000;

function localDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateApplicationStreak(
  appliedDates: Array<string | null>,
  now = new Date(),
) {
  const dates = [...new Set(appliedDates.filter((date): date is string => Boolean(date)))].sort();
  if (!dates.length) return 0;

  const lastDate = parseDateOnly(dates[dates.length - 1]);
  const daysSinceLastApplication = Math.round(
    (localDay(now).getTime() - lastDate.getTime()) / DAY_MS,
  );

  // Keep yesterday's streak during the current day. It resets only after a
  // complete calendar day has passed without an application.
  if (daysSinceLastApplication > 1) return 0;

  const dateSet = new Set(dates);
  let streak = 0;
  const cursor = new Date(lastDate);
  while (dateSet.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
