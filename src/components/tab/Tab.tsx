import { useTranslation } from 'react-i18next';

import { useMatch } from 'react-router-dom';
import { MAIN_SCROLL_CONTAINER_ID } from '@constants/scroll';
import { Layout, SvgIcon, Typo } from '@design-system';
import { resetScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { NavTabItem, StyledMessageCount, StyledTabItem, TabWrapper } from './Tab.styled';

interface TabItemProps {
  to: string;
  type: 'friends' | 'my' | 'share' | 'feed' | 'discover' | 'chats' | 'update' | 'questions';
  size?: number;
  end?: boolean;
}

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
    resetScrollPosition(`${type}Page`);
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
                <SvgIcon
                  name={resolvedActive ? `${type}_active` : `${type}_inactive`}
                  size={size}
                />
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

  if (featureFlags?.checkInPosts) {
    return (
      <TabWrapper>
        <Layout.FlexRow w="100%" justifyContent="space-evenly" alignItems="center" pt={4}>
          <TabItem to="/feed" type="feed" size={28} />
          <TabItem to="/share" type="share" size={28} />
          <TabItem to="/discover" type="discover" size={28} />
          <TabItem to="/chats" type="chats" size={28} />
          <TabItem to="/my" type="my" size={28} />
        </Layout.FlexRow>
      </TabWrapper>
    );
  }

  return (
    <TabWrapper>
      <Layout.FlexRow w="100%" h="100%" justifyContent="space-evenly" alignItems="center">
        {featureFlags?.friendList ? (
          <>
            <TabItem to="/friends" type="friends" size={28} />
            <TabItem to="/update" type="update" size={28} />
            <TabItem to="/share" type="share" size={28} />
            <TabItem to="/discover" type="discover" size={28} />
          </>
        ) : featureFlags?.friendFeed ? (
          <TabItem to="/feed" type="friends" size={28} />
        ) : null}
        {featureFlags?.questionsTab && <TabItem to="/questions" type="questions" size={28} />}
        {featureFlags?.chatTab && <TabItem to="/chats" type="chats" size={28} />}
      </Layout.FlexRow>
    </TabWrapper>
  );
}
