import QuestionItem from '@components/response/question-item/QuestionItem';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout } from '@design-system';
import { MultipleChoiceQuestion } from '@models/post';

interface MultipleChoiceResponseProps {
  questions: MultipleChoiceQuestion[];
}

function MultipleChoiceResponse({ questions }: MultipleChoiceResponseProps) {
  return (
    <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" ph={DEFAULT_MARGIN} gap={60}>
      {questions.map((question) => (
        <Layout.FlexCol key={question.id} w="100%">
          <QuestionItem question={question} />
          <Layout.FlexCol gap={12} mt={24} alignItems="center" w="100%">
            {question.answerList.map((answer) => (
              <Layout.FlexRow key={answer.value}>
                <Font.Body type="20_regular">{answer.text}</Font.Body>
              </Layout.FlexRow>
            ))}
          </Layout.FlexCol>
        </Layout.FlexCol>
      ))}
    </Layout.FlexCol>
  );
}

export default MultipleChoiceResponse;
