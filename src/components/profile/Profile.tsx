import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FriendStatus from '@components/_common/friend-status/FriendStatus';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, SvgIcon, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { MyProfile } from '@models/api/user';
import { areFriends, isMyProfile, UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { getUserProfile } from '@utils/apis/user';
import CheckInSection from '../check-in/CheckIn';
import MutualFriendsInfo from './mutual-friends-info/MutualFriendsInfo';

interface ProfileProps {
  user?: UserProfile | MyProfile;
}

function Profile({ user }: ProfileProps) {
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const isMyPage = user?.id === myProfile?.id;
  const [friendData, setFriendData] = useState<UserProfile | null>(null);

  const { username } = useParams();
  const navigate = useNavigate();

  const handleClickEditProfile = () => {
    return navigate('/settings/edit-profile');
  };

  useAsyncEffect(async () => {
    if (isMyPage || !username) return;
    const friend = await getUserProfile(username);

    setFriendData(friend);
  }, [isMyPage, username]);

  const reloadPage = () => window.location.reload();

  return (
    <Layout.FlexCol w="100%" gap={16}>
      <Layout.FlexRow w="100%" gap={8}>
        <ProfileImage imageUrl={user?.profile_image} username={username} size={80} />
        <Layout.FlexCol w="100%" gap={8}>
          <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
            {/* username / pronouns */}
            <Layout.FlexRow gap={8} alignItems="center">
              <Typo type="title-large" ellipsis={{ enabled: true, maxWidth: 160 }}>
                {isMyPage ? myProfile?.username || '' : username || ''}
              </Typo>

              <Typo type="label-medium">
                {(isMyPage ? myProfile?.pronouns : friendData?.pronouns) &&
                  `(${isMyPage ? myProfile?.pronouns : friendData?.pronouns})`}
              </Typo>
            </Layout.FlexRow>
            {/* edit icon */}
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
          {user?.bio && (
            <Typo type="body-medium" numberOfLines={3}>
              {user.bio}
            </Typo>
          )}
        </Layout.FlexCol>
      </Layout.FlexRow>
      {!isMyPage && user && (
        <>
          {!isMyProfile(user) && !areFriends(user) && (
            <FriendStatus
              type="user"
              user={user}
              onClickCancelRequest={reloadPage}
              onClickRequest={reloadPage}
              onClickConfirm={reloadPage}
              onClickReject={reloadPage}
              isUserPage
            />
          )}
          <MutualFriendsInfo mutualFriends={(user as UserProfile).mutuals} />
        </>
      )}
      {/* 체크인 */}
      {user && <CheckInSection user={user} />}
    </Layout.FlexCol>
  );
}

export default Profile;
