import React from 'react';
import { useLocation } from 'react-router-dom';
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
}

export default React.memo(Header);
