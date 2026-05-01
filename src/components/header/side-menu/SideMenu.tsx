import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';

import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import { FeatureFlagKey } from '@constants/featureFlag';
import { Z_INDEX } from '@constants/layout';
import { ONBOARDING_VIDEO_URL } from '@constants/url';
import { Button, Layout, SvgIcon, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import { VersionType } from '@models/api/user';
import { useBoundStore } from '@stores/useBoundStore';
import { getMyPendingVersionSwitchRequest } from '@utils/apis/user';

type SideMenuItem =
  | { key: string; emoji: string; kind: 'route'; path: string; flag?: FeatureFlagKey }
  | { key: string; emoji: string; kind: 'browse_mode'; flag: FeatureFlagKey };

const SIDE_MENU_LIST: SideMenuItem[] = [
  { key: 'my_profile', emoji: '👤', kind: 'route', path: '/my' },
  {
    key: 'browsing_mode',
    emoji: '✨',
    kind: 'browse_mode',
    flag: FeatureFlagKey.BROWSE_MODE,
  },
  { key: 'surveys', emoji: '📊', kind: 'route', path: '/surveys' },
  { key: 'settings', emoji: '⚙️', kind: 'route', path: '/settings' },
];

const VERSION_LABEL: Record<VersionType, string> = {
  [VersionType.VER_W]: 'Ver.W',
  [VersionType.VER_Q]: 'Ver.Q',
};

interface Props {
  closeSideMenu: () => void;
}

// TODO: Add entrance/exit animations
function SideMenu({ closeSideMenu }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'home.header.side_menu' });
  const navigate = useNavigate();
  const postMessage = usePostAppMessage();
  const featureFlags = useBoundStore((state) => state.featureFlags);
  const openBrowseModePicker = useBoundStore((state) => state.openBrowseModePicker);

  const myProfile = useBoundStore((state) => state.myProfile);
  const { data: pendingResp } = useSWR(
    '/user/version-swap-request/me/',
    getMyPendingVersionSwitchRequest,
  );
  const isPending = !!pendingResp?.pending;

  const visibleItems = SIDE_MENU_LIST.filter((menu) => !menu.flag || featureFlags?.[menu.flag]);

  const handleClickMenu = (menu: SideMenuItem) => () => {
    if (menu.kind === 'route') {
      navigate(menu.path);
    } else if (menu.kind === 'browse_mode') {
      openBrowseModePicker();
    }
    closeSideMenu();
  };

  const handleClickDimmed = () => {
    closeSideMenu();
  };

  const handleClickVersionSwitch = () => {
    if (isPending) return;
    navigate('/settings/version-switch-request');
    closeSideMenu();
  };

  const handleClickOnboardingVideo = () => {
    if (window.ReactNativeWebView) {
      postMessage('OPEN_BROWSER', {
        url: ONBOARDING_VIDEO_URL,
      });
    } else {
      window.open(ONBOARDING_VIDEO_URL, '_blank');
    }
  };

  return createPortal(
    <Layout.Absolute t={0} l={0} r={0} b={0} z={Z_INDEX.MODAL_CONTAINER}>
      <Layout.Absolute w="100%" h="100%" bgColor="DIM" onClick={handleClickDimmed} />
      <Layout.Absolute r={0} w={250} h="100%" bgColor="WHITE">
        <Layout.FlexCol pt={20} pl={24}>
          <SvgIcon name="close" color="BLACK" size={24} onClick={handleClickDimmed} />
          <Layout.FlexCol gap={12} pt={30}>
            {visibleItems.map((menu) => (
              <button type="button" key={menu.key} onClick={handleClickMenu(menu)}>
                <Layout.FlexRow gap={6} alignItems="center">
                  <EmojiItem
                    emojiString={menu.emoji}
                    size={20}
                    bgColor="TRANSPARENT"
                    outline="TRANSPARENT"
                  />
                  <Typo type="head-line">{t(menu.key)}</Typo>
                </Layout.FlexRow>
              </button>
            ))}
            <Layout.FlexCol mt={52}>
              <a
                href={ONBOARDING_VIDEO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  handleClickOnboardingVideo();
                }}
              >
                <Layout.FlexRow gap={6} alignItems="center">
                  <EmojiItem
                    emojiString="📺"
                    size={20}
                    bgColor="TRANSPARENT"
                    outline="TRANSPARENT"
                  />
                  <Typo type="title-large" color="BLACK" underline>
                    {t('onboarding_video')}
                  </Typo>
                </Layout.FlexRow>
              </a>
            </Layout.FlexCol>
            {myProfile && (
              <Layout.FlexCol mt={60} gap={10}>
                <Layout.FlexRow gap={4} alignItems="center" style={{ flexWrap: 'wrap' }}>
                  <Typo type="body-medium" color="DARK_GRAY">
                    {t('current_version')}
                  </Typo>
                  <VersionCode>{VERSION_LABEL[myProfile.current_ver]}</VersionCode>
                </Layout.FlexRow>
                <Button.Secondary
                  status={isPending ? 'disabled' : 'normal'}
                  text={isPending ? t('request_pending') : t('request_version_switch')}
                  sizing="fit-content"
                  onClick={handleClickVersionSwitch}
                />
              </Layout.FlexCol>
            )}
          </Layout.FlexCol>
        </Layout.FlexCol>
      </Layout.Absolute>
    </Layout.Absolute>,
    document.getElementById('root-container') || document.body,
  );
}

const VersionCode = styled.code`
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  background: ${({ theme }) => theme.LIGHT};
  color: ${({ theme }) => theme.BLACK};
  padding: 2px 6px;
  border-radius: 4px;
`;

export default SideMenu;
