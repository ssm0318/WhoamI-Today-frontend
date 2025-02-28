import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import FriendStatus from '@components/_common/friend-status/FriendStatus';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import EditConnectionsBottomSheet from '@components/profile/edit-connections/EditConnectionsBottomSheet';
import { Layout, SvgIcon, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { Connection } from '@models/api/friends';
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
  const [t] = useTranslation('translation', { keyPrefix: 'user_page' });

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

  const [showEditConnectionsModal, setShowEditConnectionsModal] = useState(false);

  const closeEditConnectionsModal = () => setShowEditConnectionsModal(false);

  const handleClickChangeConnection = async () => {
    if (!user || isMyProfile(user) || !areFriends(user)) return;

    setShowEditConnectionsModal(true);
  };

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
              {/** connections */}
              {user && !isMyProfile(user) && areFriends(user) && (
                <>
                  {user.connection_status && (
                    <Layout.FlexRow
                      onClick={handleClickChangeConnection}
                      bgColor="SECONDARY"
                      pl={10}
                      pr={8}
                      pv={5}
                      rounded={8}
                      gap={5}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typo type="label-large" color="BLACK">
                        {user.connection_status === Connection.FRIEND
                          ? t('connection.friend')
                          : t('connection.close_friend')}
                      </Typo>
                      <Icon name="chevron_down" size={18} color="BLACK" />
                    </Layout.FlexRow>
                  )}
                  {showEditConnectionsModal && (
                    <EditConnectionsBottomSheet
                      user={user}
                      visible={showEditConnectionsModal}
                      closeBottomSheet={closeEditConnectionsModal}
                    />
                  )}
                </>
              )}
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
