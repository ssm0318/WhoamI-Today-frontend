import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import SubHeader from '@components/sub-header/SubHeader';
import { UserPageContext } from '@components/user-page/UserPage.context';
import { Layout, Typo } from '@design-system';

interface UserHeaderProps {
  username?: string;
  userId?: number;
  unreadCount?: number;
  onClickMore: () => void;
}

function UserHeader({ username, userId, unreadCount, onClickMore }: UserHeaderProps) {
  const navigate = useNavigate();
  const { user } = useContext(UserPageContext);
  const areFriends = user?.data?.are_friends === true;

  console.log(unreadCount);
  const handleClickPing = async () => {
    if (!userId) return;
    navigate(`/users/${userId}/ping`);
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
          {areFriends && (
            <Layout.FlexRow>
              <Layout.LayoutBase pb={2}>
                <Icon name="ping_send" size={20} onClick={handleClickPing} />
              </Layout.LayoutBase>
              {unreadCount && unreadCount > 0 && (
                <Layout.Absolute
                  bgColor="BLACK"
                  alignItems="center"
                  rounded={10}
                  t={8}
                  r={23}
                  ph={3}
                  pv={1}
                  tl={['100%', 0]}
                >
                  <Typo type="label-small" color="WHITE" fontSize={7} fontWeight={700}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Typo>
                </Layout.Absolute>
              )}
            </Layout.FlexRow>
          )}
        </Layout.FlexRow>
      }
    />
  );
}

export default UserHeader;
