import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import PromptCard from '@components/_common/prompt/PromptCard';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { Question } from '@models/post';
import { getAllQuestions } from '@utils/apis/question';

function AllQuestions() {
  const [t] = useTranslation('translation');
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

  return (
    <Layout.FlexCol w="100%">
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} pv={14} w="100%" ph={DEFAULT_MARGIN} gap={20}>
        {questions.map((question) => (
          <PromptCard question={question} key={question.id} widthMode="full" />
        ))}
        <div ref={targetRef} />
        {isLoading && (
          <Layout.FlexRow w="100%" h={40}>
            <Loader />
          </Layout.FlexRow>
        )}
        {!isLoading && questions.length < 1 && (
          <NoContents text={t('no_contents.all_questions')} mv={10} />
        )}
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default AllQuestions;
