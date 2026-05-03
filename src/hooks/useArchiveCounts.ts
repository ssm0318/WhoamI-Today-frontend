import useSWR from 'swr';
import { archiveEntriesFetcher, ArchiveEntriesResponse } from '@utils/apis/archive';

/**
 * Lightweight SWR hook that surfaces `history_count` + `pinned_count`
 * from the owner history endpoint's first page.
 *
 * Used by the profile's chip so the count is always current without
 * spinning up the full infinite-scroll hook.
 */
export function useArchiveCounts() {
  const { data, isLoading, mutate } = useSWR<ArchiveEntriesResponse>(
    '/check_in/entries/',
    archiveEntriesFetcher,
  );

  return {
    historyCount: data?.history_count ?? data?.archived_count ?? 0,
    pinnedCount: data?.pinned_count ?? 0,
    isLoading,
    mutate,
  };
}
