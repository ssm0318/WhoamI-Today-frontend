import useSWRInfinite from 'swr/infinite';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { PaginationResponse } from '@models/api/common';
import axios from '@utils/apis/axios';

const fetcher = async <T>(url: string) => {
  const { data } = await axios.get<PaginationResponse<T[]>>(url);
  return data;
};

interface Props {
  key: string;
}

export function useSWRInfiniteScroll<T>({ key }: Props) {
  const getKey = (pageIndex: number, previousPageData: PaginationResponse<T[]>) => {
    if (previousPageData && !previousPageData.next) return null; // 끝에 도달

    const [pathname, search] = key.split('?');
    const searchParams = [search, `page=${pageIndex + 1}`].join('&');
    return [pathname, searchParams].join('?'); // SWR 키
  };

  const { isLoading, data, size, mutate, setSize } = useSWRInfinite(getKey, fetcher<T>);

  const isEndPage = data && !data[size - 1]?.next;
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');

  const fetchNextData = async () => {
    if (isEndPage) return;
    setSize((prevSize) => prevSize + 1);
  };

  const { targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(() => {
    fetchNextData();
    setIsLoading(false);
  });

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
