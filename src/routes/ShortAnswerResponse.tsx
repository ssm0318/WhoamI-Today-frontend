import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import QuestionItem from '@components/response/question-item/QuestionItem';
import ResponseInput from '@components/response/response-input/ResponseInput';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout } from '@design-system';
import { ShortAnswerQuestion } from '@models/post';

// 주관식 질문 답변
function ShortAnswerResponse() {
  const { state: question } = useLocation() as { state: ShortAnswerQuestion };
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [t] = useTranslation('translation', { keyPrefix: 'question.response' });

  const handlePost = () => {
    // TODO 작성이 완료되었고, 질문 보내기 창 한번 띄워줌
    if (!textareaRef.current) return;
    console.log(12);
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
        <QuestionItem question={question} />
        <ResponseInput inputRef={textareaRef} />
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default ShortAnswerResponse;
