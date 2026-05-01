import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';

import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import { Z_INDEX } from '@constants/layout';
import { ONBOARDING_VIDEO_URL } from '@constants/url';
import { Button, Layout, SvgIcon, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import { VersionType } from '@models/api/user';
import { useBoundStore } from '@stores/useBoundStore';
import { getMyPendingVersionSwapRequest } from '@utils/apis/user';

const SIDE_MENU_LIST = [
  { key: 'my_profile', path: '/my' },
  { key: 'survey_results', path: '/surveys' },
  { key: 'settings', path: '/settings' },
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

  const myProfile = useBoundStore((state) => state.myProfile);
  const { data: pendingResp } = useSWR(
    '/user/version-swap-request/me/',
    getMyPendingVersionSwapRequest,
  );
  const isPending = !!pendingResp?.pending;

  const handleClickMenu = (path: string) => () => {
    navigate(path);
    closeSideMenu();
  };

  const handleClickDimmed = () => {
    closeSideMenu();
  };

  const handleClickVersionSwap = () => {
    if (isPending) return;
    navigate('/settings/version-swap-request');
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
            {SIDE_MENU_LIST.map((menu) => (
              <button type="button" key={menu.key} onClick={handleClickMenu(menu.path)}>
                <Typo type="head-line">{t(menu.key)}</Typo>
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
                <Layout.FlexRow gap={4} alignItems="center">
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
                  text={isPending ? t('request_pending') : t('request_version_swap')}
                  sizing="fit-content"
                  onClick={handleClickVersionSwap}
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
