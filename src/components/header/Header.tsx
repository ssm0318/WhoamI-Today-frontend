import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import ChatsHeader from './chats-header/ChatsHeader';
import CommonHeader from './common-header/CommonHeader';
import FriendHeader from './friends-header/FriendsHeader';

function Header() {
  const location = useLocation();
  const [t] = useTranslation('translation');

  switch (location.pathname) {
    case '/friends':
      // TODO: ver R에서 어떤 헤더로 보여줘야하지?
      // return <CommonHeader title={t('nav_tab.friends')} />;
      return <FriendHeader />;
    case '/feed':
      return <CommonHeader title={t('nav_tab.feed')} />;
    case '/discover':
      return <CommonHeader title={t('nav_tab.discover')} />;
    case '/my':
      return <CommonHeader title={t('header.my')} />;
    case '/questions':
      return <CommonHeader title={t('header.questions')} />;
    case '/chats':
      return <ChatsHeader />;
    default:
      return null;
  }
}

export default React.memo(Header);
