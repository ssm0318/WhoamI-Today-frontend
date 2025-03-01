import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import FloatingButton from '@components/header/floating-button/FloatingButton';
import { MAIN_SCROLL_CONTAINER_ID } from '@constants/scroll';
import { Layout, SvgIcon, Typo } from '@design-system';
import { resetScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { NavTabItem, StyledTabItem, TabWrapper } from './Tab.styled';

interface TabItemProps {
  to: string;
  type: 'friends' | 'my' | 'questions';
  size?: number;
}

function TabItem({ to, type, size = 48 }: TabItemProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'nav_tab' });
  const myProfile = useBoundStore((state) => state.myProfile);

  // TODO: 안읽은 메시지 개수 얻기
  // const unReadMsgCnt = 15;

  const scrollToTop = (isActive: boolean) => () => {
    if (!isActive) return;

    const scrollEl = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
    if (!scrollEl) return;
    scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
    resetScrollPosition(`${type}Page`);
  };

  return (
    <NavTabItem to={to}>
      {({ isActive }) => (
        <StyledTabItem w="100%" alignItems="center" pt={10} onClick={scrollToTop(isActive)}>
          {type === 'my' && myProfile?.profile_image ? (
            <img
              src={myProfile.profile_image}
              width={32}
              height={32}
              alt={`${myProfile?.username ?? 'user'}-profile`}
              className={`${isActive ? 'active' : ''}`}
            />
          ) : (
            <StyledTabItem>
              {/* {type === 'chats' && unReadMsgCnt > 0 && (
                <StyledMessageCount t={-7} l="70%" pv={1} ph={5}>
                  <Typo type="label-small">{unReadMsgCnt > 999 ? '999+' : unReadMsgCnt}</Typo>
                </StyledMessageCount>
              )} */}
              <SvgIcon name={isActive ? `${type}_active` : `${type}_inactive`} size={size} />
            </StyledTabItem>
          )}
          <Typo type="label-large" color={isActive ? 'PRIMARY' : 'LIGHT_GRAY'}>
            {t(type)}
          </Typo>
        </StyledTabItem>
      )}
    </NavTabItem>
  );
}

export default function Tab() {
  const location = useLocation();
  const { featureFlags } = useBoundStore(UserSelector);

  const showFloatingButton =
    location.pathname === '/friends' ||
    location.pathname === '/friends/feed' ||
    location.pathname === '/my' ||
    location.pathname === '/questions';

  return (
    <TabWrapper>
      <Layout.FlexRow w="100%" justifyContent="center" alignItems="center" gap={80} pt={4}>
        {featureFlags?.friendList && <TabItem to="/friends" type="friends" size={28} />}
        {featureFlags?.friendFeed && <TabItem to="/friends/feed" type="friends" size={28} />}
        <TabItem to="/my" type="my" size={28} />
        {/* <TabItem to="/chats" type="chats" size={28} /> */}
        {featureFlags?.friendList && <TabItem to="/questions" type="questions" size={28} />}
      </Layout.FlexRow>
      {showFloatingButton && <FloatingButton />}
    </TabWrapper>
  );
}
