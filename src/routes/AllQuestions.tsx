import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import MainContainer from '@components/_common/main-container/MainContainer';
import QuestionItem from '@components/question/question-item/QuestionItem';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { shortAnswerQuestions } from '@mock/questions';
import { ShortAnswerQuestion } from '@models/post';

function AllQuestions() {
  const [t] = useTranslation('translation', { keyPrefix: 'home.question' });
  // TODO 나중에 실제 데이터 적용 필요 및 테스트 코드 제거
  const [questions, setQuestions] = useState<ShortAnswerQuestion[]>(shortAnswerQuestions);
  const [fetchCount, setFetchCount] = useState(0);

  const fetchMoreQuestions = async () => {
    setTimeout(() => {
      const newQuestions = shortAnswerQuestions.map((q) => {
        return { ...q, id: q.id + 15 * (fetchCount + 1) };
      });
      setQuestions([...questions, ...newQuestions]);
      setFetchCount((prev) => prev + 1);
      setIsLoading(false);
    }, 1000);
  };

  const { targetRef, isLoading, setIsLoading } =
    useInfiniteScroll<HTMLDivElement>(fetchMoreQuestions);

  return (
    <MainContainer>
      <TitleHeader title={t('all_questions') || undefined} />
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
