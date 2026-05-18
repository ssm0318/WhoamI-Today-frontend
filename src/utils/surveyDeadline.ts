import { Cadence } from '@models/survey';

const DEADLINE_TIME_ZONE = 'America/Los_Angeles';
const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface FormatRemainingDeadlineOptions {
  now?: Date;
  locale?: string;
  formatHoursLeft?: (hours: number) => string;
  formatClosesWeekday?: (weekday: string) => string;
  formatDueToday?: () => string;
  formatDueWeekday?: (weekday: string) => string;
}

export function formatRemainingDeadline(
  windowEnd: string | null,
  cadence: Cadence,
  _allowLate: boolean,
  options: FormatRemainingDeadlineOptions = {},
): string | null {
  if (!windowEnd) return null;

  const now = options.now ?? new Date();
  const endDate = parseIsoDate(windowEnd);
  const closeAt = getSurveyCloseAt(windowEnd);
  if (!endDate || !closeAt || closeAt.getTime() <= now.getTime()) return null;

  if (cadence !== 'daily') {
    if (formatDateInZone(now, DEADLINE_TIME_ZONE) === windowEnd) {
      return options.formatDueToday?.() ?? 'Due today';
    }
    const weekday = formatWeekday(endDate, options.locale ?? 'en-US');
    return (
      options.formatDueWeekday?.(weekday) ??
      options.formatClosesWeekday?.(weekday) ??
      `Due ${weekday}`
    );
  }

  const hoursLeft = Math.max(1, Math.ceil((closeAt.getTime() - now.getTime()) / MS_PER_HOUR));
  return options.formatHoursLeft?.(hoursLeft) ?? `${hoursLeft}h left`;
}

export function shouldShowNoLateAcceptedBadge(
  windowEnd: string | null,
  allowLate: boolean,
): boolean {
  return Boolean(windowEnd && !allowLate);
}

function parseIsoDate(value: string): Date | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const [, year, month, day] = match;
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12));
}

function getSurveyCloseAt(windowEnd: string): Date | null {
  const endDate = parseIsoDate(windowEnd);
  if (!endDate) return null;

  const closeDay = new Date(endDate.getTime() + MS_PER_DAY);
  return zonedTimeToDate(
    closeDay.getUTCFullYear(),
    closeDay.getUTCMonth() + 1,
    closeDay.getUTCDate(),
    7,
    DEADLINE_TIME_ZONE,
  );
}

function zonedTimeToDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  timeZone: string,
): Date {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour));
  const offset = getTimeZoneOffset(utcGuess, timeZone);
  return new Date(utcGuess.getTime() - offset);
}

function getTimeZoneOffset(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );

  return asUtc - date.getTime();
}

function formatWeekday(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    timeZone: DEADLINE_TIME_ZONE,
  }).format(date);
}

function formatDateInZone(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}
