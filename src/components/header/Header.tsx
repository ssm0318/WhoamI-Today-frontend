import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import SubHeader from '@components/sub-header/SubHeader';
import CommonHeader from './common-header/CommonHeader';
import FriendHeader from './friends-header/FriendsHeader';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [t] = useTranslation('translation');

  switch (location.pathname) {
    case '/friends':
      // TODO: ver R에서 어떤 헤더로 보여줘야하지?
      // return <CommonHeader title={t('nav_tab.friends')} />;
      return <FriendHeader />;
    case '/feed':
      return (
        <CommonHeader
          title={t('nav_tab.feed')}
          extraActions={
            <Icon
              name="add_user"
              size={44}
              onClick={() => navigate('/friends/explore?tab=recommended')}
            />
          }
        />
      );
    case '/discover':
      return <CommonHeader title={t('header.discover')} />;
    case '/my':
      return <CommonHeader title={t('header.my')} />;
    case '/update':
      return <CommonHeader title="Check-In" />;
    case '/share':
      return <CommonHeader title={t('header.share')} />;
    case '/questions':
      return <SubHeader title={t('header.questions')} />;
    case '/my/pings':
      return <CommonHeader title={t('nav_tab.chats')} />;
    default:
      return null;
  }
}

export default React.memo(Header);
