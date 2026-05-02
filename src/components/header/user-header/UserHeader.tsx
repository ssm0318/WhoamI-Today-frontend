import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import SubHeader from '@components/sub-header/SubHeader';
import { UserPageContext } from '@components/user-page/UserPage.context';
import { Layout, Typo } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';

interface UserHeaderProps {
  username?: string;
  userId?: number;
  unreadCount?: number;
  onClickMore: () => void;
}

function UserHeader({ username, userId, unreadCount, onClickMore }: UserHeaderProps) {
  const navigate = useNavigate();
  const { user } = useContext(UserPageContext);
  const currentUser = useBoundStore((state) => state.myProfile);
  const areFriends = user?.data?.are_friends === true;
  const canChat = areFriends || user?.data?.accepted_chat_request === true;
  const isMyPage = currentUser && userId ? Number(currentUser.id) === Number(userId) : false;

  const handleClickChat = () => {
    if (!userId) return;
    navigate(`/users/${userId}/chat`);
  };

  const handleClickMore = () => {
    onClickMore();
  };

  if (!username) return null;
  return (
    <SubHeader
      title={username}
      RightComponent={
        <Layout.FlexRow gap={8} alignItems="center">
          <Icon name="dots_menu" size={44} onClick={handleClickMore} />
          {!isMyPage && canChat && (
            <Layout.LayoutBase
              w={44}
              pb={2}
              alignItems="center"
              justifyContent="center"
              style={{ position: 'relative', flexShrink: 0 }}
            >
              <Icon name="chat_outline" size={44} onClick={handleClickChat} />
              {!!unreadCount && unreadCount > 0 && (
                <Layout.Absolute t={4} r={4}>
                  <Layout.FlexRow
                    ph={5}
                    pv={1}
                    rounded={8}
                    bgColor="SECONDARY"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typo type="label-small" color="BLACK">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Typo>
                  </Layout.FlexRow>
                </Layout.Absolute>
              )}
            </Layout.LayoutBase>
          )}
        </Layout.FlexRow>
      }
    />
  );
}

export default UserHeader;
