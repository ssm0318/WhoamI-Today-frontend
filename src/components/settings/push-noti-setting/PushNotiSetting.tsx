import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Font, Layout } from '@design-system';
import useNotiPermission from '@hooks/useNotiPermission';
import { useBoundStore } from '@stores/useBoundStore';
import { requestPermission } from '@utils/firebaseHelpers';
import { isApp } from '@utils/getUserAgent';
import { getDailyNotiPeriod, getDailyNotiTime } from '@utils/timeHelpers';
import { PushNotiSettingButton, SettingsToggleButton } from '../SettingsButtons';
import * as S from './PushNotiSetting.styled';

function PushNotiSetting() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings' });

  const { getSettingDescription, notiPermission, setNotiPermission } = useNotiPermission();

  const {
    dailyNotiTime,
    dailyNotiPeriod = [0, 1, 2, 3, 4, 5, 6],
    appNotiPermission,
  } = useBoundStore((state) => ({
    appNotiPermission: state.appNotiPermission,
    dailyNotiTime: state.myProfile?.noti_time,
    dailyNotiPeriod: state.myProfile?.noti_period_days,
  }));
  const navigate = useNavigate();

  const permissionAllowed = isApp ? appNotiPermission : notiPermission === 'granted' || false;

  const descriptions = getSettingDescription(notiPermission);

  const handleRequestPermission = async () => {
    if (notiPermission !== 'default') return;
    const permission = await requestPermission();
    setNotiPermission(permission);
  };

  const handleClickChangeDailyNotiTime = () => navigate('/settings/change-daily-noti-time');

  const handleClickChangeDailyNotiPeriod = () => navigate('/settings/change-daily-noti-period');

  return (
    <>
      <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
        {isApp ? (
          // 앱
          <>
            <Font.Body type="18_regular">{t('push_notifications')}</Font.Body>
            <SettingsToggleButton permissionAllowed={permissionAllowed} />
          </>
        ) : (
          // 웹
          <Layout.FlexCol w="100%">
            {/* 알림 허용이 된 경우 toggle 버튼 노출 */}
            {notiPermission === 'granted' && (
              <Layout.FlexRow w="100%" justifyContent="space-between" mb={8} alignItems="center">
                <Font.Body type="18_regular">{t('push_notifications')}</Font.Body>
                {notiPermission === 'granted' && (
                  <SettingsToggleButton permissionAllowed={permissionAllowed} />
                )}
              </Layout.FlexRow>
            )}
            <S.PermissionTextContainer
              onClick={handleRequestPermission}
              cursor={notiPermission === 'default' ? 'pointer' : 'default'}
            >
              {descriptions.map((desc) => (
                <Font.Body type="14_regular" key={desc} underline={notiPermission === 'default'}>
                  {desc}
                </Font.Body>
              ))}
            </S.PermissionTextContainer>
          </Layout.FlexCol>
        )}
      </Layout.FlexRow>
      {permissionAllowed && dailyNotiTime && (
        <PushNotiSettingButton
          text={t('daily_noti_time')}
          onClick={handleClickChangeDailyNotiTime}
          value={getDailyNotiTime(dailyNotiTime)}
        />
      )}
      {dailyNotiPeriod && (
        <PushNotiSettingButton
          text={t('daily_noti_period')}
          onClick={handleClickChangeDailyNotiPeriod}
          value={getDailyNotiPeriod(dailyNotiPeriod)}
        />
      )}
    </>
  );
}

export default PushNotiSetting;
