import { useNavigate, useParams } from 'react-router-dom';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, SvgIcon, Typo } from '@design-system';
import { MyProfile } from '@models/api/user';
import { UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import CheckInSection from '../check-in/CheckIn';
import MutualFriendsInfo from './mutual-friends-info/MutualFriendsInfo';

interface ProfileProps {
  user?: UserProfile | MyProfile;
}

function Profile({ user }: ProfileProps) {
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const isMyPage = user?.id === myProfile?.id;

  const { username } = useParams();
  const navigate = useNavigate();

  const handleClickEditProfile = () => {
    return navigate('/settings/edit-profile');
  };

  if (!user) return null;

  return (
    <Layout.FlexCol gap={8} w="100%">
      <Layout.FlexRow gap={8}>
        <ProfileImage imageUrl={user?.profile_image} username={username} size={80} />
        <Layout.FlexCol gap={8}>
          <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
            <Typo type="title-large">{isMyPage ? myProfile?.username : username}</Typo>
            {isMyPage && (
              <SvgIcon
                name="edit_filled"
                fill="DARK_GRAY"
                size={24}
                onClick={handleClickEditProfile}
              />
            )}
          </Layout.FlexRow>
          {/* bio */}
          {user.bio && (
            <Typo type="body-medium" numberOfLines={3}>
              {user.bio}
            </Typo>
          )}
        </Layout.FlexCol>
      </Layout.FlexRow>
      {/* 친구 목록 */}
      {!isMyPage && <MutualFriendsInfo mutualFriends={(user as UserProfile).mutuals} />}
      <CheckInSection user={user} />
    </Layout.FlexCol>
  );
}

export default Profile;
