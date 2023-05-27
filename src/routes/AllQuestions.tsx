import { useTranslation } from 'react-i18next';
import MainContainer from '@components/_common/main-container/MainContainer';
import QuestionItem from '@components/question/question-item/QuestionItem';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import { shortAnswerQuestion } from '@mock/questions';

function AllQuestions() {
  const [t] = useTranslation('translation', { keyPrefix: 'home.question' });

  return (
    <MainContainer>
      <TitleHeader title={t('all_questions') || undefined} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" ph={DEFAULT_MARGIN} gap={20}>
        {/* TODO 나중에 실제 데이터 적용 필요 */}
        {[shortAnswerQuestion].map((question) => (
          <QuestionItem question={question} key={question.id} />
        ))}
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default AllQuestions;
