import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import { Layout, Typo } from '@design-system';
import { AdminAuthor, isAdminAuthor } from '@models/post';
import { User } from '@models/user';
import ProfileImage from '../profile-image/ProfileImage';
import { StyledPromptCard, StyledPromptCardButtons } from './PromptCard.styled';
import SendPromptModal from './SendPromptModal';

interface PromptCardProps {
  widthMode?: 'full' | 'normal';
  id: number;
  content: string;
  authorDetail?: User | AdminAuthor;
}
function PromptCard({ id, content, widthMode = 'normal', authorDetail }: PromptCardProps) {
  const navigate = useNavigate();

  const [sendPromptModalVisible, setSendPromptBottomModalVisible] = useState(false);
  const handleClickRespond = () => {
    navigate(`/questions/${id}/new`);
  };

  const handleClickSend = (e: MouseEvent) => {
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

  return (
    <>
      <StyledPromptCard w={widthMode === 'full' ? '100%' : 250} onClick={handleClickRespond}>
        <Layout.FlexRow gap={8} alignItems="center">
          {shouldUseColorHex ? (
            <Layout.LayoutBase w={28} h={28} rounded={14} style={{ backgroundColor: colorHex }} />
          ) : (
            <ProfileImage imageUrl={profileImageUrl} username={username} size={28} />
          )}
          <Typo type="title-medium">{username}</Typo>
        </Layout.FlexRow>
        <Typo type="body-large">{content}</Typo>
        <StyledPromptCardButtons gap={18}>
          <Icon name="question_send" size={22} onClick={handleClickSend} />
        </StyledPromptCardButtons>
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
