import Icon from '@components/_common/icon/Icon';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout } from '@design-system';

interface UserHeaderProps {
  username?: string;
  onClickMore: () => void;
}

function UserHeader({ username, onClickMore }: UserHeaderProps) {
  // const handleClickChat = async () => {
  //   if (!user) return;
  //   const roomId = await getChatRoomIdByUserId(user.id);
  //   if (!roomId) return;
  //   navigate(`/chats/${roomId}`);
  // };

  const handleClickMore = () => {
    onClickMore();
  };

  if (!username) return null;
  return (
    <SubHeader
      title={username}
      RightComponent={
        <Layout.FlexRow gap={8} alignItems="center">
          {/* <Icon name="chat_outline" size={44} onClick={handleClickChat} /> */}
          <Icon name="dots_menu" size={44} onClick={handleClickMore} />
        </Layout.FlexRow>
      }
    />
  );
}

export default UserHeader;
