import { useTranslation } from 'react-i18next';
import { Layout, SvgIcon, Typo } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { NavTabItem, StyledMessageCount, StyledTabItem, TabWrapper } from './Tab.styled';

interface TabItemProps {
  to: string;
  type: 'friends' | 'my' | 'chats';
  size?: number;
}

function TabItem({ to, type, size = 48 }: TabItemProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'nav_tab' });
  const myProfile = useBoundStore((state) => state.myProfile);

  // TODO: 안읽은 메시지 개수 얻기
  const unReadMsgCnt = 1500;

  return (
    <NavTabItem to={to}>
      {({ isActive }) => (
        <StyledTabItem w="100%" alignItems="center" pt={10}>
          {type === 'my' && myProfile?.profile_image ? (
            <img
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              src={myProfile.profile_image!}
              width={32}
              height={32}
              alt={`${myProfile?.username ?? 'user'}-profile`}
              className={`${isActive ? 'active' : ''}`}
            />
          ) : (
            <StyledTabItem>
              {type === 'chats' && unReadMsgCnt > 0 && (
                <StyledMessageCount t={-7} l="70%" pv={1} ph={5}>
                  <Typo type="label-small">{unReadMsgCnt > 999 ? '999+' : unReadMsgCnt}</Typo>
                </StyledMessageCount>
              )}
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
  return (
    <TabWrapper>
      <Layout.FlexRow w="100%" justifyContent="center" alignItems="center" gap={80} pt={4}>
        <TabItem to="/friends" type="friends" size={28} />
        <TabItem to="/my" type="my" size={32} />
        <TabItem to="/chats" type="chats" size={28} />
      </Layout.FlexRow>
    </TabWrapper>
  );
}
