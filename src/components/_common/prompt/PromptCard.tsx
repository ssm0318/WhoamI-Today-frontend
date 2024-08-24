import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import { Layout, Typo } from '@design-system';
import { DailyQuestion, Question } from '@models/post';
import ProfileImage from '../profile-image/ProfileImage';
import { StyledPromptCard, StyledPromptCardButtons } from './PromptCard.styled';
import SendPromptModal from './SendPromptModal';

interface PromptCardProps {
  question: Question | DailyQuestion;
  widthMode?: 'full' | 'normal';
}
function PromptCard({ question, widthMode = 'normal' }: PromptCardProps) {
  const navigate = useNavigate();

  const { id, content } = question;
  const [sendPromptModalVisible, setSendPromptBottomModalVisible] = useState(false);
  const handleClickRespond = () => {
    navigate(`/questions/${id}/new`);
  };

  const handleClickSend = () => {
    setSendPromptBottomModalVisible(true);
  };

  const onCloseSendBottomModal = () => {
    setSendPromptBottomModalVisible(false);
  };

  return (
    <>
      <StyledPromptCard w={widthMode === 'full' ? '100%' : 250}>
        <Layout.FlexRow gap={8} alignItems="center">
          <ProfileImage imageUrl="/whoami-profile.svg" username="Whoami Today" size={28} />
          <Typo type="title-medium">Whoami Today</Typo>
        </Layout.FlexRow>
        <Typo type="body-large">{content}</Typo>
        <StyledPromptCardButtons gap={18}>
          <Icon name="question_respond" size={22} onClick={handleClickRespond} />
          <Icon name="question_send" size={22} onClick={handleClickSend} />
        </StyledPromptCardButtons>
      </StyledPromptCard>
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

export default PromptCard;
