<<<<<<< HEAD
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SvgIcon } from '@design-system';
import { Noti } from '../Header.styled';
import Icon from '../icon/Icon';
import MainHeader from '../MainHeader';
=======
import IconButton from '@components/_common/icon-button/IconButton';
import { Font, Layout, SvgIcon } from '@design-system';
import { Noti } from '../Header.styled';
>>>>>>> 5497610 ((#220) 노트 마크업 (#223))

function FriendsHeader() {
  const [t] = useTranslation('translation', { keyPrefix: 'nav_tab' });
  const navigate = useNavigate();

  return (
<<<<<<< HEAD
    <MainHeader
      title={t('friends')}
      rightButtons={
        <>
          <Icon name="add_user" size={44} onClick={() => navigate('/friends/explore')} />
          <Noti to="/notifications">
            <SvgIcon name="notification" size={44} />
            {/* TODO 넛지 변경 */}
            {/* {myProfile?.unread_noti && <IconNudge />} */}
          </Noti>
        </>
      }
    />
=======
    <>
      <Layout.FlexRow>
        <Font.Display type="24_regular">Friends</Font.Display>
      </Layout.FlexRow>
      <Layout.FlexRow gap={8}>
        <IconButton name="top_navigation_friend" size={44} />
        <Noti to="/notifications">
          <SvgIcon name="top_navigation_noti" size={44} />
          {/* TODO 넛지 변경 */}
          {/* {myProfile?.unread_noti && <IconNudge />} */}
        </Noti>
      </Layout.FlexRow>
    </>
>>>>>>> 5497610 ((#220) 노트 마크업 (#223))
  );
}

export default FriendsHeader;
