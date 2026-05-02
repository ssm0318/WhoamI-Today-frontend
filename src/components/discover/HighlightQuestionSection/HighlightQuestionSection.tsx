import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SendPromptModal from '@components/_common/prompt/SendPromptModal';
import PromptSummaryCard from '@components/_common/prompt-summary-card/PromptSummaryCard';
import { useTrackEvent } from '@hooks/useTrackEvent';

type HighlightQuestionSectionProps = {
  question: string;
  tag: string;
  questionId: number;
  date?: string | null;
};

function HighlightQuestionSection({
  question,
  tag,
  questionId,
  date,
}: HighlightQuestionSectionProps) {
  const navigate = useNavigate();
  const [sendPromptModalVisible, setSendPromptBottomModalVisible] = useState(false);
  const trackEvent = useTrackEvent();

  const handleClickQuestion = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // Body tap from feed opens the aggregation page. tag captures
    // the highlight category so we can compare engagement across tags.
    trackEvent('highlight_question_detail_tapped', {
      question_id: questionId,
      tag,
    });
    navigate(`/questions/${questionId}`);
  };

  const handleClickSend = (e: MouseEvent<HTMLButtonElement>) => {
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
      <PromptSummaryCard
        content={question}
        date={date}
        onClick={handleClickQuestion}
        onSend={handleClickSend}
      />
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
