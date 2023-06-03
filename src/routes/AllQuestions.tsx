import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainContainer from '@components/_common/main-container/MainContainer';
import QuestionItem from '@components/question/question-item/QuestionItem';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { fetchShortAnswerQuestionsAsync, shortAnswerQuestions } from '@mock/questions';
import { ShortAnswerQuestion } from '@models/post';

function AllQuestions() {
  const [t] = useTranslation('translation', { keyPrefix: 'home.question' });
  // TODO 나중에 실제 데이터 적용 필요
  const [questions, setQuestions] = useState<ShortAnswerQuestion[]>(shortAnswerQuestions);

  const fetchMoreQuestions = async () => {
    const data = await fetchShortAnswerQuestionsAsync(shortAnswerQuestions);
    setQuestions([...questions, ...data]);
  };

  const targetRef = useInfiniteScroll<HTMLDivElement>(fetchMoreQuestions);

  return (
    <MainContainer>
      <TitleHeader title={t('all_questions') || undefined} />
      <Layout.FlexCol
        mt={TITLE_HEADER_HEIGHT}
        pv={14}
        w="100%"
        ph={DEFAULT_MARGIN}
        gap={20}
        outline="ERROR"
      >
        {questions.map((question) => (
          <QuestionItem question={question} key={question.id} />
        ))}
        <div ref={targetRef} />
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default AllQuestions;
