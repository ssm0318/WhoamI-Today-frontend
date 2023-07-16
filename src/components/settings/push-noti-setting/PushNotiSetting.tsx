import { useTranslation } from 'react-i18next';
import { Font, Layout } from '@design-system';
import useNotiPermission from '@hooks/useNotiPermission';
import { requestPermission } from '@utils/firebaseHelpers';
import { isApp } from '@utils/getUserAgent';
import { SettingsToggleButton } from '../SettingsButtons';
import * as S from './PushNotiSetting.styled';

function PushNotiSetting() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings' });
  const { getSettingDescription } = useNotiPermission();
  const descriptions = getSettingDescription(!isApp ? Notification.permission : undefined);

  const handleRequestPermission = () => {
    if (Notification.permission !== 'default') return;
    requestPermission();
  };

  return (
    <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
      {isApp ? (
        // 앱
        <>
          <Font.Body type="18_regular">{t('push_notifications')}</Font.Body>
          <SettingsToggleButton />
        </>
      ) : (
        // 웹
        <Layout.FlexCol w="100%">
          {/* 알림 허용이 된 경우 toggle 버튼 노출 */}
          {Notification.permission === 'granted' && (
            <Layout.FlexRow w="100%" justifyContent="space-between" mb={8} alignItems="center">
              <Font.Body type="18_regular">{t('push_notifications')}</Font.Body>
              <SettingsToggleButton />
            </Layout.FlexRow>
          )}
          <S.PermissionTextContainer
            onClick={handleRequestPermission}
            cursor={Notification.permission === 'default' ? 'pointer' : 'default'}
          >
            {descriptions.map((desc) => (
              <Font.Body
                type="14_regular"
                key={desc}
                underline={Notification.permission === 'default'}
              >
                {desc}
              </Font.Body>
            ))}
          </S.PermissionTextContainer>
        </Layout.FlexCol>
      )}
    </Layout.FlexRow>
  );
}

export default PushNotiSetting;
