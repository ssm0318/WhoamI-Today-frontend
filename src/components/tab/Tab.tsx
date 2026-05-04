import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useMatch } from 'react-router-dom';
import { MAIN_SCROLL_CONTAINER_ID } from '@constants/scroll';
import { Layout, SvgIcon, Typo } from '@design-system';
import { resetScrollPosition } from '@hooks/useRestoreScrollPosition';
import { BrowseModeTabKey } from '@models/browseMode';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getVisibleTabs } from '@utils/browseModeTabs';
import {
  NavTabItem,
  StyledMessageCount,
  StyledTabItem,
  TabIconWrapper,
  TabWrapper,
} from './Tab.styled';

interface TabItemProps {
  to: string;
  type:
    | 'friends'
    | 'my'
    | 'share'
    | 'feed'
    | 'discover'
    | 'digest'
    | 'chats'
    | 'update'
    | 'questions';
  size?: number;
  end?: boolean;
}

// `digest` is the Ver. W rename of the `discover` tab — same route, icon, and scroll slot
// (only the label differs). Map other types to themselves.
const TAB_BASE_TYPE: Record<TabItemProps['type'], Exclude<TabItemProps['type'], 'digest'>> = {
  friends: 'friends',
  my: 'my',
  share: 'share',
  feed: 'feed',
  discover: 'discover',
  digest: 'discover',
  chats: 'chats',
  update: 'update',
  questions: 'questions',
};

function TabItem({ to, type, size = 48, end = false }: TabItemProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'nav_tab' });
  const myProfile = useBoundStore((state) => state.myProfile);
  const isChatPage = !!useMatch('/users/:username/chat');

  const unreadMsgCnt = myProfile?.unread_message_cnt ?? 0;

  const scrollToTop = (isActive: boolean) => () => {
    if (!isActive) return;

    const scrollEl = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
    if (!scrollEl) return;
    scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
    resetScrollPosition(`${TAB_BASE_TYPE[type]}Page`);
  };

  return (
    <NavTabItem to={to} end={end}>
      {({ isActive }) => {
        const resolvedActive = type === 'chats' ? isActive || isChatPage : isActive;
        return (
          <StyledTabItem w="100%" alignItems="center" onClick={scrollToTop(resolvedActive)}>
            {type === 'my' && myProfile?.profile_image ? (
              <img
                src={myProfile.profile_image}
                width={32}
                height={32}
                alt={`${myProfile?.username ?? 'user'}-profile`}
                className={resolvedActive ? 'active' : ''}
              />
            ) : (
              <StyledTabItem>
                {type === 'chats' && unreadMsgCnt > 0 && (
                  <StyledMessageCount t={-7} l="70%" pv={1} ph={5}>
                    <Typo type="label-small">{unreadMsgCnt > 999 ? '999+' : unreadMsgCnt}</Typo>
                  </StyledMessageCount>
                )}
                <TabIconWrapper>
                  <SvgIcon
                    name={`${TAB_BASE_TYPE[type]}_inactive`}
                    size={size}
                    className={resolvedActive ? 'hidden' : ''}
                  />
                  <SvgIcon
                    name={`${TAB_BASE_TYPE[type]}_active`}
                    size={size}
                    className={resolvedActive ? '' : 'hidden'}
                  />
                </TabIconWrapper>
              </StyledTabItem>
            )}
            <Typo type="label-large" color={resolvedActive ? 'PRIMARY' : 'LIGHT_GRAY'}>
              {t(type)}
            </Typo>
          </StyledTabItem>
        );
      }}
    </NavTabItem>
  );
}

export default function Tab() {
  const { featureFlags } = useBoundStore(UserSelector);
  const activeBrowseMode = useBoundStore((state) => state.activeBrowseMode);
  const isChatPage = !!useMatch('/users/:username/chat');

  // Single source of truth for tab visibility — shared with route-sync hook
  // and cold-start restore. See `getVisibleTabs` for the rules.
  const visibleKeys = useMemo(
    () => new Set(getVisibleTabs(featureFlags, activeBrowseMode).map((t) => t.key)),
    [featureFlags, activeBrowseMode],
  );
  const isTabAllowed = (key: BrowseModeTabKey) => visibleKeys.has(key);

  if (featureFlags?.checkInPosts) {
    return (
      <TabWrapper data-preview-exempt $noShadow={isChatPage}>
        <Layout.FlexRow w="100%" justifyContent="space-evenly" alignItems="center" pt={4}>
          {/* Ver. Q's first tab maps to the friends slot — uses friends icon/label, route stays /feed. */}
          {isTabAllowed('friends') && <TabItem to="/feed" type="friends" size={28} />}
          {isTabAllowed('discover') && <TabItem to="/discover" type="discover" size={28} />}
          {isTabAllowed('share') && <TabItem to="/share" type="share" size={28} />}
          {isTabAllowed('chats') && <TabItem to="/chats" type="chats" size={28} />}
          {isTabAllowed('my') && <TabItem to="/my" type="my" size={28} />}
        </Layout.FlexRow>
      </TabWrapper>
    );
  }

  return (
    <TabWrapper data-preview-exempt $noShadow={isChatPage}>
      <Layout.FlexRow w="100%" h="100%" justifyContent="space-evenly" alignItems="center">
        {featureFlags?.friendList ? (
          <>
            {isTabAllowed('friends') && <TabItem to="/friends" type="friends" size={28} />}
            {isTabAllowed('update') && <TabItem to="/update" type="update" size={28} />}
            {isTabAllowed('share') && <TabItem to="/share" type="share" size={28} />}
            {isTabAllowed('discover') && <TabItem to="/discover" type="digest" size={28} />}
          </>
        ) : featureFlags?.friendFeed ? (
          isTabAllowed('friends') && <TabItem to="/feed" type="friends" size={28} />
        ) : null}
        {featureFlags?.questionsTab && isTabAllowed('questions') && (
          <TabItem to="/questions" type="questions" size={28} />
        )}
        {featureFlags?.chatTab && isTabAllowed('chats') && (
          <TabItem to="/chats" type="chats" size={28} />
        )}
      </Layout.FlexRow>
    </TabWrapper>
  );
}
