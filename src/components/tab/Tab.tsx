import { SvgIcon } from '@design-system';
import { TabItem, TabWrapper } from './Tab.styled';

function Tab() {
  return (
    <TabWrapper>
      <TabItem to="/friends">
        {({ isActive }) => (
          <SvgIcon name={isActive ? 'friends_active' : 'friends_inactive'} size={36} color={null} />
        )}
      </TabItem>
      <TabItem to="/home">
        {({ isActive }) => (
          <SvgIcon name={isActive ? 'home_active' : 'home_inactive'} size={48} color={null} />
        )}
      </TabItem>
      <TabItem to="/my">
        {({ isActive }) => (
          <SvgIcon name={isActive ? 'my_active' : 'my_inactive'} size={36} color={null} />
        )}
      </TabItem>
    </TabWrapper>
  );
}

export default Tab;
