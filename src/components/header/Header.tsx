import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import SubHeader from '@components/sub-header/SubHeader';
import { VersionType } from '@models/api/user';
import { useBoundStore } from '@stores/useBoundStore';
import CommonHeader from './common-header/CommonHeader';
import FriendHeader from './friends-header/FriendsHeader';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [t] = useTranslation('translation');
  const myProfile = useBoundStore((state) => state.myProfile);

  switch (location.pathname) {
    case '/friends':
      // TODO: ver R에서 어떤 헤더로 보여줘야하지?
      // return <CommonHeader title={t('nav_tab.friends')} />;
      return <FriendHeader />;
    case '/feed':
      return (
        <CommonHeader
          title={t('nav_tab.friends')}
          extraActions={
            <Icon
              name="add_user"
              size={44}
              onClick={() => navigate('/friends/explore?tab=recommended')}
            />
          }
        />
      );
    case '/discover': {
      const isVerW = myProfile?.current_ver === VersionType.VER_W;
      return <CommonHeader title={t(isVerW ? 'header.daily_digest' : 'header.discover')} />;
    }
    case '/my':
      return <CommonHeader title={myProfile?.username || t('header.my')} />;
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
