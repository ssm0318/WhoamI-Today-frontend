import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import { Layout, SvgIcon, Typo } from '@design-system';
import { ActorDetail } from '@models/notification';
import { DailyQuestion, Question } from '@models/post';
import ProfileImage from '../profile-image/ProfileImage';
import { StyledRecentPromptCard } from './RecentPromptCard.styled';
import SendPromptModal from './SendPromptModal';

interface PromptCardProps {
  question: Question | DailyQuestion;
  sentBy?: ActorDetail;
}
function RecentPromptCard({ question, sentBy }: PromptCardProps) {
  const [t] = useTranslation('translation');
  const navigate = useNavigate();

  const { content, id } = question;

  const [sendPromptModalVisible, setSendPromptBottomModalVisible] = useState(false);

  const handleClickRespond = () => {
    navigate(`questions/${id}/new`);
  };

  const handleClickSend = () => {
    setSendPromptBottomModalVisible(true);
  };

  const onCloseSendBottomModal = () => {
    setSendPromptBottomModalVisible(false);
  };

  return (
    <>
      <StyledRecentPromptCard w="100%" ph={16} pv={10} rounded={12} gap={8} bgColor="LIGHT">
        <Layout.FlexRow w="100%" alignItems="center" gap={8}>
          <Layout.FlexCol w="100%" gap={8}>
            {sentBy && (
              <Layout.FlexRow w="100%" gap={8}>
                <SvgIcon name="sent_by" size={16} color="MEDIUM_GRAY" />
                <Typo type="label-medium" color="MEDIUM_GRAY">
                  {t('notifications.received_prompts.sent_by', { username: sentBy.username })}
                </Typo>
              </Layout.FlexRow>
            )}
            <Layout.FlexRow gap={8} alignItems="center">
              <ProfileImage imageUrl="/whoami-profile.svg" username="Whoami Today" size={28} />
              <Typo type="title-medium">Whoami Today</Typo>
            </Layout.FlexRow>
            <Typo type="body-large">{content}</Typo>
          </Layout.FlexCol>
          <Layout.FlexCol gap={12} justifyContent="space-between">
            <Icon name="question_send" size={22} onClick={handleClickSend} />
            <Icon name="question_respond" size={22} onClick={handleClickRespond} />
          </Layout.FlexCol>
        </Layout.FlexRow>
      </StyledRecentPromptCard>
      <SendPromptModal
        visible={sendPromptModalVisible}
        onClose={onCloseSendBottomModal}
        questionId={question.id}
      />
    </>
  );
}

export default RecentPromptCard;
