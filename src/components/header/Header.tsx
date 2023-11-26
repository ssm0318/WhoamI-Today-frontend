import React from 'react';
import { useLocation } from 'react-router-dom';
<<<<<<< HEAD
import ChatsHeader from './chats-header/ChatsHeader';
import FriendsHeader from './friends-header/FriendHeader';
import MyHeader from './my-header/MyHeader';

function Header() {
  const location = useLocation();

  switch (location.pathname) {
    case '/friends':
      return <FriendsHeader />;
    case '/my':
      return <MyHeader />;
    case '/chats':
      return <ChatsHeader />;
    default:
      return null;
  }
=======
import { Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import ChatsHeader from './chats-header/ChatsHeader';
import FriendsHeader from './friends-header/FriendHeader';
import { HeaderWrapper } from './Header.styled';
import SideMenu from './side-menu/SideMenu';
import UserHeader from './user-header/UserHeader';

function Header() {
  const location = useLocation();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const myProfile = useBoundStore((state) => state.myProfile);

  const renderHeaderComponent = useCallback(() => {
    switch (location.pathname) {
      case '/friends':
        return <FriendsHeader />;
      case '/my':
        return (
          <UserHeader
            onClickHamburger={() => {
              setShowSideMenu(true);
            }}
            user={myProfile}
          />
        );
      case '/chats':
        return <ChatsHeader />;
      default:
        return null;
    }
  }, [location.pathname, myProfile]);

  return (
    <>
      <HeaderWrapper>
        <Layout.FlexRow justifyContent="space-between" w="100%" h="100%" alignItems="center">
          {renderHeaderComponent()}
        </Layout.FlexRow>
      </HeaderWrapper>
      {showSideMenu && <SideMenu closeSideMenu={() => setShowSideMenu(false)} />}
    </>
  );
>>>>>>> ae7be80 ((#212) 상태메시지 (check in) 디자인 수정 (#227))
}

export default React.memo(Header);
