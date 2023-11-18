import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Font, Layout } from '@design-system';
import { User } from '@models/user';

interface FriendsInfoProps {
  friends?: User[];
}

function FriendsInfo({ friends }: FriendsInfoProps) {
  const getFriendDescription = (friendList: User[]) => {
    const firstTwoFriends = friendList.slice(0, 2);
    const restOfFriends = friendList.slice(2);
    return `${firstTwoFriends.map((friend) => friend.username).join(', ')} and ${
      restOfFriends.length
    } other mutual friends`;
  };

  if (!friends || friends.length === 0) return null;
  return (
    <Layout.FlexRow alignItems="center">
      {friends.slice(0, 3).map((friend, index) => (
        <Layout.FlexRow key={friend.id} ml={index === 0 ? 0 : -10} z={3 - index}>
          <ProfileImage imageUrl={friend.profile_image} size={25} />
        </Layout.FlexRow>
      ))}
      <Font.Body ml={12} type="12_regular">
        {getFriendDescription(friends)}
      </Font.Body>
    </Layout.FlexRow>
  );
}

export default FriendsInfo;
