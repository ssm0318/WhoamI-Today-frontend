import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ToggleSwitch } from '@components/_common/toggle-switch/ToggleSwitch';
import { Font, Layout } from '@design-system';
import useNotiPermission from '@hooks/useNotiPermission';
import { MyProfile } from '@models/api/user';
import { useBoundStore } from '@stores/useBoundStore';
import { editProfile } from '@utils/apis/my';
import { requestPermission } from '@utils/firebaseHelpers';
import { isApp } from '@utils/getUserAgent';
import { PushNotiSettingButton, SettingsToggleButton } from '../SettingsButtons';
import * as S from './PushNotiSetting.styled';

function PushNotiSetting() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings' });

  const { getSettingDescription, notiPermission, setNotiPermission } = useNotiPermission();

  const {
    dailyNotiTime,
    dailyNotiPeriod,
    appNotiPermission,
    myProfile,
    updateMyProfile,
    openToast,
  } = useBoundStore((state) => ({
    appNotiPermission: state.appNotiPermission,
    myProfile: state.myProfile,
    dailyNotiTime: state.myProfile?.noti_time,
    dailyNotiPeriod: state.myProfile?.noti_period_days,
    updateMyProfile: state.updateMyProfile,
    openToast: state.openToast,
  }));
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const permissionAllowed = isApp ? appNotiPermission : notiPermission === 'granted' || false;
  const pushEnabled = myProfile?.push_enabled ?? true;
  const dailyPromptPushEnabled = myProfile?.daily_prompt_push_enabled ?? true;
  const canEditPushPreferences = !!myProfile;

  const descriptions = getSettingDescription(notiPermission);

  const handleRequestPermission = async () => {
    if (notiPermission !== 'default') return;
    const permission = await requestPermission();
    setNotiPermission(permission);
  };

  const handleClickChangeDailyNotiSetting = () => navigate('/settings/daily-noti-setting');

  const handleUpdatePushPreference = (
    profile: Pick<Partial<MyProfile>, 'push_enabled' | 'daily_prompt_push_enabled'>,
  ) => {
    if (!myProfile || isSaving) return;
    setIsSaving(true);
    editProfile({
      profile,
      onSuccess: (data: MyProfile) => {
        updateMyProfile({ ...data });
        openToast({ message: t('daily_noti_setting.success') });
        setIsSaving(false);
      },
      onError: () => {
        openToast({ message: t('daily_noti_setting.error') });
        setIsSaving(false);
      },
    });
  };

  const handleTogglePushEnabled = () => {
    handleUpdatePushPreference({ push_enabled: !pushEnabled });
  };

  const handleToggleDailyPromptPushEnabled = () => {
    handleUpdatePushPreference({ daily_prompt_push_enabled: !dailyPromptPushEnabled });
  };

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
      {canEditPushPreferences && (
        <S.PreferenceList>
          <S.PreferenceRow>
            <S.PreferenceCopy>
              <Font.Body type="16_semibold">{t('all_push_notifications')}</Font.Body>
              <S.PreferenceDescription>{t('all_push_notifications_desc')}</S.PreferenceDescription>
            </S.PreferenceCopy>
            <ToggleSwitch
              ariaLabel={String(t('all_push_notifications'))}
              checked={pushEnabled}
              disabled={isSaving}
              onChange={handleTogglePushEnabled}
              type="large"
            />
          </S.PreferenceRow>
          <S.PreferenceRow disabled={!pushEnabled}>
            <S.PreferenceCopy>
              <Font.Body type="16_semibold">{t('daily_prompt_notifications')}</Font.Body>
              <S.PreferenceDescription>
                {t('daily_prompt_notifications_desc')}
              </S.PreferenceDescription>
            </S.PreferenceCopy>
            <ToggleSwitch
              ariaLabel={String(t('daily_prompt_notifications'))}
              checked={dailyPromptPushEnabled}
              disabled={isSaving || !pushEnabled}
              onChange={handleToggleDailyPromptPushEnabled}
              type="large"
            />
          </S.PreferenceRow>
        </S.PreferenceList>
      )}
      {canEditPushPreferences &&
        pushEnabled &&
        dailyPromptPushEnabled &&
        (dailyNotiPeriod || dailyNotiTime) && (
          <PushNotiSettingButton
            text={t('daily_noti_setting.title')}
            onClick={handleClickChangeDailyNotiSetting}
          />
        )}
    </>
  );
}

export default PushNotiSetting;
