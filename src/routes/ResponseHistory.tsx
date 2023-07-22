import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import SendQuestionModal from '@components/question/send-question-modal/SendQuestionModal';
import QuestionItem from '@components/response/question-item/QuestionItem';
import ResponseItem from '@components/response/response-item/ResponseItem';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout, SvgIcon } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { Response, ShortAnswerQuestion } from '@models/post';
import { getQuestionDetail, getResponseHistories } from '@utils/apis/question';

function ResponseHistory() {
  const { questionId } = useParams();
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const navigate = useNavigate();
  const [question, setQuestion] = useState<ShortAnswerQuestion | null>(null);

  const [responses, setResponses] = useState<Response[]>([]);

  const handleClickResponse = () => {
    if (!question) return;
    navigate(`/questions/${question.id}/short-answer`);
  };

  const handleSend = () => {
    setSendModalVisible(true);
  };

  const handleSkipSendQuestion = () => {
    setSendModalVisible(false);
  };

  useAsyncEffect(async () => {
    const questionDetail = await getQuestionDetail(Number(questionId));
    const responseList = await getResponseHistories(Number(questionId));

    setQuestion(questionDetail);
    setResponses(responseList.results || []);
  }, [questionId]);

  if (!question) return null;
  return (
    <MainContainer>
      <TitleHeader
        RightComponent={
          <button type="button" onClick={handleClickResponse}>
            <SvgIcon name="moment_description_normal" size={36} />
          </button>
        }
      />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" ph={DEFAULT_MARGIN} gap={20}>
        {/* 질문 아이템 */}
        <QuestionItem question={question} onSend={handleSend} disableClickQuestion />
        {/* 이전 답변들 */}
        <Layout.FlexCol w="100%" gap={24}>
          {responses.map((response) => (
            <ResponseItem response={response} key={response.id} />
          ))}
        </Layout.FlexCol>
      </Layout.FlexCol>
      <SendQuestionModal
        questionId={question.id}
        isVisible={sendModalVisible}
        setIsVisible={setSendModalVisible}
        onSkip={handleSkipSendQuestion}
      />
    </MainContainer>
  );
}

export default ResponseHistory;
