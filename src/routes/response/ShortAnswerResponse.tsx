import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import SendQuestionModal from '@components/question/send-question-modal/SendQuestionModal';
import QuestionItem from '@components/response/question-item/QuestionItem';
import ResponseInput from '@components/response/response-input/ResponseInput';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout } from '@design-system';
import { userList } from '@mock/users';
import { ShortAnswerQuestion } from '@models/post';

// 주관식 질문 답변
function ShortAnswerResponse() {
  const { state: question } = useLocation() as { state: ShortAnswerQuestion };
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sendModalVisible, setSendModalVisible] = useState(false);

  const [t] = useTranslation('translation', { keyPrefix: 'question.response' });

  const handleSend = () => {
    setSendModalVisible(true);
  };

  const handlePost = () => {
    // TODO 답변 업로드
    setSendModalVisible(true);
    if (!textareaRef.current) return;
    console.log(textareaRef.current);
  };

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
      {/* TODO 실제 userList 적용 필요 */}
      <SendQuestionModal
        userList={userList}
        isVisible={sendModalVisible}
        setIsVisible={setSendModalVisible}
      />
    </MainContainer>
  );
}

export default ShortAnswerResponse;
