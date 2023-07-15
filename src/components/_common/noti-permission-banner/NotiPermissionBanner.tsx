import { useTranslation } from 'react-i18next';
import { Font } from '@design-system';
import * as S from './NotiPermissionBanner.styled';

interface NotiPermissionBannerProps {
  onClick: () => void;
}

function NotiPermissionBanner({ onClick }: NotiPermissionBannerProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'settings' });

  return (
    <S.Container justifyContent="center" bgColor="GRAY_10" h="50px" w="100%" onClick={onClick}>
      <Font.Body type="14_regular" underline>
        {t('allow_notification_to_receive_updates_from_friends_as_push_notifications')}
      </Font.Body>
      <Font.Body type="14_regular">⚠️ {t('please_check_your_system_preferences')} ⚠️</Font.Body>
    </S.Container>
  );
}

export default NotiPermissionBanner;
