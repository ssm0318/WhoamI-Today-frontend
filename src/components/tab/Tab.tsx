import { useTranslation } from 'react-i18next';
import { Font, Layout, SvgIcon } from '@design-system';
import { NavTabItem, TabWrapper } from './Tab.styled';

interface TabItemProps {
  to: string;
  type: 'friends' | 'my' | 'chats';
  size?: number;
}

function TabItem({ to, type, size = 48 }: TabItemProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'nav_tab' });

  return (
    <NavTabItem to={to}>
      {({ isActive }) => (
        <Layout.FlexCol w="100%" alignItems="center">
          <SvgIcon name={isActive ? `${type}_active` : `${type}_inactive`} size={size} />
          <Font.Body type="14_regular" color={isActive ? 'PRIMARY' : 'GRAY_2'}>
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
        <TabItem to="/home" type="chats" size={32} />
      </Layout.FlexRow>
    </TabWrapper>
  );
}
