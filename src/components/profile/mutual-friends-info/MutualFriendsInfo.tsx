import ProfileImageList from '@components/_common/profile-image-list/ProfileImageList';
import { Layout, Typo } from '@design-system';
import { User } from '@models/user';

interface MutualFriendsInfoProps {
  mutualFriends?: User[];
}

function MutualFriendsInfo({ mutualFriends = [] }: MutualFriendsInfoProps) {
  const getFriendDescription = (friendList: User[]) => {
    const firstTwoFriends = friendList.slice(0, 2);
    const restOfFriends = friendList.slice(2);
    return `${firstTwoFriends.map((friend) => friend.username).join(', ')} and ${
      restOfFriends.length
    } other mutual friends`;
  };

  if (!mutualFriends || mutualFriends.length === 0) return null;
  return (
    <Layout.FlexRow alignItems="center">
      <ProfileImageList images={mutualFriends.map((friend) => friend.profile_image)} size={25} />
      <Typo ml={12} type="label-medium">
        {getFriendDescription(mutualFriends)}
      </Typo>
    </Layout.FlexRow>
  );
}

export default MutualFriendsInfo;
