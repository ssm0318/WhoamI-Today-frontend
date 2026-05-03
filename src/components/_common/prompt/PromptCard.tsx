import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatFullDate } from '@components/_common/prompt-summary-card/PromptSummaryCard';
import { Layout, SvgIcon, Typo } from '@design-system';
import { AdminAuthor, isAdminAuthor } from '@models/post';
import { User } from '@models/user';
import ProfileImage from '../profile-image/ProfileImage';
import { AskFriendsButton, StyledPromptCard } from './PromptCard.styled';
import SendPromptModal from './SendPromptModal';

interface PromptCardProps {
  widthMode?: 'full' | 'normal';
  id: number;
  content: string;
  date?: string | null;
  authorDetail?: User | AdminAuthor;
  missionMode?: boolean;
  navigationTarget?: 'detail' | 'respond';
}
function PromptCard({
  id,
  content,
  date,
  widthMode = 'normal',
  authorDetail,
  missionMode,
  navigationTarget = 'respond',
}: PromptCardProps) {
  const navigate = useNavigate();

  const [sendPromptModalVisible, setSendPromptBottomModalVisible] = useState(false);
  const handleClickRespond = (e?: MouseEvent<HTMLDivElement>) => {
    e?.stopPropagation();
    if (navigationTarget === 'detail') {
      navigate(`/questions/${id}`);
      return;
    }
    navigate(`/questions/${id}/new`, missionMode ? { state: { missionMode: true } } : undefined);
  };

  const handleClickSend = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSendPromptBottomModalVisible(true);
  };

  const onCloseSendBottomModal = () => {
    setSendPromptBottomModalVisible(false);
  };

  // Determine profile image and username
  let profileImageUrl: string | null | undefined = '/whoami-profile.svg';
  let username = 'Whoami Today';
  let colorHex: string | undefined;

  if (authorDetail) {
    if (isAdminAuthor(authorDetail)) {
      // AdminAuthor has color_hex
      colorHex = authorDetail.color_hex;
      username = 'Whoami Today'; // Default for admin
    } else {
      // User type
      const user = authorDetail as User;
      username = user.username || 'Whoami Today';

      // Check if profile_pic is a color hex (starts with #)
      if (user.profile_pic?.startsWith('#')) {
        colorHex = user.profile_pic;
      } else {
        profileImageUrl = user.profile_image || user.profile_pic || '/whoami-profile.svg';
      }
    }
  }

  const shouldUseColorHex = !!colorHex;
  const formattedDate = formatFullDate(date);

  return (
    <>
      <StyledPromptCard w={widthMode === 'full' ? '100%' : 250} onClick={handleClickRespond}>
        <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="flex-start" gap={12}>
          <Layout.FlexRow gap={8} alignItems="center" style={{ minWidth: 0 }}>
            {shouldUseColorHex ? (
              <Layout.LayoutBase w={28} h={28} rounded={14} style={{ backgroundColor: colorHex }} />
            ) : (
              <ProfileImage imageUrl={profileImageUrl} username={username} size={28} />
            )}
            <Layout.FlexCol style={{ minWidth: 0 }}>
              <Typo type="title-medium" ellipsis={{ enabled: true, maxWidth: 150 }}>
                {username}
              </Typo>
              {formattedDate && (
                <Typo type="label-medium" color="MEDIUM_GRAY">
                  {formattedDate}
                </Typo>
              )}
            </Layout.FlexCol>
          </Layout.FlexRow>
          <AskFriendsButton type="button" onClick={handleClickSend} aria-label="Ask friends">
            <span style={{ marginTop: 4, display: 'inline-flex' }}>
              <SvgIcon name="question_send" size={18} />
            </span>
            <Typo type="label-large" color="BLACK" fontWeight={600}>
              Ask friends
            </Typo>
          </AskFriendsButton>
        </Layout.FlexRow>
        <Typo type="body-large" color="BLACK">
          {content}
        </Typo>
      </StyledPromptCard>
      {sendPromptModalVisible && (
        <SendPromptModal
          visible={sendPromptModalVisible}
          onClose={onCloseSendBottomModal}
          questionId={id}
        />
      )}
    </>
  );
}

export default PromptCard;
