import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import SendQuestionModal from '@components/question/send-question-modal/SendQuestionModal';
import QuestionItem from '@components/response/question-item/QuestionItem';
import ResponseInput from '@components/response/response-input/ResponseInput';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { ShortAnswerQuestion } from '@models/post';
import { getQuestionDetail, responseQuestion } from '@utils/apis/question';

// 주관식 질문 답변
function ShortAnswerResponse() {
  const { questionId } = useParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [question, setQuestion] = useState<ShortAnswerQuestion | null>(null);
  const navigate = useNavigate();

  const [t] = useTranslation('translation', { keyPrefix: 'question.response' });

  const handleSend = () => {
    setSendModalVisible(true);
  };

  const handlePost = async () => {
    setSendModalVisible(true);
    if (!textareaRef.current) return;
    await responseQuestion({ question_id: Number(questionId), content: textareaRef.current.value });
    return navigate(`/response-history/${Number(questionId)}`);
  };

  const handleSkipSendQuestion = async () => {
    setSendModalVisible(false);
    await handlePost();
  };

  useAsyncEffect(async () => {
    const res = await getQuestionDetail(Number(questionId));
    setQuestion(res);
  }, [questionId]);

  if (!question) return null;

  return (
    <MainContainer>
      <TitleHeader
        RightComponent={
          <button type="button" onClick={handlePost}>
            <Font.Display type="18_bold">{t('post')}</Font.Display>
          </button>
        }
      />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" ph={DEFAULT_MARGIN}>
        <QuestionItem question={question} onSend={handleSend} />
        <ResponseInput inputRef={textareaRef} />
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

export default ShortAnswerResponse;
