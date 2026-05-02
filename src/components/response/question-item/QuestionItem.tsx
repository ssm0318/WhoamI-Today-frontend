import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SendPromptModal from '@components/_common/prompt/SendPromptModal';
import PromptSummaryCard from '@components/_common/prompt-summary-card/PromptSummaryCard';
import { DailyQuestion } from '@models/post';

interface QuestionItemProps {
  question: DailyQuestion;
  onSend?: () => void;
  disableNavigation?: boolean;
  navigationTarget?: 'detail' | 'respond';
}

function QuestionItem({
  question,
  onSend,
  disableNavigation = false,
  navigationTarget = 'detail',
}: QuestionItemProps) {
  const navigate = useNavigate();
  const { id, content, created_at, selected_dates } = question;

  const [sendPromptModalVisible, setSendPromptBottomModalVisible] = useState(false);
  const handleClickQuestion = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigate(navigationTarget === 'detail' ? `/questions/${id}` : `/questions/${id}/new`);
  };

  const handleClickSend = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onSend?.();
    setSendPromptBottomModalVisible(true);
  };

  const onCloseSendBottomModal = () => {
    setSendPromptBottomModalVisible(false);
  };

  return (
    <>
      <PromptSummaryCard
        content={content}
        date={selected_dates?.[selected_dates.length - 1] ?? created_at}
        onClick={disableNavigation ? undefined : handleClickQuestion}
        onSend={handleClickSend}
      />
      {sendPromptModalVisible && (
        <SendPromptModal
          visible={sendPromptModalVisible}
          onClose={onCloseSendBottomModal}
          questionId={question.id}
        />
      )}
    </>
  );
}

export default QuestionItem;
