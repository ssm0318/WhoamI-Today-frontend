import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import ChatsHeader from './chats-header/ChatsHeader';
import CommonHeader from './common-header/CommonHeader';

function Header() {
  const location = useLocation();
  const [t] = useTranslation('translation');

  switch (location.pathname) {
    case '/friends':
      return <CommonHeader title={t('nav_tab.friends')} />;
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
