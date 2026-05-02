import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PromptSummaryCard from '@components/_common/prompt-summary-card/PromptSummaryCard';
import { AdminAuthor, isAdminAuthor } from '@models/post';
import { User } from '@models/user';
import SendPromptModal from './SendPromptModal';

interface PromptCardProps {
  widthMode?: 'full' | 'normal';
  id: number;
  content: string;
  date?: string | null;
  authorDetail?: User | AdminAuthor;
  missionMode?: boolean;
}
function PromptCard({
  id,
  content,
  date,
  widthMode = 'normal',
  authorDetail,
  missionMode,
}: PromptCardProps) {
  const navigate = useNavigate();

  const [sendPromptModalVisible, setSendPromptBottomModalVisible] = useState(false);
  const handleClickRespond = (e?: MouseEvent<HTMLDivElement>) => {
    e?.stopPropagation();
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

  return (
    <>
      <PromptSummaryCard
        content={content}
        date={date}
        width={widthMode === 'full' ? '100%' : 250}
        authorName={username}
        profileImageUrl={profileImageUrl}
        colorHex={shouldUseColorHex ? colorHex : undefined}
        sendLabel="Send"
        onClick={handleClickRespond}
        onSend={handleClickSend}
      />
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
