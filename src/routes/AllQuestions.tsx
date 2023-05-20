import MainContainer from '@components/_common/main-container/MainContainer';
import QuestionItem from '@components/question/question-item/QuestionItem';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';

const questions = [
  { id: 1, title: 'question1' },
  { id: 2, title: 'question2' },
  { id: 3, title: 'question3' },
  { id: 4, title: 'question4' },
];

function AllQuestions() {
  return (
    <MainContainer>
      <TitleHeader title="Questions" />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" ph={DEFAULT_MARGIN} gap={20}>
        {questions.map((question) => (
          <QuestionItem {...question} key={question.id} />
        ))}
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default AllQuestions;
