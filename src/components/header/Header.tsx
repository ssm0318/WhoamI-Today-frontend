import { useLocation } from 'react-router-dom';
import { Layout } from '@design-system';
import ChatsHeader from './chats-header/ChatsHeader';
import FriendsHeader from './friends-header/FriendHeader';
import { HeaderWrapper } from './Header.styled';
import MyHeader from './my-header/MyHeader';

function Header() {
  const location = useLocation();

  const renderHeaderComponent = () => {
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
  };

  return (
    <HeaderWrapper>
      <Layout.FlexRow justifyContent="space-between" w="100%" alignItems="center">
        {renderHeaderComponent()}
      </Layout.FlexRow>
    </HeaderWrapper>
  );
}

export default Header;
