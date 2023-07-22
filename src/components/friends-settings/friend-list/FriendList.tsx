import DeleteButton from '@components/_common/delete-button/DeleteButton';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Font, Layout } from '@design-system';
import { friendList } from '@mock/friends';
import { User } from '@models/user';

function FriendList() {
  // TODO: GET 친구 목록

  const onClickDeleteFriend = (friend: User) => () => {
    console.log('친구 삭제', friend.id);
  };

  return (
    <Layout.FlexCol w="100%">
      <Font.Body type="14_regular" color="GRAY_12" ml={15} mt={14} mb={12}>
        {friendList.length} people
      </Font.Body>
      <Layout.FlexCol w="100%" gap={8}>
        {friendList.map((friend) => (
          <Layout.FlexRow
            w="100%"
            key={friend.id}
            justifyContent="space-between"
            pl={10}
            pt={4}
            pr={10}
            pb={4}
          >
            <Layout.FlexRow alignItems="center" gap={7}>
              <ProfileImage imageUrl={friend.profile_image} username={friend.username} size={42} />
              <Font.Body type="14_semibold">{friend.username}</Font.Body>
            </Layout.FlexRow>
            <DeleteButton onClick={onClickDeleteFriend(friend)} />
          </Layout.FlexRow>
        ))}
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default FriendList;
