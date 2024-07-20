import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import IconNudge from '@components/_common/icon-nudge/IconNudge';
import { Layout, SvgIcon } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { Noti } from '../Header.styled';
import MainHeader from '../MainHeader';

function FriendsHeader() {
  const [t] = useTranslation('translation', { keyPrefix: 'nav_tab' });
  const navigate = useNavigate();
  const currentUser = useBoundStore((state) => state.myProfile);

  return (
    <MainHeader
      title={t('friends')}
      rightButtons={
        <>
          <Icon name="add_user" size={44} onClick={() => navigate('/friends/explore')} />
          <Noti to="/notifications">
            <SvgIcon name="notification" size={44} />
            <Layout.Absolute t={4} r={4}>
              {currentUser?.unread_noti && <IconNudge />}
            </Layout.Absolute>
          </Noti>
        </>
      }
    />
  );
}

export default FriendsHeader;
