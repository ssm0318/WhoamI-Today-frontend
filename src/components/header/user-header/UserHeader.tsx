import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import SubHeader from '@components/sub-header/SubHeader';
import { UserPageContext } from '@components/user-page/UserPage.context';
import { Layout, Typo } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import axios from '@utils/apis/axios';

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
  const alreadyRequested = user?.data?.sent_chat_request_to === true;
  const isMyPage = currentUser && userId ? Number(currentUser.id) === Number(userId) : false;

  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    if (alreadyRequested) setRequestSent(true);
  }, [alreadyRequested]);

  const handleClickChat = () => {
    if (!userId) return;
    navigate(`/users/${userId}/chat`);
  };

  const handleRequestChat = async () => {
    if (!userId || requestSent) return;
    try {
      await axios.post('/chat/requests/', { requestee_id: userId });
      setRequestSent(true);
    } catch {
      // Request may already exist
      setRequestSent(true);
    }
  };

  const handleClickMore = () => {
    onClickMore();
  };

  if (!username) return null;
  return (
    <SubHeader
      RightComponent={
        <Layout.FlexRow gap={8} alignItems="center">
          <Icon name="dots_menu" size={44} onClick={handleClickMore} />
          {!isMyPage && areFriends && (
            <Layout.FlexRow>
              <Layout.LayoutBase pb={2}>
                <Icon name="chat_outline" size={44} onClick={handleClickChat} />
              </Layout.LayoutBase>
              {!!unreadCount && unreadCount > 0 && (
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
          {!isMyPage && !areFriends && (
            <button
              type="button"
              onClick={requestSent ? undefined : handleRequestChat}
              style={{
                background: requestSent ? '#F0F0F0' : '#8700FF',
                color: requestSent ? '#999' : 'white',
                border: 'none',
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: 600,
                cursor: requestSent ? 'default' : 'pointer',
              }}
            >
              {requestSent ? 'Requested' : 'Chat'}
            </button>
          )}
        </Layout.FlexRow>
      }
    />
  );
}

export default UserHeader;
