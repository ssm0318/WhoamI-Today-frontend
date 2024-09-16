import { useState } from 'react';
import { Question } from '@models/post';
import { getAllQuestions } from '@utils/apis/question';
import useInfiniteScroll from './useInfiniteScroll';

const useInfiniteFetchQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [nextPage, setNextPage] = useState<string | null | undefined>(undefined);

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextPage === null) return setIsLoading(false);
    await fetchQuestions(nextPage === undefined ? null : nextPage);
  });

  const fetchQuestions = async (page: string | null) => {
    const { results, next } = await getAllQuestions(page);
    if (!results) return;
    setNextPage(next);
    setQuestions([...questions, ...results]);
    setIsLoading(false);
  };

  return {
    isLoading,
    targetRef,
    fetchQuestions,
    questions,
  };
};

export default useInfiniteFetchQuestions;
