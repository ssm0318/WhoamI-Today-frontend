import { useState } from 'react';
import FriendList from '@components/friends/friend-list/FriendList';
import { Layout } from '@design-system';
import { User } from '@models/user';

function Friends() {
  const [selectedFriend, setSelectedFriend] = useState<User>();

  return (
    <Layout.FlexCol w="100%">
      <FriendList selectFriend={setSelectedFriend} selectedFriend={selectedFriend} />
    </Layout.FlexCol>
  );
}

export default Friends;
