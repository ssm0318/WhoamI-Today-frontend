import { useState } from 'react';
import { Note } from '@models/post';
import { getAllFeed } from '@utils/apis/feed';
import useInfiniteScroll from './useInfiniteScroll';

// remove
const useInfiniteFetchFeeds = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [nextPage, setNextPage] = useState<string | null | undefined>(undefined);

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextPage === null) return setIsLoading(false);
    await fetchFeed(nextPage === undefined ? null : nextPage);
  });

  const fetchFeed = async (page: string | null) => {
    const { results, next } = await getAllFeed(page);
    if (!results) return;
    setNextPage(next);
    setNotes([...notes, ...results]);
    setIsLoading(false);
  };

  return {
    isLoading,
    targetRef,
    fetchFeed,
    notes,
  };
};

export default useInfiniteFetchFeeds;
