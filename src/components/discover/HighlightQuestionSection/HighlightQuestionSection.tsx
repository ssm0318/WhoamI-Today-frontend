import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SendPromptModal from '@components/_common/prompt/SendPromptModal';
import { formatFullDate } from '@components/_common/prompt-summary-card/PromptSummaryCard';
import { Layout, SvgIcon, Typo } from '@design-system';
import { useTrackEvent } from '@hooks/useTrackEvent';
import { logOnboardingEvent } from '@utils/apis/onboardingEvents';
import * as S from './HighlightQuestionSection.styled';

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
  const [t] = useTranslation('translation', { keyPrefix: 'discover_highlight_question' });
  const trackEvent = useTrackEvent();
  const formattedDate = formatFullDate(date);
  const askFriendsLabel = String(t('ask_friends'));

  const handleClickQuestion = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // Body tap from feed opens the aggregation page. tag captures
    // the highlight category so we can compare engagement across tags.
    trackEvent('highlight_question_detail_tapped', {
      question_id: questionId,
      tag,
    });
    logOnboardingEvent('highlight_question_detail_tapped', {
      question_id: questionId,
      tag,
    });
    navigate(`/questions/${questionId}?discover=true`);
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
      <S.HighlightSectionWrapper onClick={handleClickQuestion}>
        <Layout.FlexRow bgColor="TERTIARY_PINK" ph={8} pv={2} rounded={100}>
          <Typo bold type="label-medium" color="WHITE">
            {tag}
          </Typo>
        </Layout.FlexRow>
        {formattedDate && (
          <Typo type="label-medium" color="WHITE" mt={8}>
            {formattedDate}
          </Typo>
        )}
        <Typo type="title-medium" color="WHITE" mt={6}>
          {question}
        </Typo>
        <Layout.FlexRow w="100%" justifyContent="flex-end" mt={12}>
          <S.AskFriendsButton type="button" onClick={handleClickSend} aria-label={askFriendsLabel}>
            <span style={{ marginTop: 4, display: 'inline-flex' }}>
              <SvgIcon name="question_send" size={18} color="PRIMARY" />
            </span>
            <Typo type="label-large" color="PRIMARY" fontWeight={600}>
              {askFriendsLabel}
            </Typo>
          </S.AskFriendsButton>
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
