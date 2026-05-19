import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';

import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import { Chip as DeadlineChip } from '@components/survey/DeadlineBadge.styled';
import { FeatureFlagKey } from '@constants/featureFlag';
import { Z_INDEX } from '@constants/layout';
import { ONBOARDING_VIDEO_URL } from '@constants/url';
import { Button, Layout, SvgIcon, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import { useTrackEvent } from '@hooks/useTrackEvent';
import { VersionType } from '@models/api/user';
import { useBoundStore } from '@stores/useBoundStore';
import { logOnboardingEvent } from '@utils/apis/onboardingEvents';
import { getSurveyIndex } from '@utils/apis/survey';
import { getMyPendingVersionSwitchRequest } from '@utils/apis/user';
import { classifyPathnameAsSource } from '@utils/navSource';

interface SideMenuItem {
  key: string;
  emoji: string;
  path: string;
  flag?: FeatureFlagKey;
}

// Browsing Mode used to live here; moved to a header eye-icon button
// (`BrowseModeHeaderButton`) for 1-tap access. Sidebar stays focused on
// pages users navigate to less often.
const SIDE_MENU_LIST: SideMenuItem[] = [
  { key: 'my_profile', emoji: '👤', path: '/my' },
  { key: 'surveys', emoji: '📊', path: '/surveys' },
  { key: 'reimbursement', emoji: '💰', path: '/reimbursement' },
  { key: 'settings', emoji: '⚙️', path: '/settings' },
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
  const [tDeadline] = useTranslation('translation', { keyPrefix: 'deadline_badge' });
  const navigate = useNavigate();
  const postMessage = usePostAppMessage();
  const featureFlags = useBoundStore((state) => state.featureFlags);

  const myProfile = useBoundStore((state) => state.myProfile);
  const { data: surveyIndex } = useSWR('/surveys/index/', getSurveyIndex);
  const { data: pendingResp } = useSWR(
    '/user/version-switch-request/me/',
    getMyPendingVersionSwitchRequest,
  );
  const isPending = !!pendingResp?.pending;
  const dueSurveyCount =
    surveyIndex?.available_now.filter((entry) => !entry.allow_late).length ?? 0;

  const visibleItems = SIDE_MENU_LIST.filter((menu) => !menu.flag || featureFlags?.[menu.flag]);

  const trackEvent = useTrackEvent();
  const location = useLocation();
  // Source page where the menu was opened FROM. Tells us if users hit the
  // hamburger from /friends vs /discover vs /chats — entry-surface
  // engagement signal for the sidebar.
  const fromSource = classifyPathnameAsSource(location.pathname);

  // SideMenu is conditionally mounted by parent (only when open), so a
  // single mount-time event correctly equates to "user opened the menu".
  useEffect(() => {
    trackEvent('side_menu_opened', { from: fromSource });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickMenu = (menu: SideMenuItem) => () => {
    trackEvent('side_menu_item_tapped', { item_key: menu.key });
    if (menu.key === 'surveys') {
      logOnboardingEvent('survey_sidebar_nav_tapped', { from: fromSource }).catch(() => undefined);
    }
    navigate(menu.path);
    closeSideMenu();
  };

  const handleClickDimmed = () => {
    closeSideMenu();
  };

  const handleClickVersionSwitch = () => {
    if (isPending) return;
    trackEvent('version_switch_request_tapped', { from: fromSource });
    navigate('/settings/version-switch-request');
    closeSideMenu();
  };

  const handleClickOnboardingVideo = () => {
    // External link launch — distinct from the auto-prompt onboarding
    // because this is user-initiated (proactive help-seeking).
    trackEvent('onboarding_video_tapped', { from: fromSource });
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
            {myProfile && (
              <Layout.FlexCol gap={10} mb={20}>
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
            {visibleItems.map((menu) => (
              <MenuButton type="button" key={menu.key} onClick={handleClickMenu(menu)}>
                <MenuRow gap={6} alignItems="center">
                  <Layout.FlexRow gap={6} alignItems="center">
                    <EmojiItem
                      emojiString={menu.emoji}
                      size={20}
                      bgColor="TRANSPARENT"
                      outline="TRANSPARENT"
                    />
                    <Typo type="head-line">{t(menu.key)}</Typo>
                  </Layout.FlexRow>
                  {menu.key === 'surveys' && dueSurveyCount > 0 && (
                    <DeadlineChip>
                      ⏰{' '}
                      {tDeadline(
                        dueSurveyCount === 1 ? 'sidebar_count_one' : 'sidebar_count_other',
                        { count: dueSurveyCount },
                      )}
                    </DeadlineChip>
                  )}
                </MenuRow>
              </MenuButton>
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

const MenuButton = styled.button`
  width: 100%;
  text-align: left;
`;

const MenuRow = styled(Layout.FlexRow)`
  justify-content: space-between;
  width: 100%;
`;

export default SideMenu;
