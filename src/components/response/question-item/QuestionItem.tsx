import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import PostTypeTag from '@components/_common/post-type-tag/PostTypeTag';
import PromptSummaryCard from '@components/_common/prompt-summary-card/PromptSummaryCard';
import { Typo } from '@design-system';
import { DailyQuestion } from '@models/post';

interface QuestionItemProps {
  question: DailyQuestion;
  disableNavigation?: boolean;
  navigationTarget?: 'detail' | 'respond';
}

function QuestionItem({
  question,
  disableNavigation = false,
  navigationTarget = 'detail',
}: QuestionItemProps) {
  const navigate = useNavigate();
  const { id, content, created_at, selected_dates } = question;

  const handleClickQuestion = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigate(navigationTarget === 'detail' ? `/questions/${id}` : `/questions/${id}/new`);
  };

  return (
    <PromptSummaryCard
      content={content}
      date={selected_dates?.[selected_dates.length - 1] ?? created_at}
      trailing={
        <>
          <Typo type="label-medium" color="MEDIUM_GRAY">
            ·
          </Typo>
          <PostTypeTag variant="question" />
        </>
      }
      onClick={disableNavigation ? undefined : handleClickQuestion}
    />
  );
}

export default QuestionItem;
