import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout } from '@design-system';
import { User } from '@models/user';
import { getChatRoomIdByUserId } from '@utils/apis/chat';

interface UserHeaderProps {
  user?: User;
  onClickMore: () => void;
}

function UserHeader({ user, onClickMore }: UserHeaderProps) {
  const navigate = useNavigate();

  const handleClickChat = async () => {
    if (!user) return;
    const roomId = await getChatRoomIdByUserId(user.id);
    if (!roomId) return;
    navigate(`/chats/${roomId}`);
  };

  const handleClickMore = () => {
    onClickMore();
  };

  if (!user) return null;
  return (
    <SubHeader
      title={user.username}
      RightComponent={
        <Layout.FlexRow gap={8} alignItems="center">
          <Icon name="chat_outline" size={44} onClick={handleClickChat} />
          <Layout.Absolute r={62}>
            <Icon name="dots_menu" size={44} onClick={handleClickMore} />
          </Layout.Absolute>
        </Layout.FlexRow>
      }
    />
  );
}

export default UserHeader;
