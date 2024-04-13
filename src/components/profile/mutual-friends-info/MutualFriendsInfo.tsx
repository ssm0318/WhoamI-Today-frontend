import { useTranslation } from 'react-i18next';
import ProfileImageList from '@components/_common/profile-image-list/ProfileImageList';
import { Layout, Typo } from '@design-system';
import { User } from '@models/user';

interface MutualFriendsInfoProps {
  mutualFriends?: User[];
}

function MutualFriendsInfo({ mutualFriends = [] }: MutualFriendsInfoProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page.mutual_friends' });

  const getFriendDescription = (friendList: User[]) => {
    const firstUserName = friendList[0].username;
    if (friendList.length === 1) return t('one', { firstUserName });

    const secondUserName = friendList[1].username;
    if (friendList.length === 2) return t('two', { firstUserName, secondUserName });

    const restOfFriends = friendList.slice(2);
    return t('others', {
      firstUserName,
      secondUserName,
      others: restOfFriends.length,
    });
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
