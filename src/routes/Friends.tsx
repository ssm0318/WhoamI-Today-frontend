import FriendList from '@components/friends/friend-list/FriendList';
import { Layout } from '@design-system';

function Friends() {
  return (
    <Layout.FlexCol w="100%">
      <FriendList />
    </Layout.FlexCol>
  );
}

export default Friends;
