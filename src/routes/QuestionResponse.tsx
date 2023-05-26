import MainContainer from '@components/_common/main-container/MainContainer';
import QuestionItem from '@components/response/question-item/QuestionItem';
import ResponseInput from '@components/response/response-input/ResponseInput';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Layout } from '@design-system';

function QuestionResponse() {
  return (
    <MainContainer>
      {/* TitleHeader 추가 */}
      <Layout.FlexCol w="100%" ph={DEFAULT_MARGIN}>
        <QuestionItem />
        <ResponseInput />
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default QuestionResponse;
