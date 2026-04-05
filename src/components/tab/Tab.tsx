import { useTranslation } from 'react-i18next';

import { useLocation, useMatch } from 'react-router-dom';
import FloatingButton from '@components/header/floating-button/FloatingButton';
import { MAIN_SCROLL_CONTAINER_ID } from '@constants/scroll';
import { Layout, SvgIcon, Typo } from '@design-system';
import { resetScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { NavTabItem, StyledTabItem, TabWrapper } from './Tab.styled';

interface TabItemProps {
  to: string;
  type: 'friends' | 'my' | 'share' | 'feed' | 'discover' | 'chats' | 'update';
  size?: number;
  end?: boolean;
}

function TabItem({ to, type, size = 48, end = false }: TabItemProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'nav_tab' });
  const myProfile = useBoundStore((state) => state.myProfile);
  const isPingChat = !!useMatch('/users/:userId/ping');

  // TODO: Get unread message count
  // const unReadMsgCnt = 15;

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
        const resolvedActive = type === 'chats' ? isActive || isPingChat : isActive;
        return (
          <StyledTabItem w="100%" alignItems="center" pt={10} onClick={scrollToTop(resolvedActive)}>
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
                {/* {type === 'chats' && unReadMsg  Cnt > 0 && (
                <StyledMessageCount t={-7} l="70%" pv={1} ph={5}>
                  <Typo type="label-small">{unReadMsgCnt > 999 ? '999+' : unReadMsgCnt}</Typo>
                </StyledMessageCount>
              )} */}
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
  const location = useLocation();

  const { featureFlags } = useBoundStore(UserSelector);

  const showFloatingButton = location.pathname === '/friends' || location.pathname === '/feed';

  return (
    <TabWrapper>
      <Layout.FlexRow w="100%" justifyContent="space-evenly" alignItems="center" pt={4}>
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
        {featureFlags?.pingTab && <TabItem to="/my/pings" type="chats" size={28} />}
      </Layout.FlexRow>
      {showFloatingButton && <FloatingButton />}
    </TabWrapper>
  );
}
