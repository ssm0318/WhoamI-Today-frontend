import FriendItem from '@components/friends-settings/friend-item/FriendItem';
import { Font, Layout } from '@design-system';
import { friendList } from '@mock/friends';

function FriendList() {
  // TODO: GET 친구 목록

  return (
    <Layout.FlexCol w="100%" pl={10} pr={10} gap={8}>
      <Font.Body type="14_regular" color="GRAY_12" ml={5} mt={14} mb={2}>
        {friendList.length} people
      </Font.Body>
      <Layout.FlexCol w="100%" gap={8}>
        {friendList.map((friend) => (
          <FriendItem key={friend.id} type="friends" friend={friend} />
        ))}
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default FriendList;
