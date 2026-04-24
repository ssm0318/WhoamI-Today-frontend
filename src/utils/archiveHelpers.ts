import {
  differenceInCalendarDays,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
  startOfDay,
} from 'date-fns';
import i18n from '@i18n/index';
import { CheckInComponentEntry } from '@models/checkInEntry';

/**
 * Compact timestamp rendered in each archive card's top-left corner.
 *
 * Relative for recent entries (matches `Today at HH:mm` / `Nh ago` / `Nd ago`),
 * absolute for older ones. Entries older than 7 days fall back to the
 * existing localized short-date format so the user gets a concrete
 * date ("Mar 12") once relative time loses meaning.
 */
export function formatEntryTimestamp(createdAt: string, now: Date = new Date()): string {
  const d = new Date(createdAt);
  const mins = differenceInMinutes(now, d);
  const hours = differenceInHours(now, d);
  const days = differenceInDays(now, d);

  if (mins < 1) return i18n.t('time.just_a_moment_ago');
  if (hours < 1) return i18n.t('time.short.minute', { count: mins });
  if (hours < 24) return i18n.t('time.short.hour', { count: hours });
  if (days < 7) return i18n.t('time.short.day', { count: days });

  // >= 7d: absolute short date. Uses the locale-aware formatter the rest
  // of the app relies on so KO/EN stay consistent.
  if (i18n.language.startsWith('ko')) {
    return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
  }
  return format(d, 'MMM d');
}

/**
 * Section header label for a given day in the archive feed.
 *
 * - Same calendar day as today → "Today"
 * - Exactly 1 day ago → "Yesterday"
 * - Same calendar year → short month + day ("Mar 12")
 * - Older → includes the year ("Mar 12, 2024")
 */
export function formatDateSectionLabel(date: Date, now: Date = new Date()): string {
  const daysDiff = differenceInCalendarDays(now, date);
  if (daysDiff === 0) return i18n.t('archive.today');
  if (daysDiff === 1) return i18n.t('archive.yesterday');

  const sameYear = date.getFullYear() === now.getFullYear();
  if (i18n.language.startsWith('ko')) {
    return date.toLocaleDateString('ko-KR', {
      year: sameYear ? undefined : 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return format(date, sameYear ? 'MMM d' : 'MMM d, yyyy');
}

export interface ArchiveDateSection {
  /** ISO date (yyyy-MM-dd) — stable key for React. */
  key: string;
  label: string;
  items: CheckInComponentEntry[];
}

/**
 * Group entries by calendar day (local time), newest day first. Within
 * each day the input order is preserved; callers should pass entries
 * that are already sorted by `created_at` desc.
 */
export function groupEntriesByDate(
  entries: CheckInComponentEntry[],
  now: Date = new Date(),
): ArchiveDateSection[] {
  const buckets = new Map<string, CheckInComponentEntry[]>();
  entries.forEach((entry) => {
    const day = startOfDay(new Date(entry.created_at));
    const key = format(day, 'yyyy-MM-dd');
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.push(entry);
    } else {
      buckets.set(key, [entry]);
    }
  });
  // Map insertion order is the iteration order, and we fed it in
  // newest-first, so the resulting sections are already sorted.
  return Array.from(buckets, ([key, items]) => ({
    key,
    label: formatDateSectionLabel(new Date(key), now),
    items,
  }));
}
