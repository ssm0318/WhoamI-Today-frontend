import { useTranslation } from 'react-i18next';
import { SvgIcon } from '@design-system';
import { Noti } from '../Header.styled';
import Icon from '../icon/Icon';
import MainHeader from '../MainHeader';

function FriendsHeader() {
  const [t] = useTranslation('translation', { keyPrefix: 'nav_tab' });
  return (
    <MainHeader
      title={t('friends')}
      rightButtons={
        <>
          <Icon name="add_user" size={44} />
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
