import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import MainContainer from '@components/_common/main-container/MainContainer';
import QuestionItem from '@components/question/question-item/QuestionItem';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { ShortAnswerQuestion } from '@models/post';
import { getAllQuestions } from '@utils/apis/questions';

function AllQuestions() {
  const [t] = useTranslation('translation', { keyPrefix: 'home.question' });
  const [questions, setQuestions] = useState<ShortAnswerQuestion[]>([]);
  const [nextPage, setNextPage] = useState<string | null | undefined>(undefined);

  const fetchQuestions = async (page: string | null) => {
    const { results, next } = await getAllQuestions(page);
    if (!results) return;
    setNextPage(next);
    setQuestions([...questions, ...results]);
    setIsLoading(false);
  };

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextPage === null) return setIsLoading(false);
    await fetchQuestions(nextPage === undefined ? null : nextPage);
  });

  return (
    <MainContainer>
      <TitleHeader title={t('all_questions')} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} pv={14} w="100%" ph={DEFAULT_MARGIN} gap={20}>
        {questions.map((question) => (
          <QuestionItem question={question} key={question.id} />
        ))}
        <div ref={targetRef} />
        {isLoading && (
          <Layout.FlexRow w="100%" h={40}>
            <Loader />
          </Layout.FlexRow>
        )}
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default AllQuestions;
