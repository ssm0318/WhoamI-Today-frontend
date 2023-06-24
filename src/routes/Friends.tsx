import { useState } from 'react';
import FriendList from '@components/friends/friend-list/FriendList';
import TheDaysDetail from '@components/the-days-detail/TheDaysDetail';
import { MOCK_MOMENT, MOCK_RESPONSES } from '@mock/myDetail';
import { User } from '@models/user';

function Friends() {
  const [selectedFriend, setSelectedFriend] = useState<User>();

  const selectFriend = (user: User) => {
    setSelectedFriend(user);
    // TODO: scroll to top
  };

  return (
    <>
      <FriendList selectFriend={selectFriend} selectedFriend={selectedFriend} />
      {selectedFriend && <TheDaysDetail moment={MOCK_MOMENT} responses={MOCK_RESPONSES} mt={111} />}
    </>
  );
}

export default Friends;
