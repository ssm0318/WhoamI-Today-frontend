import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader } from '@components/_common/loader/Loader.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import NoContents from '@components/_common/no-contents/NoContents';
import SendQuestionModal from '@components/question/send-question-modal/SendQuestionModal';
import QuestionItem from '@components/response/question-item/QuestionItem';
import ResponseCompleteModal from '@components/response/response-complete-modal/ResponseCompleteModal';
import ResponseInput from '@components/response/response-input/ResponseInput';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { ShortAnswerQuestion } from '@models/post';
import { getQuestionDetail, responseQuestion } from '@utils/apis/question';

// 주관식 질문 답변
function ShortAnswerResponse() {
  const { questionId } = useParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [question, setQuestion] = useState<FetchState<ShortAnswerQuestion>>({ state: 'loading' });
  const navigate = useNavigate();
  const [hasPosted, setHasPosted] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  const [t] = useTranslation('translation', { keyPrefix: 'question.response' });

  // 답변 작성 완료
  const handlePost = async () => {
    if (!textareaRef.current) return;
    const res = await responseQuestion({
      question_id: Number(questionId),
      content: textareaRef.current.value,
    });

    if (res) {
      setHasPosted(true);
      setShowComplete(true);
    }
  };

  // 질문 보내기
  const handleSendQuestion = () => {
    setSendModalVisible(true);
  };

  const handleNavigateToResponseHistory = () => {
    navigate(`/response-history/${questionId}`, { replace: true });
  };

  // 질문 보내기 skip
  const handleSkipSendQuestion = () => {
    setSendModalVisible(false);
    // 이미 답변을 보낸 상태라면 response history 페이지로 이동
    if (hasPosted) handleNavigateToResponseHistory();
  };

  // 질문 보내기 confirm
  const handleConfirmSendQuestion = () => {
    // 이미 답변을 보낸 상태라면 response history 페이지로 이동
    if (hasPosted) handleNavigateToResponseHistory();
  };

  useAsyncEffect(async () => {
    getQuestionDetail(Number(questionId))
      .then((data) => {
        setQuestion({ state: 'hasValue', data });
      })
      .catch(() => setQuestion({ state: 'hasError' }));
  }, [questionId]);

  return (
    <MainContainer>
      <TitleHeader
        RightComponent={
          <button type="button" onClick={handlePost}>
            <Font.Display type="18_bold" color="BLACK">
              {t('post')}
            </Font.Display>
          </button>
        }
      />
      {question.state === 'loading' ? (
        <Loader />
      ) : question.state === 'hasError' ? (
        <NoContents text={t('no_contents.all_questions')} mv={10} />
      ) : (
        <>
          <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" ph={DEFAULT_MARGIN}>
            <QuestionItem question={question.data} onSend={() => setSendModalVisible(true)} />
            <ResponseInput inputRef={textareaRef} />
          </Layout.FlexCol>
          {/* 답변 완료 모달 */}
          <ResponseCompleteModal
            isVisible={showComplete}
            setIsVisible={setShowComplete}
            onSendQuestion={handleSendQuestion}
            onSkipSendQuestion={handleSkipSendQuestion}
          />
          {/* 친구에게 질문 보내기 모달 */}
          <SendQuestionModal
            questionId={question.data.id}
            isVisible={sendModalVisible}
            setIsVisible={setSendModalVisible}
            onSkip={handleSkipSendQuestion}
            onSend={handleConfirmSendQuestion}
          />
        </>
      )}
    </MainContainer>
  );
}

export default ShortAnswerResponse;
