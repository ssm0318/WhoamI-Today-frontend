import { TabItem, TabWrapper } from './Tab.styled';

function Tab() {
  return (
    <TabWrapper>
      <TabItem to="/friends">Friends</TabItem>
      <TabItem to="/">Today</TabItem>
      <TabItem to="/my">My</TabItem>
    </TabWrapper>
  );
}

export default Tab;
