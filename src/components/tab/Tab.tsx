import { useTranslation } from 'react-i18next';
import { Font, Layout, SvgIcon } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { NavTabItem, TabWrapper } from './Tab.styled';

interface TabItemProps {
  to: string;
  type: 'friends' | 'my' | 'chats';
  size?: number;
}

function TabItem({ to, type, size = 48 }: TabItemProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'nav_tab' });
  const myProfile = useBoundStore((state) => state.myProfile);

  return (
    <NavTabItem to={to}>
      {({ isActive }) => (
        <Layout.FlexCol w="100%" alignItems="center">
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
            <SvgIcon name={isActive ? `${type}_active` : `${type}_inactive`} size={size} />
          )}
          <Font.Body type="14_semibold" color={isActive ? 'PRIMARY' : 'LIGHT_GRAY'}>
            {t(type)}
          </Font.Body>
        </Layout.FlexCol>
      )}
    </NavTabItem>
  );
}

export default function Tab() {
  return (
    <TabWrapper>
      <Layout.FlexRow w="100%" justifyContent="center" alignItems="center" gap={80} pt={4}>
        <TabItem to="/friends" type="friends" size={32} />
        <TabItem to="/my" type="my" size={32} />
        {/* TODO: 안읽은 메시지 개수 노출 */}
        <TabItem to="/chats" type="chats" size={32} />
      </Layout.FlexRow>
    </TabWrapper>
  );
}
