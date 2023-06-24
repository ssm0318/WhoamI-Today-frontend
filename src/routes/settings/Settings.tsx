import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ConfirmBottomModal from '@components/_common/bottom-modal/ConfirmBottomModal';
import { Divider } from '@components/_common/divider/Divider.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import UserProfile from '@components/_common/user-profile/UserProfile';
import {
  AccountSettingButton,
  SettingsButton,
  SettingsToggleButton,
} from '@components/settings/SettingsButtons';
import { StyledSettingsAnchor } from '@components/settings/SettingsButtons.styled';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import {
  PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_EN,
  PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_KO,
} from '@constants/url';
import { Font, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { signOut } from '@utils/apis/user';

function Settings() {
  const [t, i18n] = useTranslation('translation', { keyPrefix: 'settings' });

  const myProfile = useBoundStore((state) => state.myProfile);

  const navigate = useNavigate();
  const handleClickEditProfile = () => navigate('/settings/edit-profile');
  const handleClickChangePassword = () => navigate('/settings/confirm-password');

  const handlePushNotiOn = () => console.log('todo: push on');
  const handlePushNotiOff = () => console.log('todo: push off');

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const handleOnClose = () => {
    setLogoutModalVisible(false);
  };

  const handleClickLogout = () => {
    setLogoutModalVisible(true);
  };

  const handleClickConfirmLogout = async () => {
    await signOut(() => {
      handleOnClose();
      navigate('/');
    });
  };
  const handleClickDeleteAccount = () => navigate('/settings/delete-account');

  return (
    <MainContainer>
      <TitleHeader title={t('title')} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" gap={10}>
        {/* profile */}
        <Layout.FlexRow justifyContent="center" mb={8} ph={DEFAULT_MARGIN}>
          {myProfile && (
            <>
              <UserProfile
                imageUrl={myProfile.profile_image}
                username={myProfile.username}
                size={55}
              />
              <Layout.FlexCol ml={12}>
                <Font.Body type="14_semibold" mt={4}>
                  {myProfile.username}
                </Font.Body>
                <Font.Body type="12_regular" mt={4}>
                  {myProfile.email}
                </Font.Body>
              </Layout.FlexCol>
            </>
          )}
        </Layout.FlexRow>
        <Divider width={2} />
        {/* account settings */}
        <Layout.FlexCol ph={DEFAULT_MARGIN} gap={10} w="100%">
          <Font.Display type="20_bold">{t('account_settings')}</Font.Display>
          <AccountSettingButton text={t('edit_profile')} onClick={handleClickEditProfile} />
          <AccountSettingButton text={t('change_password')} onClick={handleClickChangePassword} />
        </Layout.FlexCol>
        <Divider width={1} />
        {/* notification settings */}
        <Layout.FlexCol ph={DEFAULT_MARGIN} gap={10} w="100%">
          <Font.Display type="20_bold">{t('notification_settings')}</Font.Display>
          <Layout.FlexRow w="100%" justifyContent="space-between">
            <Font.Body type="18_regular">{t('push_notifications')}</Font.Body>
            <SettingsToggleButton onToggleOn={handlePushNotiOn} onToggleOff={handlePushNotiOff} />
          </Layout.FlexRow>
        </Layout.FlexCol>
        <Divider width={1} />
        {/* terms of uses */}
        <StyledSettingsAnchor
          link={
            i18n.language === 'ko'
              ? PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_KO
              : PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_EN
          }
        >
          <Font.Display type="20_bold">{t('terms_of_uses')}</Font.Display>
        </StyledSettingsAnchor>
        <Divider width={1} />
        <SettingsButton text={t('logout')} onClick={handleClickLogout} />
        {logoutModalVisible && (
          <ConfirmBottomModal
            isVisible={logoutModalVisible}
            setIsVisible={setLogoutModalVisible}
            title={t('logout')}
            confirmText={t('logout')}
            onConfirm={handleClickConfirmLogout}
          >
            <Font.Body type="18_regular" mt={38} mb={70}>
              {t('are_you_sure_you_want_to_log_out')}
            </Font.Body>
          </ConfirmBottomModal>
        )}
        <Divider width={1} />
        <SettingsButton text={t('delete_account')} onClick={handleClickDeleteAccount} />
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default Settings;
