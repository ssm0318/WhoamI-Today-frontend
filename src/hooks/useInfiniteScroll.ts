import { RefObject, useCallback, useEffect, useRef } from 'react';

/**
 * @param onIntersectCallback // 데이터를 추가로 로드하기 위해 fetchData 함수 호출
 * @returns // targetRef
 * @example
 * const handleIntersection = () => {
 *      Intersection Observer 콜백에서 호출되는 함수
 *      데이터를 추가로 로드하기 위해 fetchData 함수 호출
 *      fetchData();
 * };
 * const targetRef = useInfiniteScroll<HTMLDivElement>(handleIntersection);
 */
const useInfiniteScroll = <T extends HTMLElement>(
  onIntersectCallback: () => void,
): RefObject<T> => {
  const targetRef = useRef<T>(null);

  const onIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      console.log(21, entry);
      if (entry.isIntersecting) {
        onIntersectCallback();
      }
    },
    [onIntersectCallback],
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

  return targetRef;
};

export default useInfiniteScroll;
