import useSWR from 'swr';
import { archiveEntriesFetcher, ArchiveEntriesResponse } from '@utils/apis/archive';

/**
 * Lightweight hook that returns the viewer-visible `pinned_count` for
 * a friend — pulled off the first page of
 * `GET /user/<username>/check_in/pinned/`.
 *
 * The first-page response is shared with the friend pinned feed's
 * infinite-scroll cache only in URL-string terms; SWR distinguishes
 * `useSWR` and `useSWRInfinite` caches, so we pay one extra fetch to
 * drive the profile chip. Cheap (≤20 rows) and only runs when a
 * username is provided.
 */
export function useFriendPinnedCount(username: string | null | undefined) {
  const key = username ? `/user/${username}/check_in/pinned/` : null;
  const { data, isLoading, mutate } = useSWR<ArchiveEntriesResponse>(key, archiveEntriesFetcher);

  return {
    pinnedCount: data?.pinned_count ?? 0,
    isLoading,
    mutate,
  };
}
