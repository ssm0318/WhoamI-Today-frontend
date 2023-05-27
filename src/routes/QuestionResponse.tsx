import { useLocation, useParams } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import QuestionItem from '@components/response/question-item/QuestionItem';
import ResponseInput from '@components/response/response-input/ResponseInput';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout } from '@design-system';

function QuestionResponse() {
  const { questionId } = useParams();
  const location = useLocation();
  const question = String(location.state.question);

  const handleResponse = () => {
    // TODO 작성이 완료되었고, 질문 보내기 창 한번 띄워줌
    console.log(questionId);
  };

  return (
    <MainContainer>
      <TitleHeader
        RightComponent={
          <button type="button" onClick={handleResponse}>
            <Font.Display type="18_bold">Post</Font.Display>
          </button>
        }
      />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" ph={DEFAULT_MARGIN}>
        <QuestionItem question={question} />
        <ResponseInput />
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default QuestionResponse;
