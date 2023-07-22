import { useEffect } from 'react';
import Loader from '@components/_common/loader/Loader';
import FriendItem from '@components/friends-settings/friend-item/FriendItem';
import { Font, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';

function FriendList() {
  const { friendList, getFriendList } = useBoundStore(UserSelector);

  useEffect(() => {
    getFriendList();
  }, [getFriendList]);

  return (
    <Layout.FlexCol w="100%" pl={10} pr={10} gap={8}>
      {friendList ? (
        <>
          <Font.Body type="14_regular" color="GRAY_12" ml={5} mt={14} mb={2}>
            {friendList.length} people
          </Font.Body>
          <Layout.FlexCol w="100%" gap={8}>
            {friendList.map((friend) => (
              <FriendItem key={friend.id} type="friends" friend={friend} />
            ))}
          </Layout.FlexCol>
        </>
      ) : (
        <Loader />
      )}
    </Layout.FlexCol>
  );
}

export default FriendList;
