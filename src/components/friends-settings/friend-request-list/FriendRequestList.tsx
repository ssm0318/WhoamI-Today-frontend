import DeleteButton from '@components/_common/delete-button/DeleteButton';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Button, Font, Layout } from '@design-system';
import { friendList } from '@mock/friends';
import { User } from '@models/user';

function FriendRequestList() {
  // TODO: GET 받은 친구 요청 목록

  const onClickAcceptRequest = (friend: User) => () => {
    console.log('친구 요청 수락', friend.id);
  };

  const onClickCancelRequest = (friend: User) => () => {
    console.log('친구 요청 거절', friend.id);
  };

  return (
    <Layout.FlexCol w="100%" pl={10} pr={10} gap={8}>
      <Font.Body type="14_regular" color="GRAY_12" ml={5} mt={14} mb={2}>
        FRIEND REQUESTS ({friendList.length})
      </Font.Body>
      {friendList.length ? (
        <Layout.FlexCol w="100%" gap={8}>
          {friendList.map((friend) => (
            <Layout.FlexRow
              w="100%"
              key={friend.id}
              justifyContent="space-between"
              alignItems="center"
              pl={10}
              pt={4}
              pr={10}
              pb={4}
            >
              <Layout.FlexRow alignItems="center" gap={7}>
                <ProfileImage
                  imageUrl={friend.profile_image}
                  username={friend.username}
                  size={42}
                />
                <Font.Body type="14_semibold">{friend.username}</Font.Body>
              </Layout.FlexRow>
              <Layout.FlexRow gap={10}>
                <Button.Small
                  type="gray_fill"
                  status="normal"
                  text="ACCEPT"
                  onClick={onClickAcceptRequest(friend)}
                />
                <DeleteButton onClick={onClickCancelRequest(friend)} />
              </Layout.FlexRow>
            </Layout.FlexRow>
          ))}
        </Layout.FlexCol>
      ) : (
        <Layout.FlexRow
          w="100%"
          alignSelf="center"
          justifyContent="space-evenly"
          bgColor="GRAY_7"
          rounded={13}
          pt={10}
          pb={10}
        >
          <Layout.FlexCol w="100$" alignItems="center">
            <Font.Body type="14_semibold" color="GRAY_12">
              No pending requests
            </Font.Body>
            <Font.Body type="14_semibold" color="GRAY_12">
              You don&apos;t have any pending requests
            </Font.Body>
          </Layout.FlexCol>
        </Layout.FlexRow>
      )}
    </Layout.FlexCol>
  );
}

export default FriendRequestList;
