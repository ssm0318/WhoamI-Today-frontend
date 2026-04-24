import { useCallback, useEffect } from 'react';
import useSWRInfinite from 'swr/infinite';
import useInfiniteScroll from '@hooks/useInfiniteScroll';

/**
 * Generic cursor-paginated infinite-scroll hook.
 *
 * Unlike {@link useSWRInfiniteScroll} which appends `?page=N` for DRF's
 * PageNumberPagination, this variant follows the opaque `next` URL that
 * DRF's CursorPagination returns. Use this for endpoints backed by
 * CursorPagination such as `/check_in/entries/` and
 * `/user/<username>/check_in/pinned/`.
 *
 * `baseKey` is the first-page key (e.g. `/check_in/entries/?tab=all`).
 * Subsequent pages use the full `next` URL from the previous page.
 */
export interface CursorPage<T> {
  /** Server may omit `results` on empty responses — treat as [] in the client. */
  results?: T[];
  next: string | null;
  previous: string | null;
}

interface Props<T, R extends CursorPage<T>> {
  baseKey: string | null;
  fetcher: (key: string) => Promise<R>;
}

export function useSWRInfiniteCursor<T, R extends CursorPage<T> = CursorPage<T>>({
  baseKey,
  fetcher,
}: Props<T, R>) {
  const getKey = (pageIndex: number, previousPageData: R | null) => {
    if (!baseKey) return null;
    if (pageIndex === 0) return baseKey;
    if (!previousPageData?.next) return null;
    return previousPageData.next;
  };

  const { isLoading, data, size, mutate, setSize } = useSWRInfinite<R>(getKey, fetcher, {
    revalidateAll: true,
  });

  const isEndPage = Boolean(data && !data[size - 1]?.next);
  const isLoadingMore =
    isLoading ||
    (size > 0 &&
      data &&
      typeof data[size - 1] === 'undefined' &&
      data[data.length - 1]?.next !== null);

  const handleIntersect = useCallback(() => {
    if (isEndPage) return;
    setSize((prev) => prev + 1);
  }, [isEndPage, setSize]);

  const { targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(handleIntersect);

  useEffect(() => {
    if (!isLoadingMore) setIsLoading(false);
  }, [isLoadingMore, setIsLoading]);

  return {
    targetRef,
    isLoading,
    isLoadingMore,
    data,
    size,
    isEndPage,
    mutate,
    setSize,
  };
}
