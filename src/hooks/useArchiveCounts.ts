import useSWR from 'swr';
import { archiveEntriesFetcher, ArchiveEntriesResponse } from '@utils/apis/archive';

/**
 * Lightweight SWR hook that surfaces `archived_count` + `pinned_count`
 * from the owner archive endpoint's first page.
 *
 * Used by the profile's `[ All | Pinned (N) ]` segmented chip so the
 * count is always current without spinning up the full infinite-scroll
 * hook. The first-page response is 20 rows at most; we only read the
 * two counts off it, but the full payload stays cached by SWR so the
 * archive screen doesn't pay a second fetch when the user taps in.
 */
export function useArchiveCounts() {
  const { data, isLoading, mutate } = useSWR<ArchiveEntriesResponse>(
    '/check_in/entries/',
    archiveEntriesFetcher,
  );

  return {
    archivedCount: data?.archived_count ?? 0,
    pinnedCount: data?.pinned_count ?? 0,
    isLoading,
    mutate,
  };
}
