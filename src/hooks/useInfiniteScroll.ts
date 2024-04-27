import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

/**
 * @example
 * const handleIntersection = () => {
 *      Intersection Observer 콜백에서 호출되는 함수
 *      데이터를 추가로 로드하기 위해 fetchData 함수 호출
 *      fetchData();
 * };
 * const { targetRef, isLoading, setIsLoading  } = useInfiniteScroll<HTMLDivElement>(handleIntersection);
 */
const useInfiniteScroll = <T extends HTMLElement>(
  onIntersectCallback: () => void,
): { targetRef: RefObject<T>; isLoading: boolean; setIsLoading: (isLoading: boolean) => void } => {
  const targetRef = useRef<T>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onIntersect = useCallback(
    async ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && !isLoading) {
        setIsLoading(true);
        onIntersectCallback();
      }
    },
    [isLoading, onIntersectCallback],
  );

  useEffect(() => {
    let observer: IntersectionObserver | undefined;
    const { current } = targetRef;
    if (current) {
      observer = new IntersectionObserver(onIntersect, { threshold: 1 });
      observer.observe(current);
    }
    return () => observer?.disconnect();
  }, [onIntersect]);

  return { targetRef, isLoading, setIsLoading };
};

export default useInfiniteScroll;
