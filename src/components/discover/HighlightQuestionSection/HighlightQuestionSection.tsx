import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import SendPromptModal from '@components/_common/prompt/SendPromptModal';
import { Layout, Typo } from '@design-system';
import { useTrackEvent } from '@hooks/useTrackEvent';
import * as S from './HighlightQuestionSection.styled';

type HighlightQuestionSectionProps = {
  question: string;
  tag: string;
  questionId: number;
};

function HighlightQuestionSection({ question, tag, questionId }: HighlightQuestionSectionProps) {
  const navigate = useNavigate();
  const [sendPromptModalVisible, setSendPromptBottomModalVisible] = useState(false);
  const trackEvent = useTrackEvent();

  const handleClickRespond = (e: MouseEvent) => {
    e.stopPropagation();
    // Body tap → respond to the question. tag (e.g. 'Today') captures
    // the highlight category so we can compare engagement across tags.
    trackEvent('highlight_question_respond_tapped', {
      question_id: questionId,
      tag,
    });
    navigate(`/questions/${questionId}/new`);
  };

  const handleClickSend = (e: MouseEvent) => {
    e.stopPropagation();
    // Send-icon tap (forward to a friend) — distinct from respond.
    trackEvent('highlight_question_send_tapped', {
      question_id: questionId,
      tag,
    });
    setSendPromptBottomModalVisible(true);
  };

  const onCloseSendBottomModal = () => {
    setSendPromptBottomModalVisible(false);
  };

  return (
    <>
      <S.HighlightSectionWrapper onClick={handleClickRespond}>
        <Layout.FlexRow bgColor="TERTIARY_PINK" ph={8} pv={2} rounded={100}>
          <Typo bold type="label-medium" color="WHITE">
            {tag}
          </Typo>
        </Layout.FlexRow>
        <Typo type="title-medium" color="WHITE" mt={6}>
          {question}
        </Typo>

        <Layout.FlexRow w="100%" justifyContent="flex-end" gap={18}>
          <Icon name="question_send" size={22} color="WHITE" onClick={handleClickSend} />
        </Layout.FlexRow>
      </S.HighlightSectionWrapper>
      {sendPromptModalVisible && (
        <SendPromptModal
          visible={sendPromptModalVisible}
          onClose={onCloseSendBottomModal}
          questionId={questionId}
        />
      )}
    </>
  );
}

export default HighlightQuestionSection;
