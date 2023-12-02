import { useTranslation } from 'react-i18next';
import { SvgIcon } from '@design-system';
import { Noti } from '../Header.styled';
import HeaderContainer from '../HeaderContainer';
import Icon from '../icon/Icon';

function FriendsHeader() {
  const [t] = useTranslation('translation', { keyPrefix: 'nav_tab' });
  return (
    <HeaderContainer
      title={t('friends')}
      rightButtons={
        <>
          <Icon name="top_navigation_friend" size={44} />
          <Noti to="/notifications">
            <SvgIcon name="notification" size={44} />
            {/* TODO 넛지 변경 */}
            {/* {myProfile?.unread_noti && <IconNudge />} */}
          </Noti>
        </>
      }
    />
  );
}

export default FriendsHeader;
